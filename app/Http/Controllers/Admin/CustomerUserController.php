<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Illuminate\Http\RedirectResponse;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Permission;

/**
 * CustomerUserController handles all customer user-related operations.
 * 
 * This controller manages CRUD operations for customer users with
 * policy-based authorization using the CustomerPolicy.
 */
class CustomerUserController extends Controller
{
    /**
     * Display a listing of customer users.
     * 
     * @return Response
     */
    public function index(): Response
    {
        $this->authorize('viewAnyCustomerUser', Customer::class);

        $customerUsers = CustomerUser::with(['customer', 'roles', 'permissions'])->paginate(10);

        // Pass customer permissions to frontend
        $permissions = [
            'view_customer' => Auth::user()->can('view_customer'),
            'create_customer' => Auth::user()->can('create_customer'),
            'update_customer' => Auth::user()->can('update_customer'),
            'view_any_customer' => Auth::user()->can('view_any_customer'),
        ];

        return Inertia::render('Admin/CustomerUser/Index', [
            'customerUsers' => $customerUsers,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new customer user.
     * 
     * @param Request $request
     * @return Response
     */
    public function create(Request $request): Response
    {
        $this->authorize('createCustomerUser', Customer::class);

        $customers = Customer::all();
        $permissions = Permission::where('guard_name', 'customer_user')->get();
        $selectedCustomerId = $request->get('customer_id');

        return Inertia::render('Admin/CustomerUser/Create', [
            'customers' => $customers,
            'permissions' => $permissions,
            'selectedCustomerId' => $selectedCustomerId,
        ]);
    }

    /**
     * Store a newly created customer user in storage.
     * 
     * @param Request $request
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function store(Request $request): RedirectResponse
    {
        $this->authorize('createCustomerUser', Customer::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customer_users',
            'password' => 'required|string|min:8|confirmed',
            'customer_id' => 'required|exists:customers,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            DB::beginTransaction();

            $customerUser = CustomerUser::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
                'customer_id' => $validated['customer_id'],
            ]);

            // Assign permissions
            if ($request->has('permissions')) {
                $permissions = Permission::whereIn('id', $request->permissions)
                    ->where('guard_name', 'customer_user')
                    ->get();
                $customerUser->syncPermissions($permissions);
            }

            DB::commit();

            return redirect()->route('admin.customer-users.index')
                ->with('success', 'Customer user created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer user creation failed', [
                'error' => $e->getMessage(),
                'user_id' => Auth::id(),
                'data' => $validated
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Error creating customer user: ' . $e->getMessage());
        }
    }

    /**
     * Display the specified customer user.
     * 
     * @param CustomerUser $customerUser
     * @return Response
     */
    public function show(CustomerUser $customerUser): Response
    {
        $this->authorize('viewCustomerUser', Customer::class);

        $customerUser->load(['customer', 'permissions']);

        // Pass customer permissions to frontend
        $permissions = [
            'view_customer' => Auth::user()->can('view_customer'),
            'update_customer' => Auth::user()->can('update_customer'),
        ];

        return Inertia::render('Admin/CustomerUser/Show', [
            'customerUser' => $customerUser,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for editing the specified customer user.
     * 
     * @param CustomerUser $customerUser
     * @return Response
     */
    public function edit(CustomerUser $customerUser): Response
    {
        $this->authorize('updateCustomerUser', Customer::class);

        $customers = Customer::all();
        $permissions = Permission::where('guard_name', 'customer_user')->get();
        $customerUser->load(['customer', 'permissions']);
        
        return Inertia::render('Admin/CustomerUser/Edit', [
            'customerUser' => $customerUser,
            'customers' => $customers,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified customer user in storage.
     * 
     * @param Request $request
     * @param CustomerUser $customerUser
     * @return RedirectResponse
     * @throws ValidationException
     */
    public function update(Request $request, CustomerUser $customerUser): RedirectResponse
    {
        $this->authorize('updateCustomerUser', Customer::class);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customer_users,email,' . $customerUser->id,
            'password' => 'nullable|string|min:8|confirmed',
            'customer_id' => 'required|exists:customers,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        try {
            DB::beginTransaction();

            $customerUser->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'customer_id' => $validated['customer_id'],
            ]);

            if ($request->filled('password')) {
                $customerUser->update([
                    'password' => Hash::make($validated['password']),
                ]);
            }

            // Sync permissions
            if ($request->has('permissions')) {
                $permissions = Permission::whereIn('id', $request->permissions)
                    ->where('guard_name', 'customer_user')
                    ->get();
                $customerUser->syncPermissions($permissions);
            } else {
                $customerUser->syncPermissions([]);
            }

            DB::commit();

            return redirect()->route('admin.customer-users.index')
                ->with('success', 'Customer user updated successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Customer user update failed', [
                'customer_user_id' => $customerUser->id,
                'error' => $e->getMessage(),
                'data' => $validated
            ]);

            return redirect()->back()
                ->withInput()
                ->with('error', 'Error updating customer user: ' . $e->getMessage());
        }
    }

    /**
     * Remove the specified customer user from storage.
     * 
     * @param CustomerUser $customerUser
     * @return RedirectResponse
     */
    public function destroy(CustomerUser $customerUser): RedirectResponse
    {
        $this->authorize('deleteCustomerUser', Customer::class);

        try {
            $customerUser->delete();

            return redirect()->route('admin.customer-users.index')
                ->with('success', 'Customer user deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Customer user deletion failed', [
                'customer_user_id' => $customerUser->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()
                ->with('error', 'Error deleting customer user: ' . $e->getMessage());
        }
    }
}
