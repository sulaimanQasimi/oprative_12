<?php

namespace App\Helpers;

class ActivityLogHelper
{
    /**
     * Generate activity log route for a given model.
     */
    public static function routeFor($model): string
    {
        $modelType = strtolower(class_basename($model));
        return route('admin.activity-logs.show', [$modelType, $model->id]);
    }

    /**
     * Get available model types with their display names.
     */
    public static function getAvailableModels(): array
    {
        return [
            'supplier' => 'Supplier',
            'user' => 'User',
            'product' => 'Product',
            'customer' => 'Customer',
            'purchase' => 'Purchase',
            'sale' => 'Sale',
            'warehouse' => 'Warehouse',
            'employee' => 'Employee',
            'account' => 'Account',
            'currency' => 'Currency',
            'unit' => 'Unit',
            'branch' => 'Branch',
            'customeruser' => 'Customer User',
            'warehouseuser' => 'Warehouse User',
            'attendancerequest' => 'Attendance Request',
            'attendancesetting' => 'Attendance Setting',
            'gate' => 'Gate',
        ];
    }

    /**
     * Check if a model type is supported.
     */
    public static function isModelSupported(string $modelType): bool
    {
        $supportedModels = array_keys(self::getAvailableModels());
        return in_array(strtolower($modelType), $supportedModels);
    }

    /**
     * Get model class from string identifier.
     */
    public static function getModelClass(string $modelType): ?string
    {
        $modelMap = [
            'supplier' => \App\Models\Supplier::class,
            'user' => \App\Models\User::class,
            'product' => \App\Models\Product::class,
            'customer' => \App\Models\Customer::class,
            'purchase' => \App\Models\Purchase::class,
            'sale' => \App\Models\Sale::class,
            'warehouse' => \App\Models\Warehouse::class,
            'employee' => \App\Models\Employee::class,
            'account' => \App\Models\Account::class,
            'currency' => \App\Models\Currency::class,
            'unit' => \App\Models\Unit::class,
            'branch' => \App\Models\Branch::class,
            'customeruser' => \App\Models\CustomerUser::class,
            'warehouseuser' => \App\Models\WareHouseUser::class,
            'attendancerequest' => \App\Models\AttendanceRequest::class,
            'attendancesetting' => \App\Models\AttendanceSetting::class,
            'gate' => \App\Models\Gate::class,
        ];

        return $modelMap[strtolower($modelType)] ?? null;
    }
} 