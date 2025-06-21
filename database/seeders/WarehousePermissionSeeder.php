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

            // Dashboard permissions
            'warehouse.view_dashboard',

            // Product permissions
            'warehouse.view_products',
            // Income permissions
            'warehouse.view_income',

            // Outcome permissions
            'warehouse.view_outcome',

            // Sales permissions
            'warehouse.view_sales',
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
    }
} 