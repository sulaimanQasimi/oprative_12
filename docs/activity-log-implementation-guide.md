# Activity Log Implementation Guide

This guide provides a comprehensive template for implementing activity logging across all models in the Laravel application using Spatie Activity Log package.

## Prerequisites

Ensure you have the Spatie Activity Log package installed and configured:

```bash
composer require spatie/laravel-activitylog
php artisan vendor:publish --provider="Spatie\Activitylog\ActivitylogServiceProvider" --tag="activitylog-migrations"
php artisan migrate
```

## Step 1: Model Implementation

### Basic Model Setup

For any model that needs activity logging, follow this template:

```php
<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class YourModel extends Model
{
    use SoftDeletes;
    use LogsActivity;

    protected $fillable = [
        // Add your fillable fields here
        'field1',
        'field2',
        'field3',
        // ...
    ];

    /**
     * Get the options for activity logging.
     */
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()                                    // Log all fillable attributes
            ->logOnlyDirty()                             // Only log changed attributes
            ->dontSubmitEmptyLogs()                      // Don't create logs for empty changes
            ->useLogName('your_model_name')              // Set log name (e.g., 'product', 'customer')
            ->setDescriptionForEvent(fn(string $eventName) => "This {model_name} has been {$eventName}")
            ->dontLogIfAttributesChangedOnly(['updated_at']); // Ignore timestamp-only changes
    }

    // Add your model relationships and methods here...
}
```

### Advanced Logging Configuration

For more complex logging needs:

```php
public function getActivitylogOptions(): LogOptions
{
    return LogOptions::defaults()
        ->logAll()

->logOnlyDirty()
        ->dontSubmitEmptyLogs()
        ->useLogName('your_model_name')
        ->setDescriptionForEvent(fn(string $eventName) => "This {model_name} has been {$eventName}")
        ->dontLogIfAttributesChangedOnly(['updated_at'])
        ->logExcept(['password', 'remember_token'])      // Exclude sensitive fields
        ->logOnly(['name', 'email', 'status'])           // Log only specific fields (alternative to logAll)
        ->submitEmptyLogs()                              // Include empty logs if needed
        ->dontLogIfAttributesChangedOnly(['updated_at', 'last_login_at']); // Multiple ignored fields
}
```

## Step 2: Controller Implementation

### Add Activity Log Method to Controller

Add this method to your model's controller:

```php
/**
 * Display the model activity log.
 */
public function activityLog(YourModel $model): Response
{
    $this->authorize('view_your_model', $model); // Use appropriate permission

    // Get activity logs for this model with pagination
    $activities = $model->activities()
        ->with('causer:id,name,email') // Load the user who performed the action
        ->orderBy('created_at', 'desc')
        ->paginate(20);

    // Transform the activities to include more readable information
    $activities->getCollection()->transform(function ($activity) {
        return [
            'id' => $activity->id,
            'log_name' => $activity->log_name,
            'description' => $activity->description,
            'subject_type' => $activity->subject_type,
            'subject_id' => $activity->subject_id,
            'causer_type' => $activity->causer_type,
            'causer_id' => $activity->causer_id,
            'causer' => $activity->causer ? [
                'id' => $activity->causer->id,
                'name' => $activity->causer->name,
                'email' => $activity->causer->email,
            ] : null,
            'properties' => $activity->properties,
            'created_at' => $activity->created_at,
            'updated_at' => $activity->updated_at,
            // Add human-readable changes
            'changes' => $this->formatActivityChanges($activity),
        ];
    });

    $permissions = [
        'can_view' => Gate::allows('view_your_model', $model),
        'can_update' => Gate::allows('update_your_model', $model),
        'can_delete' => Gate::allows('delete_your_model', $model),
    ];

    return Inertia::render('Admin/YourModel/ActivityLog', [
        'model' => $model,
        'activities' => $activities,
        'permissions' => $permissions,
    ]);
}

/**
 * Format activity changes for better readability.
 */
private function formatActivityChanges($activity): array
{
    $changes = [];
    
    if ($activity->properties && isset($activity->properties['attributes']) && isset($activity->properties['old'])) {
        $attributes = $activity->properties['attributes'];
        $old = $activity->properties['old'];
        
        foreach ($attributes as $key => $newValue) {
            if (isset($old[$key]) && $old[$key] !== $newValue) {
                $changes[] = [
                    'field' => $this->formatFieldName($key),
                    'old_value' => $old[$key] ?? '',
                    'new_value' => $newValue ?? '',
                ];
            }
        }
    } elseif ($activity->properties && isset($activity->properties['attributes'])) {
        // For created records
        $attributes = $activity->properties['attributes'];
        foreach ($attributes as $key => $value) {
            if (!empty($value)) {
                $changes[] = [
                    'field' => $this->formatFieldName($key),
                    'old_value' => '',
                    'new_value' => $value,
                ];
            }
        }
    }
    
    return $changes;
}

/**
 * Format field names for better readability.
 */
private function formatFieldName(string $field): string
{
    $fieldMap = [
        // Customize this map for your model's fields
        'name' => 'Name',
        'email' => 'Email Address',
        'phone' => 'Phone Number',
        'status' => 'Status',
        'created_at' => 'Created Date',
        'updated_at' => 'Updated Date',
        // Add more field mappings as needed
    ];

    return $fieldMap[$field] ?? ucwords(str_replace('_', ' ', $field));
}
```

## Step 3: Route Implementation

Add the activity log route to your routes file:

```php
// In routes/admin.php or your appropriate route file
Route::prefix('your-models')->group(function () {
    Route::get('/', [YourModelController::class, 'index'])->name('admin.your_models.index');
    Route::get('/create', [YourModelController::class, 'create'])->name('admin.your_models.create');
    Route::post('/', [YourModelController::class, 'store'])->name('admin.your_models.store');
    Route::get('/{model}', [YourModelController::class, 'show'])->name('admin.your_models.show');
    Route::get('/{model}/edit', [YourModelController::class, 'edit'])->name('admin.your_models.edit');
    Route::put('/{model}', [YourModelController::class, 'update'])->name('admin.your_models.update');
    Route::delete('/{model}', [YourModelController::class, 'destroy'])->name('admin.your_models.destroy');
    
    // Activity Log Route
    Route::get('/{model}/activity-log', [YourModelController::class, 'activityLog'])->name('admin.your_models.activity-log');
});
```

## Step 4: Frontend Component

Create a React component for displaying activity logs. Use the Supplier ActivityLog component as a template and customize:

1. Update the model icon and references
2. Change route names to match your model
3. Update field mappings in the component
4. Customize the model information display

## Step 5: Permission Setup

Ensure you have the appropriate permissions set up for viewing activity logs. The activity log should typically use the same permission as viewing the model:

```php
// In your Policy class
public function viewActivityLog(User $user, YourModel $model): bool
{
    return $user->can('view_your_model', $model);
}
```

## Step 6: Navigation Integration

Add activity log links to your model's show page or navigation:

```jsx
// In your model's Show component
{permissions.can_view && (
    <Link href={route("admin.your_models.activity-log", model.id)}>
        <Button variant="outline" className="gap-2">
            <History className="h-4 w-4" />
            {t("Activity Log")}
        </Button>
    </Link>
)}
```

## Model-Specific Customizations

### For different models, customize these areas:

1. **Field Mappings**: Update the `formatFieldName` method with model-specific field names
2. **Log Name**: Use descriptive log names like 'product', 'customer', 'order', etc.
3. **Sensitive Fields**: Exclude password, token, or other sensitive fields from logging
4. **Icons**: Use appropriate icons for each model type
5. **Permissions**: Use model-specific permissions
6. **Route Names**: Follow your application's route naming conventions

## Examples for Common Models

### Product Model
```php
->useLogName('product')
->setDescriptionForEvent(fn(string $eventName) => "This product has been {$eventName}")
->logExcept(['updated_at', 'last_synced_at'])
```

### Customer Model
```php
->useLogName('customer')
->setDescriptionForEvent(fn(string $eventName) => "This customer has been {$eventName}")
->logExcept(['password', 'remember_token', 'updated_at'])
```

### Order Model
```php
->useLogName('order')
->setDescriptionForEvent(fn(string $eventName) => "This order has been {$eventName}")
->logExcept(['updated_at'])
```

## Best Practices

1. **Performance**: Use pagination for activity logs to avoid loading too many records
2. **Security**: Never log sensitive information like passwords or tokens
3. **Readability**: Always format field names for better user experience
4. **Permissions**: Ensure proper authorization for viewing activity logs
5. **Cleanup**: Consider implementing log cleanup for old activities to manage database size
6. **Indexing**: Add database indexes on frequently queried activity log fields

## Testing

Always test your activity logging implementation:

1. Create, update, and delete model records
2. Verify that activities are logged correctly
3. Check that sensitive fields are excluded
4. Test the frontend display of activity logs
5. Verify permissions are working correctly

## Implementation Checklist

For each model you want to add activity logging to:

- [ ] Add `LogsActivity` trait to model
- [ ] Configure `getActivitylogOptions()` method
- [ ] Add `activityLog` method to controller
- [ ] Add `formatActivityChanges` and `formatFieldName` helper methods
- [ ] Add route for activity log
- [ ] Create React component for frontend
- [ ] Update permissions/policies
- [ ] Add navigation links
- [ ] Test all functionality

This template provides a solid foundation for implementing activity logging across all your models while maintaining consistency and best practices.
