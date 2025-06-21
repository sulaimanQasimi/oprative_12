<?php

namespace App\Console\Commands;

use Illuminate\Console\Command;
use App\Models\User;
use Spatie\Permission\Models\Role;

class AssignUserToSuperAdmin extends Command
{
    /**
     * The name and signature of the console command.
     *
     * @var string
     */
    protected $signature = 'user:assign-super-admin {user_id : The ID of the user to assign super-admin role}';

    /**
     * The console command description.
     *
     * @var string
     */
    protected $description = 'Assign the super-admin role to a specific user';

    /**
     * Execute the console command.
     */
    public function handle()
    {
        $userId = $this->argument('user_id');
        
        // Find the user
        $user = User::find($userId);
        
        if (!$user) {
            $this->error("User with ID {$userId} not found.");
            return 1;
        }

        // Get or create super-admin role
        $superAdminRole = Role::where('name', 'super_admin')->where('guard_name', 'web')->first();
        
        if (!$superAdminRole) {
            $this->error("Super-admin role not found. Please run 'php artisan permission:assign-all-to-super-admin' first.");
            return 1;
        }

        // Assign the role
        $user->assignRole($superAdminRole);

        $this->info("Successfully assigned super-admin role to user: {$user->name} (ID: {$user->id})");
        $this->info("User now has access to all {$superAdminRole->permissions->count()} permissions.");

        return 0;
    }
}
