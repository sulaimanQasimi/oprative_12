# Universal Activity Log System Guide

This guide explains how to use the universal activity log system that can handle activity logs for any model by finding them based on `subject_type` and `subject_id`.

## 🎯 Overview

The universal activity log system provides:

1. **Universal Controller**: `ActivityLogController` - handles any model type
2. **Universal Routes**: Dynamic routes that work with any model
3. **Universal Frontend**: React components that adapt to any model
4. **Helper Class**: Easy-to-use helper methods for integration

## 🚀 Features

- ✅ **Universal Support**: Works with any model automatically
- ✅ **Dynamic Routes**: `/admin/activity-logs/{modelType}/{modelId}`
- ✅ **Filtering & Search**: Filter by model type, log name, date range, user
- ✅ **Responsive Design**: Modern UI with animations
- ✅ **Permissions**: Integrates with existing permission system
- ✅ **Pagination**: Efficient handling of large activity logs
- ✅ **Field Mapping**: Smart field name formatting
- ✅ **Icon Mapping**: Automatic icon selection per model type

## 📋 Requirements

### Models Must Have Activity Logging Enabled

For a model to work with this system, it must:

1. Use the `LogsActivity` trait
2. Implement `getActivitylogOptions()` method
3. Have proper permissions set up

Example model setup:
```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\Traits\LogsActivity;
use Spatie\Activitylog\LogOptions;

class YourModel extends Model
{
    use LogsActivity;

    protected $fillable = [
        'name',
        'email',
        // ... other fields
    ];

    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('your_model_name')
            ->setDescriptionForEvent(fn(string $eventName) => "This your_model_name has been {$eventName}")
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }
}
```

## 🛠 Usage

### 1. Direct URLs

You can access activity logs for any model using these URLs:

```
# View all activity logs
/admin/activity-logs

# View activity logs for a specific model instance
/admin/activity-logs/{modelType}/{modelId}

# Examples:
/admin/activity-logs/supplier/1
/admin/activity-logs/user/5
/admin/activity-logs/product/10
```

### 2. Using the Helper Class

```php
use App\Helpers\ActivityLogHelper;

// Generate activity log route for any model
$supplier = Supplier::find(1);
$activityLogUrl = ActivityLogHelper::routeFor($supplier);
// Returns: /admin/activity-logs/supplier/1

// Check if model is supported
if (ActivityLogHelper::isModelSupported('product')) {
    // Model is supported
}

// Get model class from string
$modelClass = ActivityLogHelper::getModelClass('user');
// Returns: App\Models\User
```

### 3. Adding Activity Log Buttons to Show Pages

Add this to any model's show page:

```jsx
import { ActivityLogHelper } from '@/Helpers/ActivityLogHelper';

// In your JSX
{permissions.can_view && (
    <Link href={route("admin.activity-logs.show", [modelType, model.id])}>
        <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            {t("Activity Log")}
        </Button>
    </Link>
)}
```

### 4. Programmatic Integration

```php
// In your controller
use App\Helpers\ActivityLogHelper;

public function show(YourModel $model)
{
    $activityLogRoute = ActivityLogHelper::routeFor($model);
    
    return Inertia::render('Admin/YourModel/Show', [
        'model' => $model,
        'activity_log_route' => $activityLogRoute,
    ]);
}
```

## 🎨 Supported Models

The system currently supports these models:

| Model Type | Display Name | Icon | Route Prefix |
|------------|--------------|------|--------------|
| supplier | Supplier | Building | admin.suppliers |
| user | User | User | admin.users |
| product | Product | Package | admin.products |
| customer | Customer | Users | admin.customers |
| purchase | Purchase | ShoppingCart | admin.purchases |
| sale | Sale | Receipt | admin.sales |
| warehouse | Warehouse | Warehouse | admin.warehouses |
| employee | Employee | UserCheck | admin.employees |
| account | Account | CreditCard | admin.accounts |
| currency | Currency | DollarSign | admin.currencies |
| unit | Unit | Ruler | admin.units |
| branch | Branch | MapPin | admin.branches |

## 🔧 Adding New Models

To add support for a new model:

1. **Add to Helper Class** (`app/Helpers/ActivityLogHelper.php`):
```php
// Add to getAvailableModels()
'newmodel' => 'New Model',

// Add to getModelClass()
'newmodel' => \App\Models\NewModel::class,
```

2. **Add to Controller** (`app/Http/Controllers/Admin/ActivityLogController.php`):
```php
// Add to getModelClass()
'newmodel' => \App\Models\NewModel::class,

// Add to getModelIcon()
'NewModel' => 'YourIcon',

// Add to getModelRoutePrefix()
'NewModel' => 'admin.newmodels',
```

3. **Add Icon** (if needed):
```php
// Import icon in Show.jsx
import { YourIcon } from "lucide-react";

// Add to ICON_MAP
const ICON_MAP = {
    // ... existing icons
    YourIcon,
};
```

## 🔐 Permissions

The system uses these permission patterns:

- `view_activity_logs` - View all activity logs (index page)
- `view_{model}` - View activity logs for specific model instances

Example:
- `view_supplier` - Required to view supplier activity logs
- `view_user` - Required to view user activity logs

## 🎭 Frontend Components

### ActivityLog/Index.jsx
- Lists all activities across all models
- Provides filtering by model type, log name, date range
- Supports search functionality
- Shows pagination

### ActivityLog/Show.jsx  
- Shows activities for a specific model instance
- Displays detailed change information
- Expandable activity details
- Model-specific icons and styling

## 📊 Filtering Options

The index page supports these filters:

1. **Search**: Search by description, log name, or user name
2. **Model Type**: Filter by specific model types
3. **Log Name**: Filter by activity log names
4. **Date Range**: Filter by date created (from/to)
5. **User**: Filter by user who performed the action

## 🎨 Customization

### Field Name Mapping

The system automatically formats field names, but you can customize them:

```php
// In ActivityLogController::formatFieldName()
$modelSpecificMaps = [
    \App\Models\YourModel::class => [
        'custom_field' => 'Custom Field Name',
        'another_field' => 'Another Display Name',
    ],
];
```

### Icon Mapping

Icons are automatically assigned, but you can customize them:

```php
// In ActivityLogController::getModelIcon()
$iconMap = [
    'YourModel' => 'YourLucideIcon',
];
```

## 🚨 Important Notes

1. **Model Requirements**: Models must use `LogsActivity` trait
2. **Permissions**: Ensure proper permissions are set up
3. **Performance**: Large activity logs are paginated automatically
4. **Security**: All routes are protected by authentication middleware
5. **Backwards Compatibility**: Existing model-specific activity log implementations continue to work

## 📝 Example Implementation

Here's a complete example of adding activity logs to a new model:

```php
// 1. Model setup
class Product extends Model
{
    use LogsActivity;
    
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('product')
            ->setDescriptionForEvent(fn(string $eventName) => "This product has been {$eventName}");
    }
}

// 2. Add to helper (already done for Product)

// 3. Use in frontend
<Link href={route("admin.activity-logs.show", ["product", product.id])}>
    <Button variant="outline">
        <History className="h-4 w-4 mr-2" />
        Activity Log
    </Button>
</Link>
```

## 🔗 Related Files

- `app/Http/Controllers/Admin/ActivityLogController.php` - Main controller
- `app/Helpers/ActivityLogHelper.php` - Helper methods
- `resources/js/Pages/Admin/ActivityLog/Index.jsx` - Index page
- `resources/js/Pages/Admin/ActivityLog/Show.jsx` - Show page
- `routes/admin.php` - Routes definition
- `docs/activity-log-implementation-guide.md` - Model-specific implementation guide

## 🎉 Benefits

1. **Consistency**: Uniform activity log experience across all models
2. **Maintainability**: Single codebase for all activity logs
3. **Extensibility**: Easy to add new models
4. **Performance**: Optimized queries and pagination
5. **User Experience**: Modern, responsive interface
6. **Developer Experience**: Simple integration with helper methods

This universal system provides a robust, scalable solution for activity logging that works seamlessly with any model in your Laravel application. 