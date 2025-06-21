<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AttendanceRequestPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create attendance request permissions
        $permissions = [
            // Manager/Admin permissions
            'view_any_attendance_request',
            'view_attendance_request',
            'create_attendance_request',
            'update_attendance_request',
            'delete_attendance_request',
            'restore_attendance_request',
            'force_delete_attendance_request',
            'approve_attendance_request',
            'reject_attendance_request',
            
            // Employee permissions
            'view_own_attendance_request',
            'create_own_attendance_request',
        ];

        foreach ($permissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission,
                'guard_name' => 'web'
            ]);
        }

        // Assign permissions to roles
        $superAdminRole = Role::where('name', 'super_admin')->first();
        if ($superAdminRole) {
            $superAdminRole->givePermissionTo($permissions);
        }

        // Create Manager role if it doesn't exist and assign manager permissions
        $managerRole = Role::firstOrCreate(['name' => 'manager', 'guard_name' => 'web']);
        $managerPermissions = [
            'view_any_attendance_request',
            'view_attendance_request',
            'approve_attendance_request',
            'reject_attendance_request',
        ];
        $managerRole->givePermissionTo($managerPermissions);

        // Create Department Head role if it doesn't exist and assign permissions
        $deptHeadRole = Role::firstOrCreate(['name' => 'department_head', 'guard_name' => 'web']);
        $deptHeadPermissions = [
            'view_any_attendance_request',
            'view_attendance_request',
            'approve_attendance_request',
            'reject_attendance_request',
        ];
        $deptHeadRole->givePermissionTo($deptHeadPermissions);

        // Create Employee role if it doesn't exist and assign employee permissions
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);
        $employeePermissions = [
            'view_own_attendance_request',
            'create_own_attendance_request',
        ];
        $employeeRole->givePermissionTo($employeePermissions);

        // Create HR role if it doesn't exist and assign all permissions
        $hrRole = Role::firstOrCreate(['name' => 'hr', 'guard_name' => 'web']);
        $hrRole->givePermissionTo($permissions);

        //
    }
}
