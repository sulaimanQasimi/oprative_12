<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class PurchasePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $permissions = [
            'view_purchase',
            'create_purchase', 
            'update_purchase',
            'delete_purchase',
        ];

        // Create permissions if they don't exist
        foreach ($permissions as $permission) {
            Permission::firstOrCreate(['name' => $permission]);
        }

        // Assign all permissions to super-admin role
        $superAdminRole = Role::where('name', 'super-admin')->first();
        if ($superAdminRole) {
            $superAdminRole->givePermissionTo($permissions);
        }

        // You can also assign specific permissions to other roles
        $adminRole = Role::where('name', 'admin')->first();
        if ($adminRole) {
            // Give admin role all purchase permissions except delete
            $adminRole->givePermissionTo([
                'view_purchase',
                'create_purchase', 
                'update_purchase',
            ]);
        }

        $this->command->info('Purchase permissions created and assigned successfully!');
    }
} 