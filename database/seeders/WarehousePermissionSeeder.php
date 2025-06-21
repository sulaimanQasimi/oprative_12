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


            // Product permissions
            'warehouse.view_products'=>"مشاهده محصولات",
            // Income permissions
            'warehouse.view_income'=>"مشاهده واردات",

            // Outcome permissions
            'warehouse.view_outcome'=>"مشاهده خروجی",

            // Sales permissions
            'warehouse.view_sales'=>"مشاهده انتقال به مغازه",
            'warehouse.view_sale_details'=>"مشاهده جزئیات انتقال به مغازه",
            'warehouse.generate_invoice'=>"تولید فاکتور",
            'warehouse.confirm_sales'=>"تایید انتقال به مغازه",

            // Profile permissions
            'warehouse.view_profile'=>"مشاهده پروفایل",
            'warehouse.edit_profile'=>"ویرایش پروفایل",
        ];

        // Create all permissions
        foreach ($warehousePermissions as $permission =>$value) {
            Permission::create(['name' => $permission,'label'=>$value, 'guard_name' => 'warehouse_user']);
        }
    }
} 