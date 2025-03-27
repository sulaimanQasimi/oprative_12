<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\CustomerUser;

class CustomerPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create customer permissions
        $customerPermissions = [
            // Dashboard permissions
            'customer.view_dashboard',

            // Orders permissions
            'customer.view_orders',
            'customer.create_orders',
            'customer.view_invoice',

            // Profile permissions
            'customer.view_profile',
            'customer.edit_profile',

            // Stock permissions
            'customer.view_stock',

            // Accounts permissions
            'customer.view_accounts',
            'customer.manage_accounts',

            // Income permissions
            'customer.view_incomes',
            'customer.manage_incomes',

            // Sales permissions
            'customer.view_sales',

            // Reports permissions
            'customer.view_reports',
        ];

        // Create all permissions
        foreach ($customerPermissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'customer_user']);
        }

        // Create customer roles
        $adminRole = Role::create(['name' => 'customer_admin', 'guard_name' => 'customer_user']);
        $managerRole = Role::create(['name' => 'customer_manager', 'guard_name' => 'customer_user']);
        $employeeRole = Role::create(['name' => 'customer_employee', 'guard_name' => 'customer_user']);

        // Admin gets all permissions
        $adminRole->syncPermissions($customerPermissions);

        // Manager permissions
        $managerRole->syncPermissions([
            'customer.view_dashboard',
            'customer.view_orders',
            'customer.create_orders',
            'customer.view_invoice',
            'customer.view_profile',
            'customer.edit_profile',
            'customer.view_stock',
            'customer.view_accounts',
            'customer.view_incomes',
            'customer.view_sales',
            'customer.view_reports',
        ]);

        // Employee permissions (most basic)
        $employeeRole->syncPermissions([
            'customer.view_dashboard',
            'customer.view_orders',
            'customer.view_profile',
            'customer.view_stock',
        ]);

        // Assign admin role to user with ID 1 (for testing)
        $user = CustomerUser::find(1);
        if ($user) {
            $user->assignRole('customer_admin');
        }
    }
}
