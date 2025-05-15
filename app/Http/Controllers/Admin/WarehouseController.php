<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WareHouseUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::with('users')->latest()->get();
        return Inertia::render('Admin/Warehouse/Index', [
            'warehouses' => $warehouses,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Warehouse/Create', [
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
            'users' => 'array',
            'users.*.name' => 'required|string|max:255',
            'users.*.email' => 'required|email|unique:ware_house_users,email',
            'users.*.password' => 'required|string|min:8',
            'users.*.role' => 'required|string|exists:roles,name'
        ]);

        $warehouse = Warehouse::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Create warehouse users
        if (isset($validated['users'])) {
            foreach ($validated['users'] as $userData) {
                $user = WareHouseUser::create([
                    'warehouse_id' => $warehouse->id,
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make($userData['password']),
                ]);

                $role = Role::findByName($userData['role'], 'warehouse_user');
                $user->assignRole($role);
            }
        }

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    public function edit(Warehouse $warehouse)
    {
        $warehouse->load('users.roles');
        $roles = Role::where('guard_name', 'warehouse_user')->get();

        return Inertia::render('Admin/Warehouse/Edit', [
            'warehouse' => $warehouse,
            'roles' => $roles,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses,code,' . $warehouse->id,
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
            'users' => 'array',
            'users.*.id' => 'nullable|exists:ware_house_users,id',
            'users.*.name' => 'required|string|max:255',
            'users.*.email' => 'required|email|unique:ware_house_users,email,' . ($request->input('users.*.id') ?? 'NULL') . ',id',
            'users.*.password' => 'nullable|string|min:8',
            'users.*.role' => 'required|string|exists:roles,name'
        ]);

        $warehouse->update([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Update warehouse users
        if (isset($validated['users'])) {
            $currentUserIds = $warehouse->users->pluck('id')->toArray();
            $updatedUserIds = [];

            foreach ($validated['users'] as $userData) {
                if (isset($userData['id'])) {
                    // Update existing user
                    $user = WareHouseUser::find($userData['id']);
                    $user->update([
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                    ]);

                    if (isset($userData['password'])) {
                        $user->update(['password' => Hash::make($userData['password'])]);
                    }

                    $role = Role::findByName($userData['role'], 'warehouse_user');
                    $user->syncRoles([$role]);

                    $updatedUserIds[] = $user->id;
                } else {
                    // Create new user
                    $user = WareHouseUser::create([
                        'warehouse_id' => $warehouse->id,
                        'name' => $userData['name'],
                        'email' => $userData['email'],
                        'password' => Hash::make($userData['password']),
                    ]);

                    $role = Role::findByName($userData['role'], 'warehouse_user');
                    $user->assignRole($role);

                    $updatedUserIds[] = $user->id;
                }
            }

            // Delete users that were removed
            $usersToDelete = array_diff($currentUserIds, $updatedUserIds);
            if (!empty($usersToDelete)) {
                WareHouseUser::whereIn('id', $usersToDelete)->delete();
            }
        }

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse)
    {
        // Delete associated users first
        $warehouse->users()->delete();

        $warehouse->delete();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }

    public function show(Warehouse $warehouse)
    {
        try {
            // Make sure to load the users relationship
            $warehouse = Warehouse::with(['users.roles.permissions'])->findOrFail($warehouse->id);

            // Check if users are loaded
            if ($warehouse->users === null) {
                Log::error('Users relationship not loaded for warehouse: ' . $warehouse->id);
            }

            $roles = Role::where('guard_name', 'warehouse_user')->with('permissions')->get();
            $permissions = \Spatie\Permission\Models\Permission::where('guard_name', 'warehouse_user')->get();

            return Inertia::render('Admin/Warehouse/Show', [
                'warehouse' => $warehouse,
                'roles' => $roles,
                'permissions' => $permissions,
                'auth' => [
                    'user' => Auth::guard('web')->user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.index')
                ->with('error', 'Error loading warehouse: ' . $e->getMessage());
        }
    }

    public function addUser(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:ware_house_users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);

        try {
            // Create the user
            $user = WareHouseUser::create([
                'warehouse_id' => $warehouse->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign role
            $role = Role::findByName($validated['role'], 'warehouse_user');
            $user->assignRole($role);

            // Assign additional permissions if any
            if (!empty($validated['permissions'])) {
                $user->givePermissionTo($validated['permissions']);
            }

            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('success', 'User added successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error adding user: ' . $e->getMessage());
        }
    }

    public function updateUser(Request $request, Warehouse $warehouse, WareHouseUser $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:ware_house_users,email,' . $user->id,
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
            $role = Role::findByName($validated['role'], 'warehouse_user');
            $user->syncRoles([$role]);

            // Update permissions
            if (isset($validated['permissions'])) {
                $user->syncPermissions($validated['permissions']);
            }

            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error updating user: ' . $e->getMessage());
        }
    }
}
