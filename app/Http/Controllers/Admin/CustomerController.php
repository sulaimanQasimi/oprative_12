<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Spatie\Permission\Models\Role;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $query = Customer::with(['users'])->latest();
        
        // Add search functionality
        if ($request->filled('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%")
                  ->orWhere('address', 'like', "%{$search}%");
            });
        }

        // Add status filter
        if ($request->filled('status')) {
            $query->where('status', $request->get('status'));
        }

        $customers = $query->paginate(10);
        
        // Append query parameters to pagination links
        $customers->appends($request->query());

        return Inertia::render('Admin/Customer/Index', [
            'customers' => $customers,
            'filters' => $request->only(['search', 'status']),
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Customer/Create', [
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email',
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive,pending',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $customer = Customer::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'status' => $validated['status'],
                'notes' => $validated['notes'],
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.customers.index')
                ->with('success', 'Customer created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating customer: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating customer: ' . $e->getMessage()]);
        }
    }

    public function show(Customer $customer, Request $request)
    {
        try {
            $customer = Customer::with(['users.roles.permissions'])->findOrFail($customer->id);

            // Load accounts with pagination and filtering
            $accountsQuery = $customer->accounts()
                ->with(['incomes', 'outcomes']);

            // Search functionality for accounts
            if ($request->filled('accounts_search')) {
                $search = $request->get('accounts_search');
                $accountsQuery->where(function ($q) use ($search) {
                    $q->where('name', 'like', "%{$search}%")
                      ->orWhere('account_number', 'like', "%{$search}%")
                      ->orWhere('id_number', 'like', "%{$search}%");
                });
            }

            // Status filter for accounts
            if ($request->filled('accounts_status')) {
                $accountsQuery->where('status', $request->get('accounts_status'));
            }

            $accounts = $accountsQuery->latest()->paginate(5, ['*'], 'accounts_page');
            
            // Transform accounts data
            $accounts->getCollection()->transform(function ($account) {
                return [
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
                ];
            });

            $roles = Role::where('guard_name', 'customer_user')->with('permissions')->get();
            $permissions = \Spatie\Permission\Models\Permission::where('guard_name', 'customer_user')->get();
            return Inertia::render('Admin/Customer/Show', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'address' => $customer->address,
                    'status' => $customer->status,
                    'notes' => $customer->notes,
                    'users' => $customer->users,
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                ],
                'accounts' => $accounts,
                'accounts_filters' => $request->only(['accounts_search', 'accounts_status']),
                'roles' => $roles,
                'permissions' => $permissions,
                'auth' => [
                    'user' => Auth::guard('web')->user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading customer: ' . $e->getMessage());
            return redirect()->route('admin.customers.index')
                ->with('error', 'Error loading customer: ' . $e->getMessage());
        }
    }

    public function edit(Customer $customer)
    {
        return Inertia::render('Admin/Customer/Edit', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'phone' => $customer->phone,
                'address' => $customer->address,
                'status' => $customer->status,
                'notes' => $customer->notes,
            ],
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|unique:customers,email,' . $customer->id,
            'phone' => 'nullable|string|max:20',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:active,inactive,pending',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            $customer->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'phone' => $validated['phone'],
                'address' => $validated['address'],
                'status' => $validated['status'],
                'notes' => $validated['notes'],
            ]);

            return redirect()->route('admin.customers.show', $customer->id)
                ->with('success', 'Customer updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating customer: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating customer: ' . $e->getMessage()]);
        }
    }

    public function destroy(Customer $customer)
    {
        try {
            // Delete associated users first
            $customer->users()->delete();
            $customer->delete();

            return redirect()->route('admin.customers.index')
                ->with('success', 'Customer deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting customer: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting customer: ' . $e->getMessage());
        }
    }

    public function addUser(Request $request, Customer $customer)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customer_users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);

        try {
            // Create the user
            $user = CustomerUser::create([
                'customer_id' => $customer->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign role
            $role = Role::findByName($validated['role'], 'customer_user');
            $user->assignRole($role);

            // Assign additional permissions if any
            if (!empty($validated['permissions'])) {
                $user->givePermissionTo($validated['permissions']);
            }

            return redirect()->route('admin.customers.show', $customer->id)
                ->with('success', 'User added successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.customers.show', $customer->id)
                ->with('error', 'Error adding user: ' . $e->getMessage());
        }
    }

    public function updateUser(Request $request, Customer $customer, CustomerUser $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:customer_users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);

        try {
            // Update user details
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // Update password if provided
            if (!empty($validated['password'])) {
                $user->update(['password' => Hash::make($validated['password'])]);
            }

            // Update role
            $role = Role::findByName($validated['role'], 'customer_user');
            $user->syncRoles([$role]);

            // Update permissions
            if (isset($validated['permissions'])) {
                $user->syncPermissions($validated['permissions']);
            }

            return redirect()->route('admin.customers.show', $customer->id)
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.customers.show', $customer->id)
                ->with('error', 'Error updating user: ' . $e->getMessage());
        }
    }

    public function income(Customer $customer)
    {
        try {
            // Load customer with income records and related data
            $customer = Customer::with([
                'customerStockIncome.product'
            ])->findOrFail($customer->id);

            // Get customer income records
            $incomes = $customer->customerStockIncome->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference_number' => $income->reference_number,
                    'product' => [
                        'id' => $income->product->id,
                        'name' => $income->product->name,
                        'barcode' => $income->product->barcode,
                        'type' => $income->product->type,
                    ],
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'description' => $income->description,
                    'status' => $income->status,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ];
            });

            return Inertia::render('Admin/Customer/Income', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'status' => $customer->status,
                ],
                'incomes' => $incomes,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading customer income: ' . $e->getMessage());
            return redirect()->route('admin.customers.show', $customer->id)
                ->with('error', 'Error loading customer income: ' . $e->getMessage());
        }
    }

    public function outcome(Customer $customer)
    {
        try {
            // Load customer with outcome records and related data
            $customer = Customer::with([
                'customerStockOutcome.product'
            ])->findOrFail($customer->id);

            // Get customer outcome records
            $outcomes = $customer->customerStockOutcome->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'quantity' => $outcome->quantity,
                    'total' => $outcome->total,
                    'description' => $outcome->description,
                    'reason' => $outcome->reason,
                    'status' => $outcome->status,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
                ];
            });

            return Inertia::render('Admin/Customer/Outcome', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'status' => $customer->status,
                ],
                'outcomes' => $outcomes,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading customer outcome: ' . $e->getMessage());
            return redirect()->route('admin.customers.show', $customer->id)
                ->with('error', 'Error loading customer outcome: ' . $e->getMessage());
        }
    }

    public function orders(Customer $customer)
    {
        try {
            // Load customer with market orders
            $customer = Customer::with([
                'marketOrders.items.product'
            ])->findOrFail($customer->id);

            // Get customer market orders
            $orders = $customer->marketOrders->map(function ($order) {
                return [
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
                ];
            });

            return Inertia::render('Admin/Customer/Orders/Index', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'status' => $customer->status,
                ],
                'orders' => $orders,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading customer orders: ' . $e->getMessage());
            return redirect()->route('admin.customers.show', $customer->id)
                ->with('error', 'Error loading customer orders: ' . $e->getMessage());
        }
    }

    public function showOrder(Customer $customer, $orderId)
    {
        try {
            // Load the specific order with items and products
            $order = \App\Models\MarketOrder::with([
                'items.product',
                'customer'
            ])->where('customer_id', $customer->id)
              ->findOrFail($orderId);

            // Format order items
            $orderItems = $order->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'barcode' => $item->product->barcode,
                        'type' => $item->product->type,
                    ],
                    'quantity' => $item->quantity,
                    'unit_price' => $item->unit_price,
                    'subtotal' => $item->subtotal,
                    'discount_amount' => $item->discount_amount,
                    'notes' => $item->notes,
                ];
            });

            return Inertia::render('Admin/Customer/Orders/Show', [
                'customer' => [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'status' => $customer->status,
                ],
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
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading customer order: ' . $e->getMessage());
            return redirect()->route('admin.customers.orders', $customer->id)
                ->with('error', 'Error loading customer order: ' . $e->getMessage());
        }
    }
}
