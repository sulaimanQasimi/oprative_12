<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Define all models that need permissions
        $models = [
            'user',
            'role',
            'permission', 
            'product',
            'supplier',
            'warehouse',
            'customer',
            'employee',
            'unit',
            'currency',
            'account',
            'income',
            'outcome',
            'transfer',
            'sale',
            'purchase',
            'inventory',
            'report',
            'setting',
            'category',
            'brand',
            'payment',
            'order',
            'invoice',
        ];

        // Define permission actions
        $actions = [
            'view',
            'view_any',
            'create',
            'update',
            'delete',
            'restore',
            'force_delete',
            'export',
            'import',
        ];

        // Create permissions for each model and action
        foreach ($models as $model) {
            foreach ($actions as $action) {
                $permissionName = "{$action}_{$model}";
                
                Permission::firstOrCreate([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ]);
            }

            // Create special permissions for specific models
            if ($model === 'warehouse') {
                $specialActions = [
                    'manage_inventory',
                    'view_stock',
                    'transfer_products',
                    'adjust_stock',
                    'view_reports',
                ];
                
                foreach ($specialActions as $action) {
                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ]);
                }
            }

            if ($model === 'sale') {
                $specialActions = [
                    'process_payment',
                    'issue_refund',
                    'view_analytics',
                    'manage_discounts',
                ];
                
                foreach ($specialActions as $action) {
                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ]);
                }
            }

            if ($model === 'user') {
                $specialActions = [
                    'assign_roles',
                    'manage_permissions',
                    'impersonate',
                    'view_activity_log',
                ];
                
                foreach ($specialActions as $action) {
                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ]);
                }
            }

            if ($model === 'report') {
                $specialActions = [
                    'generate_sales_report',
                    'generate_inventory_report',
                    'generate_financial_report',
                    'generate_user_report',
                    'generate_custom_report',
                ];
                
                foreach ($specialActions as $action) {
                    Permission::firstOrCreate([
                        'name' => $action,
                        'guard_name' => 'web',
                    ]);
                }
            }
        }

        // Create system-wide permissions
        $systemPermissions = [
            'access_admin_panel',
            'manage_system_settings',
            'view_system_logs',
            'backup_database',
            'restore_database',
            'manage_api_keys',
            'view_dashboard',
            'manage_notifications',
            'clear_cache',
            'run_maintenance',
        ];

        foreach ($systemPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ]);
        }

        // Create roles and assign permissions
        $this->createRoles();
    }

    private function createRoles(): void
    {
        // Super Admin - All permissions
        $superAdmin = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web',
        ]);
        $superAdmin->givePermissionTo(Permission::all());

        // Admin - Most permissions except system critical ones
        $admin = Role::firstOrCreate([
            'name' => 'admin',
            'guard_name' => 'web',
        ]);
        
        $adminPermissions = Permission::where('name', 'not like', '%backup%')
            ->where('name', 'not like', '%restore%')
            ->where('name', 'not like', '%force_delete%')
            ->where('name', 'not like', '%run_maintenance%')
            ->get();
        
        $admin->givePermissionTo($adminPermissions);

        // Manager - Business operations permissions
        $manager = Role::firstOrCreate([
            'name' => 'manager',
            'guard_name' => 'web',
        ]);
        
        $managerModels = ['product', 'supplier', 'warehouse', 'customer', 'employee', 'sale', 'purchase', 'inventory', 'report'];
        $managerActions = ['view', 'view_any', 'create', 'update', 'export'];
        
        foreach ($managerModels as $model) {
            foreach ($managerActions as $action) {
                $permission = Permission::where('name', "{$action}_{$model}")->first();
                if ($permission) {
                    $manager->givePermissionTo($permission);
                }
            }
        }
        
        $manager->givePermissionTo([
            'access_admin_panel',
            'view_dashboard',
            'generate_sales_report',
            'generate_inventory_report',
        ]);

        // Warehouse Manager - Warehouse and inventory related permissions
        $warehouseManager = Role::firstOrCreate([
            'name' => 'warehouse_manager',
            'guard_name' => 'web',
        ]);
        
        $warehouseModels = ['warehouse', 'product', 'inventory', 'transfer', 'income', 'outcome'];
        $warehouseActions = ['view', 'view_any', 'create', 'update'];
        
        foreach ($warehouseModels as $model) {
            foreach ($warehouseActions as $action) {
                $permission = Permission::where('name', "{$action}_{$model}")->first();
                if ($permission) {
                    $warehouseManager->givePermissionTo($permission);
                }
            }
        }
        
        $warehouseManager->givePermissionTo([
            'access_admin_panel',
            'view_dashboard',
            'manage_inventory_warehouse',
            'view_stock_warehouse',
            'transfer_products_warehouse',
            'adjust_stock_warehouse',
        ]);

        // Sales Manager - Sales and customer related permissions
        $salesManager = Role::firstOrCreate([
            'name' => 'sales_manager',
            'guard_name' => 'web',
        ]);
        
        $salesModels = ['sale', 'customer', 'product', 'order', 'invoice', 'payment'];
        $salesActions = ['view', 'view_any', 'create', 'update'];
        
        foreach ($salesModels as $model) {
            foreach ($salesActions as $action) {
                $permission = Permission::where('name', "{$action}_{$model}")->first();
                if ($permission) {
                    $salesManager->givePermissionTo($permission);
                }
            }
        }
        
        $salesManager->givePermissionTo([
            'access_admin_panel',
            'view_dashboard',
            'process_payment_sale',
            'issue_refund_sale',
            'view_analytics_sale',
            'generate_sales_report',
        ]);

        // Employee - Basic permissions
        $employee = Role::firstOrCreate([
            'name' => 'employee',
            'guard_name' => 'web',
        ]);
        
        $employee->givePermissionTo([
            'access_admin_panel',
            'view_dashboard',
            'view_product',
            'view_any_product',
            'view_customer',
            'view_any_customer',
            'create_sale',
            'view_sale',
            'view_any_sale',
        ]);

        // Customer - Very limited permissions
        $customer = Role::firstOrCreate([
            'name' => 'customer',
            'guard_name' => 'web',
        ]);
        
        $customer->givePermissionTo([
            'view_product',
            'view_any_product',
            'create_order',
            'view_order',
            'update_order',
        ]);
    }
}
