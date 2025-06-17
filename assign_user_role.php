<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Role;

try {
    $user = User::first();
    $role = Role::where('name', 'super_admin')->first();

    if ($user && $role) {
        $user->assignRole($role);
        echo "✅ Assigned 'super_admin' role to user: {$user->name}\n";

        // Verify assignment
        $permissions = $user->getAllPermissions()->count();
        echo "✅ User now has {$permissions} permissions\n";

        // Test specific warehouse permissions
        $hasViewAny = $user->hasPermissionTo('view_any_warehouse');
        echo $hasViewAny ? "✅ User can view warehouses\n" : "❌ User still cannot view warehouses\n";

    } else {
        if (!$user) echo "❌ No user found\n";
        if (!$role) echo "❌ super_admin role not found\n";
    }

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
