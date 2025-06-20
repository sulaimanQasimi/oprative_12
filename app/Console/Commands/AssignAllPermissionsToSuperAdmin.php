<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AssignAllPermissionsToSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'permission:assign-all-to-super-admin';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign all permissions to the super-admin role';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        // Clear permission cache
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Create super admin role if it doesn't exist
        $superAdmin = Role::firstOrCreate([
            'name' => 'super_admin',
            'guard_name' => 'web',
        ]);

        // Get all permissions with web guard
        $webPermissions = Permission::where('guard_name', 'web')->get();

        // Assign all web permissions to super admin
        $superAdmin->syncPermissions($webPermissions);

        $this->info("Super-admin role created/updated successfully!");
        $this->info("Assigned {$webPermissions->count()} permissions to super-admin role.");
        
        // Display the permissions assigned
        $this->info("Permissions assigned:");
        foreach ($webPermissions as $permission) {
            $this->line("  - {$permission->name}");
        }

        return 0;
    }
}
