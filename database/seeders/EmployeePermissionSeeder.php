<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class EmployeePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // Employee permissions with Dari labels
        $employeePermissions = [
            [
                'name' => 'view_any_employee',
                'label' => 'مشاهده همه کارمندان',
                'group' => 'employee_management'
            ],
            [
                'name' => 'view_employee',
                'label' => 'مشاهده کارمند',
                'group' => 'employee_management'
            ],
            [
                'name' => 'create_employee',
                'label' => 'ایجاد کارمند',
                'group' => 'employee_management'
            ],
            [
                'name' => 'update_employee',
                'label' => 'ویرایش کارمند',
                'group' => 'employee_management'
            ],
            [
                'name' => 'delete_employee',
                'label' => 'حذف کارمند',
                'group' => 'employee_management'
            ],
            [
                'name' => 'delete_any_employee',
                'label' => 'حذف همه کارمندان',
                'group' => 'employee_management'
            ],
            [
                'name' => 'restore_employee',
                'label' => 'بازیابی کارمند',
                'group' => 'employee_management'
            ],
            [
                'name' => 'force_delete_employee',
                'label' => 'حذف دائمی کارمند',
                'group' => 'employee_management'
            ],
        ];

        // SecuGenFingerprint permissions with Dari labels
        $fingerprintPermissions = [
            [
                'name' => 'view_any_fingerprint',
                'label' => 'مشاهده همه اثر انگشت‌ها',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'view_fingerprint',
                'label' => 'مشاهده اثر انگشت',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'create_fingerprint',
                'label' => 'ایجاد اثر انگشت',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'update_fingerprint',
                'label' => 'ویرایش اثر انگشت',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'delete_fingerprint',
                'label' => 'حذف اثر انگشت',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'delete_any_fingerprint',
                'label' => 'حذف همه اثر انگشت‌ها',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'restore_fingerprint',
                'label' => 'بازیابی اثر انگشت',
                'group' => 'fingerprint_management'
            ],
            [
                'name' => 'force_delete_fingerprint',
                'label' => 'حذف دائمی اثر انگشت',
                'group' => 'fingerprint_management'
            ],
        ];

        // Create all permissions
        $allPermissions = array_merge($employeePermissions, $fingerprintPermissions);
        
        foreach ($allPermissions as $permission) {
            Permission::create([
                'name' => $permission['name'],
                'guard_name' => 'web',
                'label' => $permission['label'],
                'group' => $permission['group']
            ]);
        }

        // Create roles if they don't exist
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $hrRole = Role::firstOrCreate(['name' => 'hr_manager', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);

        // Admin gets all permissions
        $adminRole->syncPermissions(array_column($allPermissions, 'name'));

        // HR Manager gets most permissions except force delete
        $hrPermissions = array_filter($allPermissions, function($permission) {
            return !str_contains($permission['name'], 'force_delete');
        });
        $hrRole->syncPermissions(array_column($hrPermissions, 'name'));

        // Employee gets only view permissions for their own data
        $employeePermissions = [
            'view_employee',
            'view_fingerprint'
        ];
        $employeeRole->syncPermissions($employeePermissions);

        $this->command->info('Employee and fingerprint permissions created successfully.');
    }
}
