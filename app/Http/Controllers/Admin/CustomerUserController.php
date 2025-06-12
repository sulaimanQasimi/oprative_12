<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class CustomerUserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $customerUsers = CustomerUser::with(['customer', 'roles', 'permissions'])->paginate(10);

        return Inertia::render('Admin/CustomerUser/Index', [
            'customerUsers' => $customerUsers,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(Request $request)
    {
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
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customer_users',
            'password' => 'required|string|min:8|confirmed',
            'customer_id' => 'required|exists:customers,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $customerUser = CustomerUser::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'customer_id' => $request->customer_id,
        ]);

        // Assign permissions
        if ($request->has('permissions')) {
            $permissions = Permission::whereIn('id', $request->permissions)
                ->where('guard_name', 'customer_user')
                ->get();
            $customerUser->syncPermissions($permissions);
        }

        return redirect()->route('admin.customer-users.index')
            ->with('success', 'Customer user created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(CustomerUser $customerUser)
    {
        $customerUser->load(['customer', 'permissions']);

        return Inertia::render('Admin/CustomerUser/Show', [
            'customerUser' => $customerUser,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(CustomerUser $customerUser)
    {
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
     * Update the specified resource in storage.
     */
    public function update(Request $request, CustomerUser $customerUser)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:customer_users,email,' . $customerUser->id,
            'password' => 'nullable|string|min:8|confirmed',
            'customer_id' => 'required|exists:customers,id',
            'permissions' => 'array',
            'permissions.*' => 'exists:permissions,id',
        ]);

        $customerUser->update([
            'name' => $request->name,
            'email' => $request->email,
            'customer_id' => $request->customer_id,
        ]);

        if ($request->filled('password')) {
            $customerUser->update([
                'password' => Hash::make($request->password),
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

        return redirect()->route('admin.customer-users.index')
            ->with('success', 'Customer user updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(CustomerUser $customerUser)
    {
        $customerUser->delete();

        return redirect()->route('admin.customer-users.index')
            ->with('success', 'Customer user deleted successfully.');
    }
}
