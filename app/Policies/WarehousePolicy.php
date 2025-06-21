<?php

namespace App\Policies;

use App\Models\User;
use App\Models\Warehouse;
use Illuminate\Auth\Access\HandlesAuthorization;

class WarehousePolicy
{
    use HandlesAuthorization;

    /**
     * Determine whether the user can view any warehouses.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function viewAny(User $user)
    {
        return $user->hasPermissionTo('view_any_warehouse');
    }

    /**
     * Determine whether the user can view the warehouse.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Warehouse  $warehouse
     * @return mixed
     */
    public function view(User $user, Warehouse $warehouse)
    {
        return $user->hasPermissionTo('view_warehouse');
    }

    /**
     * Determine whether the user can create warehouses.
     *
     * @param  \App\Models\User  $user
     * @return mixed
     */
    public function create(User $user)
    {
        return $user->hasPermissionTo('create_warehouse');
    }

    /**
     * Determine whether the user can update the warehouse.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Warehouse  $warehouse
     * @return mixed
     */
    public function update(User $user, Warehouse $warehouse)
    {
        return $user->hasPermissionTo('update_warehouse');
    }

    /**
     * Determine whether the user can delete the warehouse.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Warehouse  $warehouse
     * @return mixed
     */
    public function delete(User $user, Warehouse $warehouse)
    {
        return $user->hasPermissionTo('delete_warehouse');
    }

    /**
     * Determine whether the user can restore the warehouse.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Warehouse  $warehouse
     * @return mixed
     */
    public function restore(User $user, Warehouse $warehouse)
    {
        return $user->hasPermissionTo('restore_warehouse');
    }

    /**
     * Determine whether the user can permanently delete the warehouse.
     *
     * @param  \App\Models\User  $user
     * @param  \App\Models\Warehouse  $warehouse
     * @return mixed
     */
    public function forceDelete(User $user, Warehouse $warehouse)
    {
        return $user->hasPermissionTo('force_delete_warehouse');
    }
}
