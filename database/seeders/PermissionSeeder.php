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

        // Define permission actions with Persian labels
        $actions = [
            'view' => 'مشاهده',
            'view_any' => 'مشاهده همه',
            'create' => 'ایجاد',
            'update' => 'ویرایش',
            'delete' => 'حذف',
            'restore' => 'بازیابی',
            'force_delete' => 'حذف کامل',
            'export' => 'خروجی',
            'import' => 'ورودی',
        ];

        // Define model labels in Persian
        $modelLabels = [
            'user' => 'کاربر',
            'role' => 'نقش',
            'permission' => 'مجوز',
            'product' => 'محصول',
            'supplier' => 'تامین کننده',
            'warehouse' => 'انبار',
            'customer' => 'مشتری',
            'employee' => 'کارمند',
            'unit' => 'واحد',
            'currency' => 'ارز',
            'account' => 'حساب',
            'income' => 'درآمد',
            'outcome' => 'هزینه',
            'transfer' => 'انتقال',
            'sale' => 'فروش',
            'purchase' => 'خرید',
            'inventory' => 'موجودی',
            'report' => 'گزارش',
            'setting' => 'تنظیمات',
            'category' => 'دسته بندی',
            'brand' => 'برند',
            'payment' => 'پرداخت',
            'order' => 'سفارش',
            'invoice' => 'فاکتور',
        ];

        // Create permissions for each model and action
        foreach ($models as $model) {
            foreach ($actions as $action => $actionLabel) {
                $permissionName = "{$action}_{$model}";
                $modelLabel = $modelLabels[$model] ?? $model;
                $persianLabel = "{$actionLabel} {$modelLabel}";

                Permission::firstOrCreate([
                    'name' => $permissionName,
                    'guard_name' => 'web',
                ], [
                    'label' => $persianLabel,
                ]);
            }

            // Create special permissions for specific models
            if ($model === 'warehouse') {
                $specialActions = [
                    'manage_inventory' => 'مدیریت موجودی',
                    'view_stock' => 'مشاهده موجودی',
                    'transfer_products' => 'انتقال محصولات',
                    'adjust_stock' => 'تنظیم موجودی',
                    'view_reports' => 'مشاهده گزارشات',
                ];

                foreach ($specialActions as $action => $actionLabel) {
                    $modelLabel = $modelLabels[$model] ?? $model;
                    $persianLabel = "{$actionLabel} {$modelLabel}";

                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ], [
                        'label' => $persianLabel,
                    ]);
                }
            }

            if ($model === 'sale') {
                $specialActions = [
                    'process_payment' => 'پردازش پرداخت',
                    'issue_refund' => 'صدور برگشت',
                    'view_analytics' => 'مشاهده تحلیل‌ها',
                    'manage_discounts' => 'مدیریت تخفیف‌ها',
                ];

                foreach ($specialActions as $action => $actionLabel) {
                    $modelLabel = $modelLabels[$model] ?? $model;
                    $persianLabel = "{$actionLabel} {$modelLabel}";

                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ], [
                        'label' => $persianLabel,
                    ]);
                }
            }

            if ($model === 'user') {
                $specialActions = [
                    'assign_roles' => 'تخصیص نقش‌ها',
                    'manage_permissions' => 'مدیریت مجوزها',
                    'impersonate' => 'جانشینی',
                    'view_activity_log' => 'مشاهده لاگ فعالیت',
                ];

                foreach ($specialActions as $action => $actionLabel) {
                    $modelLabel = $modelLabels[$model] ?? $model;
                    $persianLabel = "{$actionLabel} {$modelLabel}";

                    Permission::firstOrCreate([
                        'name' => "{$action}_{$model}",
                        'guard_name' => 'web',
                    ], [
                        'label' => $persianLabel,
                    ]);
                }
            }

            if ($model === 'report') {
                $specialActions = [
                    'generate_sales_report' => 'تولید گزارش فروش',
                    'generate_inventory_report' => 'تولید گزارش موجودی',
                    'generate_financial_report' => 'تولید گزارش مالی',
                    'generate_user_report' => 'تولید گزارش کاربران',
                    'generate_custom_report' => 'تولید گزارش سفارشی',
                ];

                foreach ($specialActions as $action => $actionLabel) {
                    Permission::firstOrCreate([
                        'name' => $action,
                        'guard_name' => 'web',
                    ], [
                        'label' => $actionLabel,
                    ]);
                }
            }
        }

        // Create system-wide permissions
        $systemPermissions = [
            'access_admin_panel' => 'دسترسی به پنل مدیریت',
            'manage_system_settings' => 'مدیریت تنظیمات سیستم',
            'view_system_logs' => 'مشاهده لاگ‌های سیستم',
            'backup_database' => 'پشتیبان‌گیری از پایگاه داده',
            'restore_database' => 'بازیابی پایگاه داده',
            'manage_api_keys' => 'مدیریت کلیدهای API',
            'view_dashboard' => 'مشاهده داشبورد',
            'manage_notifications' => 'مدیریت اعلان‌ها',
            'clear_cache' => 'پاک کردن کش',
            'run_maintenance' => 'اجرای نگهداری',
        ];

        foreach ($systemPermissions as $permission => $label) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web',
            ], [
                'label' => $label,
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
