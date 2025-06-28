<?php

namespace App\Policies;

use App\Models\Customer;
use App\Models\User;

/**
 * CustomerPolicy handles authorization for customer-related operations.
 * 
 * This policy implements comprehensive permission checks for all customer
 * operations including CRUD operations, user management, and financial records.
 */
class CustomerPolicy
{
    /**
     * Determine whether the user can view any customers.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_customer');
    }

    /**
     * Determine whether the user can view the customer.
     */
    public function view(User $user, Customer $customer): bool
    {
        return $user->can('view_customer');
    }

    /**
     * Determine whether the user can create customers.
     */
    public function create(User $user): bool
    {
        return $user->can('create_customer');
    }

    /**
     * Determine whether the user can update the customer.
     */
    public function update(User $user, Customer $customer): bool
    {
        return $user->can('update_customer');
    }

    /**
     * Determine whether the user can delete the customer.
     */
    public function delete(User $user, Customer $customer): bool
    {
        return $user->can('delete_customer');
    }

    /**
     * Determine whether the user can restore the customer.
     */
    public function restore(User $user, Customer $customer): bool
    {
        return $user->can('restore_customer');
    }

    /**
     * Determine whether the user can permanently delete the customer.
     */
    public function forceDelete(User $user, Customer $customer): bool
    {
        return $user->can('force_delete_customer');
    }

    /**
     * Determine whether the user can manage customer users.
     * 
     * Customer user management requires update_customer permission.
     */
    public function manageUsers(User $user, Customer $customer): bool
    {
        return $user->can('update_customer');
    }

    /**
     * Determine whether the user can view customer financial records.
     * 
     * Viewing income, outcome, and orders requires view_customer permission.
     */
    public function viewFinancials(User $user, Customer $customer): bool
    {
        return $user->can('view_customer');
    }
}
