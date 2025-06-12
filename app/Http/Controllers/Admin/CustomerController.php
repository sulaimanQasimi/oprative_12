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
    public function index()
    {
        $customers = Customer::with(['users'])
            ->latest()
            ->get()
            ->map(function ($customer) {
                return [
                    'id' => $customer->id,
                    'name' => $customer->name,
                    'email' => $customer->email,
                    'phone' => $customer->phone,
                    'address' => $customer->address,
                    'status' => $customer->status,
                    'users_count' => $customer->users->count(),
                    'created_at' => $customer->created_at,
                    'updated_at' => $customer->updated_at,
                ];
            });

        return Inertia::render('Admin/Customer/Index', [
            'customers' => $customers,
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

    public function show(Customer $customer)
    {
        try {
            $customer = Customer::with(['users.roles.permissions'])->findOrFail($customer->id);

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
}
