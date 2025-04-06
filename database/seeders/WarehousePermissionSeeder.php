<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;
use App\Models\WarehouseUser;

class WarehousePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create warehouse permissions
        $warehousePermissions = [
            // Authentication permissions
            'warehouse.login',
            'warehouse.logout',

            // Dashboard permissions
            'warehouse.view_dashboard',

            // Product permissions
            'warehouse.view_products',
            'warehouse.create_products',
            'warehouse.edit_products',
            'warehouse.delete_products',

            // Income permissions
            'warehouse.view_income',
            'warehouse.view_income_details',

            // Outcome permissions
            'warehouse.view_outcome',
            'warehouse.view_outcome_details',

            // Sales permissions
            'warehouse.view_sales',
            'warehouse.create_sales',
            'warehouse.edit_sales',
            'warehouse.delete_sales',
            'warehouse.view_sale_details',
            'warehouse.generate_invoice',
            'warehouse.confirm_sales',

            // Profile permissions
            'warehouse.view_profile',
            'warehouse.edit_profile',
        ];

        // Create all permissions
        foreach ($warehousePermissions as $permission) {
            Permission::create(['name' => $permission, 'guard_name' => 'warehouse_user']);
        }

        // Create warehouse roles
        $adminRole = Role::create(['name' => 'warehouse_admin', 'guard_name' => 'warehouse_user']);
        $managerRole = Role::create(['name' => 'warehouse_manager', 'guard_name' => 'warehouse_user']);
        $employeeRole = Role::create(['name' => 'warehouse_employee', 'guard_name' => 'warehouse_user']);
        $salesRole = Role::create(['name' => 'warehouse_sales', 'guard_name' => 'warehouse_user']);

        // Admin gets all permissions
        $adminRole->syncPermissions($warehousePermissions);

        // Manager permissions
        $managerRole->syncPermissions([
            'warehouse.login',
            'warehouse.logout',
            'warehouse.view_dashboard',
            'warehouse.view_products',
            'warehouse.create_products',
            'warehouse.edit_products',
            'warehouse.view_income',
            'warehouse.view_income_details',
            'warehouse.view_outcome',
            'warehouse.view_outcome_details',
            'warehouse.view_sales',
            'warehouse.view_sale_details',
            'warehouse.generate_invoice',
            'warehouse.confirm_sales',
            'warehouse.view_profile',
            'warehouse.edit_profile',
        ]);

        // Employee permissions (limited)
        $employeeRole->syncPermissions([
            'warehouse.login',
            'warehouse.logout',
            'warehouse.view_dashboard',
            'warehouse.view_products',
            'warehouse.view_income',
            'warehouse.view_outcome',
            'warehouse.view_profile',
            'warehouse.edit_profile',
        ]);

        // Sales role permissions
        $salesRole->syncPermissions([
            'warehouse.login',
            'warehouse.logout',
            'warehouse.view_dashboard',
            'warehouse.view_products',
            'warehouse.view_sales',
            'warehouse.create_sales',
            'warehouse.edit_sales',
            'warehouse.view_sale_details',
            'warehouse.generate_invoice',
            'warehouse.view_profile',
            'warehouse.edit_profile',
        ]);

        // Assign admin role to first warehouse user (for testing)
        $user = WarehouseUser::find(1);
        if ($user) {
            $user->assignRole('warehouse_admin');
        }
    }
} 