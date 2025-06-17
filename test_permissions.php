<?php

require_once 'vendor/autoload.php';

// Bootstrap Laravel
$app = require_once 'bootstrap/app.php';
$app->make(\Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

try {
    echo "=== Permission System Test ===\n";

    // Test 1: Check if permissions exist
    $warehousePermissions = Permission::where('name', 'like', '%warehouse%')->where('guard_name', 'web')->count();
    echo "✓ Warehouse permissions found: {$warehousePermissions}\n";

    // Test 2: Check if user exists
    $user = User::first();
    if ($user) {
        echo "✓ First user found: {$user->name}\n";

        // Test 3: Check user permissions
        $userPermissions = $user->getAllPermissions()->count();
        echo "✓ User has {$userPermissions} permissions\n";

        // Test 4: Check specific warehouse permissions
        $hasViewAny = $user->hasPermissionTo('view_any_warehouse');
        $hasCreate = $user->hasPermissionTo('create_warehouse');

        echo $hasViewAny ? "✓ User can view warehouses\n" : "✗ User cannot view warehouses\n";
        echo $hasCreate ? "✓ User can create warehouses\n" : "✗ User cannot create warehouses\n";

    } else {
        echo "✗ No users found\n";
    }

    // Test 5: Check middleware registration
    $middleware = app('router')->getMiddleware();
    if (isset($middleware['permission'])) {
        echo "✓ Permission middleware is registered\n";
    } else {
        echo "✗ Permission middleware is NOT registered\n";
    }

    echo "\n=== Test Complete ===\n";

} catch (Exception $e) {
    echo "❌ Error: " . $e->getMessage() . "\n";
}
