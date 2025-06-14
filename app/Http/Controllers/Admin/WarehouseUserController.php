<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\User;
use App\Models\WareHouseUser;
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
            'email' => 'required|string|email|max:255|unique:ware_house_users',
            'password' => 'required|string|min:8',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $user = WareHouseUser::create([
            'warehouse_id' => $warehouse->id,
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => bcrypt($validated['password']),
        ]);

        // Sync permissions by name if provided
        if (!empty($validated['permissions'])) {
            $permissions = Permission::whereIn('name', $validated['permissions'])
                ->where('guard_name', 'warehouse_user')
                ->get();
            $user->syncPermissions($permissions);
        }

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'User added successfully.');
    }

    /**
     * Show the form for editing the specified warehouse user.
     */
    public function edit(Warehouse $warehouse, WareHouseUser $warehouseUser)
    {
        $permissions = Permission::where('guard_name', 'warehouse_user')->get();

        return Inertia::render('Admin/Warehouse/User/Edit', [
            'warehouse' => $warehouse,
            'user' => $warehouseUser->load('permissions'),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified warehouse user.
     */
    public function update(Request $request, Warehouse $warehouse, WareHouseUser $warehouseUser)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:ware_house_users,email,' . $warehouseUser->id,
            'password' => 'nullable|string|min:8',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $warehouseUser->update([
            'name' => $validated['name'],
            'email' => $validated['email'],
        ]);

        if (!empty($validated['password'])) {
            $warehouseUser->update([
                'password' => bcrypt($validated['password']),
            ]);
        }

        // Sync permissions by name if provided
        if (isset($validated['permissions'])) {
            $permissions = Permission::whereIn('name', $validated['permissions'])
                ->where('guard_name', 'warehouse_user')
                ->get();
            $warehouseUser->syncPermissions($permissions);
        }

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified warehouse user from storage.
     */
    public function destroy(Warehouse $warehouse, WareHouseUser $warehouseUser)
    {
        $warehouseUser->delete();

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'User deleted successfully.');
    }
}
