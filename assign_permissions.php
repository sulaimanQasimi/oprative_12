<?php

// Bootstrap Laravel
require_once __DIR__ . '/vendor/autoload.php';

$app = require_once __DIR__ . '/bootstrap/app.php';
$app->make(Illuminate\Contracts\Console\Kernel::class)->bootstrap();

use App\Models\User;
use Spatie\Permission\Models\Permission;

echo "Starting permission assignment...\n";

// Find user with ID 1
$user = User::find(1);

if (!$user) {
    echo "ERROR: User with ID 1 not found.\n";
    exit(1);
}

echo "Found user: {$user->name} (ID: {$user->id})\n";

// Clear permission cache
app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

// Get all permissions with web guard
$webPermissions = Permission::where('guard_name', 'web')->get();

if ($webPermissions->isEmpty()) {
    echo "ERROR: No permissions found. Please run the permission seeders first.\n";
    exit(1);
}

echo "Found {$webPermissions->count()} permissions to assign.\n";

// Assign all permissions directly to the user
$user->syncPermissions($webPermissions);

echo "SUCCESS: Successfully assigned all {$webPermissions->count()} permissions to user: {$user->name} (ID: {$user->id})\n";

echo "Permissions assigned:\n";
foreach ($webPermissions as $permission) {
    echo "  - {$permission->name}\n";
}

echo "Done!\n"; 