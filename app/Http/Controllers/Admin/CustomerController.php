<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Http\Response as HttpResponse;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

/**
 * CustomerController handles all customer-related operations.
 * 
 * This controller manages CRUD operations for customers, their users,
 * financial records (income/outcome), and order management with
 * comprehensive permission-based access control.
 */
class CustomerController extends Controller
{
    /**
     * Apply middleware protection for all customer operations.
     * 
     * Uses Laravel policy-based authorization with comprehensive permission system:
     * - viewAny: Access to index/list page
     * - view: Access to individual customer details and sub-pages
     * - create: Create new customers
     * - update: Edit existing customers
     * - delete: Soft delete customers
     * - restore: Restore soft-deleted customers
     * - forceDelete: Permanently delete customers
     * - manageUsers: Manage customer users (requires update permission)
     * - viewFinancials: View financial records (requires view permission)
     */
    public function __construct()
    {
        // Policy-based authorization will be handled in individual methods
    }

    /**
     * Display a paginated listing of customers with search and filtering.
     * 
     * @param Request $request
     * @return Response
     */
    public function index(Request $request): Response
    {
        $this->authorize('viewAny', Customer::class);
        
        $query = Customer::with(['users'])->latest();
        
        // Apply search filters
        $this->applySearchFilters($query, $request);
        
        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->string('status'));
        }

        $customers = $query->paginate(10);
        $customers->appends($request->query());

        return Inertia::render('Admin/Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
            'permissions' => $this->getCustomerPermissions(),
        ]);
    }

    /**
     * Show the form for creating a new customer.
     * 
     * @return Response
     */
    public function create(): Response
    {
        return Inertia::render('Admin/Customer/Create', [
            'permissions' => $this->getCustomerPermissions(),
        ]);
    }

    /**
     * Store a newly created customer in storage.
     * 
     * @param Request $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $validated = $this->validateCustomerData($request);

        try {
            DB::beginTransaction();
            
            $customer = Customer::create([
                ...$validated,
                'user_id' => Auth::id(),
            ]);

            DB::commit();

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer created successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer creation failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'data' => $validated
            ]);
            
            return $this->handleError($e, 'Error creating customer');
        }
    }

    /**
     * Display the specified customer with related data.
     * 
     * @param Customer $customer
     * @param Request $request
     * @return Response|RedirectResponse
     */
    public function show(Customer $customer, Request $request): Response|RedirectResponse
    {
        $this->authorize('view', $customer);
        
        try {
            $customer->load(['users.roles.permissions']);
            
            // Load paginated accounts with filtering
            $accounts = $this->getCustomerAccounts($customer, $request);
            
            // Get roles and permissions for customer user management
            $roles = Role::where('guard_name', 'customer_user')
                         ->with('permissions')
                         ->get();
                         
            $customerUserPermissions = Permission::where('guard_name', 'customer_user')->get();
            
            return Inertia::render('Admin/Customer/Show', [
                'customer' => $this->formatCustomerData($customer),
                'accounts' => $accounts,
                'accounts_filters' => $request->only(['accounts_search', 'accounts_status']),
                'roles' => $roles,
                'permissions' => $this->getCustomerPermissions(),
                'customerUserPermissions' => $customerUserPermissions,
                'auth' => ['user' => Auth::user()]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Customer display failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()
                ->route('admin.customers.index')
                ->with('error', 'Error loading customer details.');
        }
    }

    /**
     * Show the form for editing the specified customer.
     * 
     * @param Customer $customer
     * @return Response
     */
    public function edit(Customer $customer): Response
    {
        return Inertia::render('Admin/Customer/Edit', [
            'customer' => $this->formatCustomerData($customer),
            'permissions' => $this->getCustomerPermissions(),
            'auth' => ['user' => Auth::user()]
        ]);
    }

    /**
     * Update the specified customer in storage.
     * 
     * @param Request $request
     * @param Customer $customer
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function update(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $this->validateCustomerData($request, $customer->id);

        try {
            DB::beginTransaction();
            
            $customer->update($validated);
            
            DB::commit();

            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('success', 'Customer updated successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer update failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            
            return $this->handleError($e, 'Error updating customer');
        }
    }

    /**
     * Soft delete the specified customer.
     * 
     * @param Customer $customer
     * @return RedirectResponse
     */
    public function destroy(Customer $customer): RedirectResponse
    {
        try {
            DB::beginTransaction();
            
            // Soft delete associated users first
            $customer->users()->delete();
            $customer->delete();
            
            DB::commit();

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer deleted successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer deletion failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            
            return $this->handleError($e, 'Error deleting customer');
        }
    }

    /**
     * Restore a soft-deleted customer.
     * 
     * @param string $id
     * @return RedirectResponse
     */
    public function restore(string $id): RedirectResponse
    {
        try {
            $customer = Customer::withTrashed()->findOrFail($id);
            
            DB::beginTransaction();
            
            $customer->restore();
            $customer->users()->restore();
            
            DB::commit();

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer restored successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer restoration failed', [
                'customer_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return $this->handleError($e, 'Error restoring customer');
        }
    }

    /**
     * Permanently delete a customer and all related data.
     * 
     * @param string $id
     * @return RedirectResponse
     */
    public function forceDelete(string $id): RedirectResponse
    {
        try {
            $customer = Customer::withTrashed()->findOrFail($id);
            
            DB::beginTransaction();
            
            // Force delete associated users first
            $customer->users()->forceDelete();
            $customer->forceDelete();
            
            DB::commit();

            return redirect()
                ->route('admin.customers.index')
                ->with('success', 'Customer permanently deleted.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer force deletion failed', [
                'customer_id' => $id,
                'error' => $e->getMessage()
            ]);
            
            return $this->handleError($e, 'Error permanently deleting customer');
        }
    }

    /**
     * Add a new user to the specified customer.
     * 
     * @param Request $request
     * @param Customer $customer
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function addUser(Request $request, Customer $customer): RedirectResponse
    {
        $validated = $this->validateCustomerUserData($request);

        try {
            DB::beginTransaction();
            
            // Create the user
            $user = CustomerUser::create([
                'customer_id' => $customer->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign role and permissions
            $this->assignUserRoleAndPermissions($user, $validated);
            
            DB::commit();

            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('success', 'User added successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer user creation failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            
            return $this->handleError($e, 'Error adding user');
        }
    }

    /**
     * Update an existing customer user.
     * 
     * @param Request $request
     * @param Customer $customer
     * @param CustomerUser $user
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function updateUser(Request $request, Customer $customer, CustomerUser $user): RedirectResponse
    {
        $validated = $this->validateCustomerUserData($request, $user->id);

        try {
            DB::beginTransaction();
            
            // Update user details
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // Update password if provided
            if (!empty($validated['password'])) {
                $user->update(['password' => Hash::make($validated['password'])]);
            }

            // Update role and permissions
            $this->assignUserRoleAndPermissions($user, $validated);
            
            DB::commit();

            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('success', 'User updated successfully.');
                
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer user update failed', [
                'customer_id' => $customer->id,
                'user_id' => $user->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);
            
            return $this->handleError($e, 'Error updating user');
        }
    }

    /**
     * Display customer income records.
     * 
     * @param Customer $customer
     * @return Response
     */
    public function income(Customer $customer): Response
    {
        try {
            $customer->load(['customerStockIncome.product']);

            $incomes = $customer->customerStockIncome->map(fn($income) => [
                'id' => $income->id,
                'reference_number' => $income->reference_number,
                'product' => $this->formatProductData($income->product),
                'quantity' => $income->quantity,
                'price' => $income->price,
                'total' => $income->total,
                'description' => $income->description,
                'status' => $income->status,
                'created_at' => $income->created_at,
                'updated_at' => $income->updated_at,
            ]);

            return Inertia::render('Admin/Customer/Income', [
                'customer' => $this->formatCustomerData($customer),
                'incomes' => $incomes,
                'permissions' => $this->getCustomerPermissions(),
                'auth' => ['user' => Auth::user()]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Customer income display failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('error', 'Error loading customer income data.');
        }
    }

    /**
     * Display customer outcome records.
     * 
     * @param Customer $customer
     * @return Response
     */
    public function outcome(Customer $customer): Response
    {
        try {
            $customer->load(['customerStockOutcome.product']);

            $outcomes = $customer->customerStockOutcome->map(fn($outcome) => [
                'id' => $outcome->id,
                'reference_number' => $outcome->reference_number,
                'product' => $this->formatProductData($outcome->product),
                'quantity' => $outcome->quantity,
                'total' => $outcome->total,
                'description' => $outcome->description,
                'reason' => $outcome->reason,
                'status' => $outcome->status,
                'created_at' => $outcome->created_at,
                'updated_at' => $outcome->updated_at,
            ]);

            return Inertia::render('Admin/Customer/Outcome', [
                'customer' => $this->formatCustomerData($customer),
                'outcomes' => $outcomes,
                'permissions' => $this->getCustomerPermissions(),
                'auth' => ['user' => Auth::user()]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Customer outcome display failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('error', 'Error loading customer outcome data.');
        }
    }

    /**
     * Display customer market orders.
     * 
     * @param Customer $customer
     * @return Response
     */
    public function orders(Customer $customer): Response
    {
        try {
            $customer->load(['marketOrders.items.product']);

            $orders = $customer->marketOrders->map(fn($order) => [
                'id' => $order->id,
                'order_number' => $order->order_number,
                'total_amount' => $order->total_amount,
                'subtotal' => $order->subtotal,
                'tax_amount' => $order->tax_amount,
                'discount_amount' => $order->discount_amount,
                'payment_method' => $order->payment_method,
                'payment_status' => $order->payment_status,
                'order_status' => $order->order_status,
                'status' => $order->status,
                'notes' => $order->notes,
                'items_count' => $order->items->count(),
                'total_quantity' => $order->items->sum('quantity'),
                'created_at' => $order->created_at,
                'updated_at' => $order->updated_at,
            ]);

            return Inertia::render('Admin/Customer/Orders/Index', [
                'customer' => $this->formatCustomerData($customer),
                'orders' => $orders,
                'permissions' => $this->getCustomerPermissions(),
                'auth' => ['user' => Auth::user()]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Customer orders display failed', [
                'customer_id' => $customer->id,
                'error' => $e->getMessage()
            ]);
            
            return redirect()
                ->route('admin.customers.show', $customer)
                ->with('error', 'Error loading customer orders.');
        }
    }

    /**
     * Display a specific customer order.
     * 
     * @param Customer $customer
     * @param string $orderId
     * @return Response
     */
    public function showOrder(Customer $customer, string $orderId): Response
    {
        try {
            $order = \App\Models\MarketOrder::with(['items.product', 'customer'])
                ->where('customer_id', $customer->id)
                ->findOrFail($orderId);

            $orderItems = $order->items->map(fn($item) => [
                'id' => $item->id,
                'product' => $this->formatProductData($item->product),
                'quantity' => $item->quantity,
                'unit_price' => $item->unit_price,
                'subtotal' => $item->subtotal,
                'discount_amount' => $item->discount_amount,
                'notes' => $item->notes,
            ]);

            return Inertia::render('Admin/Customer/Orders/Show', [
                'customer' => $this->formatCustomerData($customer),
                'order' => [
                    'id' => $order->id,
                    'order_number' => $order->order_number,
                    'total_amount' => $order->total_amount,
                    'subtotal' => $order->subtotal,
                    'tax_amount' => $order->tax_amount,
                    'discount_amount' => $order->discount_amount,
                    'payment_method' => $order->payment_method,
                    'payment_status' => $order->payment_status,
                    'order_status' => $order->order_status,
                    'status' => $order->status,
                    'notes' => $order->notes,
                    'created_at' => $order->created_at,
                    'updated_at' => $order->updated_at,
                ],
                'orderItems' => $orderItems,
                'permissions' => $this->getCustomerPermissions(),
                'auth' => ['user' => Auth::user()]
            ]);
            
        } catch (\Exception $e) {
            Log::error('Customer order display failed', [
                'customer_id' => $customer->id,
                'order_id' => $orderId,
                'error' => $e->getMessage()
            ]);
            
            return redirect()
                ->route('admin.customers.orders', $customer)
                ->with('error', 'Error loading order details.');
        }
    }

    // ============================================================================
    // PRIVATE HELPER METHODS
    // ============================================================================

    /**
     * Apply search filters to the customer query.
     * 
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param Request $request
     * @return void
     */
    private function applySearchFilters($query, Request $request): void
    {
        if ($request->filled('search')) {
            $search = $request->string('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }
    }

    /**
     * Get customer accounts with pagination and filtering.
     * 
     * @param Customer $customer
     * @param Request $request
     * @return \Illuminate\Pagination\LengthAwarePaginator
     */
    private function getCustomerAccounts(Customer $customer, Request $request)
    {
        $accountsQuery = $customer->accounts()->with(['incomes', 'outcomes']);

        // Apply search filters
        if ($request->filled('accounts_search')) {
            $search = $request->string('accounts_search');
            $accountsQuery->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('accounts_status')) {
            $accountsQuery->where('status', $request->string('accounts_status'));
        }

        $accounts = $accountsQuery->latest()->paginate(5, ['*'], 'accounts_page');
        
        // Transform accounts data
        $accounts->getCollection()->transform(fn($account) => [
            'id' => $account->id,
            'name' => $account->name,
            'account_number' => $account->account_number,
            'id_number' => $account->id_number,
            'address' => $account->address,
            'status' => $account->status ?? 'active',
            'approved_by' => $account->approved_by,
            'total_income' => $account->incomes->where('status', 'approved')->sum('amount'),
            'total_outcome' => $account->outcomes->where('status', 'approved')->sum('amount'),
            'balance' => $account->incomes->where('status', 'approved')->sum('amount') - 
                       $account->outcomes->where('status', 'approved')->sum('amount'),
            'incomes_count' => $account->incomes->count(),
            'outcomes_count' => $account->outcomes->count(),
            'created_at' => $account->created_at,
            'updated_at' => $account->updated_at,
        ]);

        return $accounts;
    }

    /**
     * Get all customer permissions for the authenticated user.
     * 
     * @return array<string, bool>
     */
    private function getCustomerPermissions(): array
    {
        $user = Auth::user();
        
        return [
            'view_customer' => $user->can('view_customer'),
            'view_any_customer' => $user->can('view_any_customer'),
            'create_customer' => $user->can('create_customer'),
            'update_customer' => $user->can('update_customer'),
            'delete_customer' => $user->can('delete_customer'),
            'restore_customer' => $user->can('restore_customer'),
            'force_delete_customer' => $user->can('force_delete_customer'),
        ];
    }

    /**
     * Validate customer data for create and update operations.
     * 
     * @param Request $request
     * @param int|null $customerId
     * @return array<string, mixed>
     * @throws ValidationException
     */
    private function validateCustomerData(Request $request, ?int $customerId = null): array
    {
        $emailRule = $customerId 
            ? "nullable|email|unique:customers,email,{$customerId}"
            : 'nullable|email|unique:customers,email';

        return $request->validate([
            'name' => 'required|string|max:255',
            'email' => $emailRule,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive,pending',
            'notes' => 'nullable|string|max:1000',
        ]);
    }

    /**
     * Validate customer user data for create and update operations.
     * 
     * @param Request $request
     * @param int|null $userId
     * @return array<string, mixed>
     * @throws ValidationException
     */
    private function validateCustomerUserData(Request $request, ?int $userId = null): array
    {
        $emailRule = $userId 
            ? "required|email|unique:customer_users,email,{$userId}"
            : 'required|email|unique:customer_users,email';

        $passwordRule = $userId ? 'nullable|string|min:8' : 'required|string|min:8';

        return $request->validate([
            'name' => 'required|string|max:255',
            'email' => $emailRule,
            'password' => $passwordRule,
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);
    }

    /**
     * Assign role and permissions to a customer user.
     * 
     * @param CustomerUser $user
     * @param array<string, mixed> $validated
     * @return void
     */
    private function assignUserRoleAndPermissions(CustomerUser $user, array $validated): void
    {
        // Assign role
        $role = Role::findByName($validated['role'], 'customer_user');
        $user->syncRoles([$role]);

        // Assign additional permissions if any
        if (!empty($validated['permissions'])) {
            $user->syncPermissions($validated['permissions']);
        } else {
            $user->syncPermissions([]);
        }
    }

    /**
     * Format customer data for frontend consumption.
     * 
     * @param Customer $customer
     * @return array<string, mixed>
     */
    private function formatCustomerData(Customer $customer): array
    {
        return [
            'id' => $customer->id,
            'name' => $customer->name,
            'email' => $customer->email,
            'phone' => $customer->phone,
            'address' => $customer->address,
            'status' => $customer->status,
            'notes' => $customer->notes,
            'users' => $customer->users ?? [],
            'created_at' => $customer->created_at,
            'updated_at' => $customer->updated_at,
        ];
    }

    /**
     * Format product data for frontend consumption.
     * 
     * @param \App\Models\Product $product
     * @return array<string, mixed>
     */
    private function formatProductData($product): array
    {
        return [
            'id' => $product->id,
            'name' => $product->name,
            'barcode' => $product->barcode,
            'type' => $product->type,
        ];
    }

    /**
     * Handle exceptions and return appropriate redirect response.
     * 
     * @param \Exception $exception
     * @param string $defaultMessage
     * @return RedirectResponse
     */
    private function handleError(\Exception $exception, string $defaultMessage): RedirectResponse
    {
        return redirect()
            ->back()
            ->withInput()
            ->with('error', $defaultMessage . ': ' . $exception->getMessage());
    }
}
