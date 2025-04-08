<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;

class PermissionSeeder extends Seeder
{
    public function run()
    {
        // ... existing permissions ...

        // Warehouse Report Permissions
        Permission::create(['name' => 'warehouse.view_reports','guard_name'=>'warehouse_user']);
        Permission::create(['name' => 'warehouse.generate_reports','guard_name'=>'warehouse_user']);

        // ... existing permissions ...
    }
}
