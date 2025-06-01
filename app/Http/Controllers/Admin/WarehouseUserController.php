<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Permission;

class WarehouseUserController extends Controller
{
    /**
     * Show the form for creating a new warehouse user.
     */
    public function create(Warehouse $warehouse)
    {
        $permissions = Permission::where('guard_name', 'warehouse_user')->get();

        return Inertia::render('Admin/Warehouse/User/Create', [
            'warehouse' => $warehouse,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created warehouse user.
     */
    public function store(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        $permissions = Permission::whereIn('id', $validated['permissions'])->get();
        $user->syncPermissions($permissions);

        $warehouse->users()->attach($user->id);

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'User added successfully.');
    }

    /**
     * Show the form for editing the specified warehouse user.
     */
    public function edit(Warehouse $warehouse, User $user)
    {
        $permissions = Permission::where('guard_name', 'warehouse_user')->get();

        return Inertia::render('Admin/Warehouse/User/Edit', [
            'warehouse' => $warehouse,
            'user' => $user->load('permissions'),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified warehouse user.
     */
    public function update(Request $request, Warehouse $warehouse, User $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,id'
        ]);

        $user->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $user->update([
                'password' => bcrypt($validated['password']),
            ]);
        }

        $permissions = Permission::whereIn('id', $validated['permissions'])->get();
        $user->syncPermissions($permissions);

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'User updated successfully.');
    }
}
