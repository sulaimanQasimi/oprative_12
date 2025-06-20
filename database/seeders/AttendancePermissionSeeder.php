<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class AttendancePermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Reset cached roles and permissions
        app()[\Spatie\Permission\PermissionRegistrar::class]->forgetCachedPermissions();

        // AttendanceRecord permissions with Dari labels
        $attendanceRecordPermissions = [
            [
                'name' => 'view_any_attendance_record',
                'label' => 'مشاهده همه سوابق حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'view_attendance_record',
                'label' => 'مشاهده سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'create_attendance_record',
                'label' => 'ایجاد سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'update_attendance_record',
                'label' => 'ویرایش سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'delete_attendance_record',
                'label' => 'حذف سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'delete_any_attendance_record',
                'label' => 'حذف همه سوابق حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'restore_attendance_record',
                'label' => 'بازیابی سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'force_delete_attendance_record',
                'label' => 'حذف دائمی سابقه حضور و غیاب',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'check_in_attendance',
                'label' => 'ثبت ورود',
                'group' => 'attendance_management'
            ],
            [
                'name' => 'check_out_attendance',
                'label' => 'ثبت خروج',
                'group' => 'attendance_management'
            ],
        ];

        // AttendanceSetting permissions with Dari labels
        $attendanceSettingPermissions = [
            [
                'name' => 'view_any_attendance_setting',
                'label' => 'مشاهده همه تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'view_attendance_setting',
                'label' => 'مشاهده تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'create_attendance_setting',
                'label' => 'ایجاد تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'update_attendance_setting',
                'label' => 'ویرایش تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'delete_attendance_setting',
                'label' => 'حذف تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'delete_any_attendance_setting',
                'label' => 'حذف همه تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'restore_attendance_setting',
                'label' => 'بازیابی تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
            [
                'name' => 'force_delete_attendance_setting',
                'label' => 'حذف دائمی تنظیمات حضور و غیاب',
                'group' => 'attendance_settings'
            ],
        ];

        // Create all permissions
        $allPermissions = array_merge($attendanceRecordPermissions, $attendanceSettingPermissions);
        
        foreach ($allPermissions as $permission) {
            Permission::firstOrCreate([
                'name' => $permission['name'],
                'guard_name' => 'web',
            ], [
                'label' => $permission['label'],
                'group' => $permission['group']
            ]);
        }

        // Create roles if they don't exist
        $superAdminRole = Role::firstOrCreate(['name' => 'super_admin', 'guard_name' => 'web']);
        $adminRole = Role::firstOrCreate(['name' => 'admin', 'guard_name' => 'web']);
        $hrRole = Role::firstOrCreate(['name' => 'hr_manager', 'guard_name' => 'web']);
        $employeeRole = Role::firstOrCreate(['name' => 'employee', 'guard_name' => 'web']);

        // Super Admin gets all permissions
        $superAdminRole->givePermissionTo(array_column($allPermissions, 'name'));
        
        // Admin gets all permissions
        $adminRole->syncPermissions(array_column($allPermissions, 'name'));

        // HR Manager gets most permissions except force delete
        $hrPermissions = array_filter($allPermissions, function($permission) {
            return !str_contains($permission['name'], 'force_delete');
        });
        $hrRole->syncPermissions(array_column($hrPermissions, 'name'));

        // Employee gets limited permissions
        $employeePermissions = [
            'view_attendance_record',
            'check_in_attendance',
            'check_out_attendance',
            'view_attendance_setting'
        ];
        $employeeRole->syncPermissions($employeePermissions);

        $this->command->info('Attendance permissions created successfully.');
    }
} 