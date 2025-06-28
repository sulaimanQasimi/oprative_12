<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Gate;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Spatie\Activitylog\Models\Activity;

/**
 * Universal Activity Log Controller
 *
 * This controller provides a universal activity log system that can handle
 * activity logs for any model by finding them based on subject_type and subject_id.
 */
class ActivityLogController extends Controller
{
    /**
     * Display activities for a specific model instance.
     */
    public function show(Request $request, string $modelType, int $modelId): Response
    {
        // Validate and get the model class
        $modelClass = $this->getModelClass($modelType);
        
        if (!$modelClass) {
            abort(404, 'Model type not found');
        }

        // Find the model instance
        try {
            $model = $modelClass::findOrFail($modelId);
        } catch (ModelNotFoundException $e) {
            abort(404, 'Model instance not found');
        }

        // Check permissions - use generic permission format
        $permissionName = 'view_' . strtolower(class_basename($modelClass));
        $this->authorize($permissionName, $model);

        // Get activity logs for this model with pagination
        $activities = Activity::where('subject_type', $modelClass)
            ->where('subject_id', $modelId)
            ->with('causer:id,name,email') // Load the user who performed the action
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        // Transform the activities to include more readable information
        $activities->getCollection()->transform(function ($activity) use ($modelClass) {
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
                'changes' => $this->formatActivityChanges($activity, $modelClass),
            ];
        });

        // Get model metadata
        $modelMeta = $this->getModelMetadata($modelClass, $model);

        $permissions = [
            'can_view' => Gate::allows($permissionName, $model),
            'can_update' => Gate::allows('update_' . strtolower(class_basename($modelClass)), $model),
            'can_delete' => Gate::allows('delete_' . strtolower(class_basename($modelClass)), $model),
        ];

        return Inertia::render('Admin/ActivityLog/Show', [
            'model' => $model,
            'modelMeta' => $modelMeta,
            'activities' => $activities,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display all activities with filtering capabilities.
     */
    public function index(Request $request): Response
    {
        // $this->authorize('view_activity_logs');

        $query = Activity::with(['causer:id,name,email']);

        // Apply filters
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('log_name', 'like', "%{$search}%")
                  ->orWhereHas('causer', function ($cq) use ($search) {
                      $cq->where('name', 'like', "%{$search}%")
                         ->orWhere('email', 'like', "%{$search}%");
                  });
            });
        }

        // Model type filter
        if ($modelType = $request->input('model_type')) {
            $modelClass = $this->getModelClass($modelType);
            if ($modelClass) {
                $query->where('subject_type', $modelClass);
            }
        }

        // Log name filter
        if ($logName = $request->input('log_name')) {
            $query->where('log_name', $logName);
        }

        // Date range filter
        if ($dateFrom = $request->input('date_from')) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo = $request->input('date_to')) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        // User filter
        if ($userId = $request->input('user_id')) {
            $query->where('causer_id', $userId);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 20);
        $activities = $query->paginate($perPage);

        // Transform activities
        $activities->getCollection()->transform(function ($activity) {
            return [
                'id' => $activity->id,
                'log_name' => $activity->log_name,
                'description' => $activity->description,
                'subject_type' => $activity->subject_type,
                'subject_type_name' => $activity->subject_type ? class_basename($activity->subject_type) : null,
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
                'changes' => $this->formatActivityChanges($activity),
            ];
        });

        // Get available model types for filter
        $availableModels = $this->getAvailableModels();
        
        // Get available log names for filter
        $availableLogNames = Activity::distinct()->pluck('log_name')->filter()->sort()->values();

        $permissions = [
            'can_view_all' => Gate::allows('view_activity_logs'),
        ];

        return Inertia::render('Admin/ActivityLog/Index', [
            'activities' => $activities,
            'filters' => $request->only(['search', 'model_type', 'log_name', 'date_from', 'date_to', 'user_id', 'sort_field', 'sort_direction', 'per_page']),
            'availableModels' => $availableModels,
            'availableLogNames' => $availableLogNames,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Get the model class from a string identifier.
     */
    private function getModelClass(string $modelType): ?string
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

    /**
     * Get available models for filtering.
     */
    private function getAvailableModels(): array
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
     * Get model metadata for display purposes.
     */
    private function getModelMetadata(string $modelClass, $model): array
    {
        $basename = class_basename($modelClass);
        
        return [
            'type' => strtolower($basename),
            'class_name' => $basename,
            'display_name' => $this->getModelDisplayName($model),
            'icon' => $this->getModelIcon($basename),
            'route_prefix' => $this->getModelRoutePrefix($basename),
        ];
    }

    /**
     * Get display name for a model instance.
     */
    private function getModelDisplayName($model): string
    {
        // Try common name fields
        if (isset($model->name)) return $model->name;
        if (isset($model->title)) return $model->title;
        if (isset($model->description)) return $model->description;
        if (isset($model->email)) return $model->email;
        if (isset($model->reference_number)) return $model->reference_number;
        
        // Fallback to model type and ID
        return class_basename($model) . ' #' . $model->id;
    }

    /**
     * Get icon for a model type.
     */
    private function getModelIcon(string $modelType): string
    {
        $iconMap = [
            'Supplier' => 'Building',
            'User' => 'User',
            'Product' => 'Package',
            'Customer' => 'Users',
            'Purchase' => 'ShoppingCart',
            'Sale' => 'Receipt',
            'Warehouse' => 'Warehouse',
            'Employee' => 'UserCheck',
            'Account' => 'CreditCard',
            'Currency' => 'DollarSign',
            'Unit' => 'Ruler',
            'Branch' => 'MapPin',
            'CustomerUser' => 'UserCircle',
            'WareHouseUser' => 'UserCog',
            'AttendanceRequest' => 'Clock',
            'AttendanceSetting' => 'Settings',
            'Gate' => 'DoorOpen',
        ];

        return $iconMap[$modelType] ?? 'FileText';
    }

    /**
     * Get route prefix for a model type.
     */
    private function getModelRoutePrefix(string $modelType): string
    {
        $routeMap = [
            'Supplier' => 'admin.suppliers',
            'User' => 'admin.users',
            'Product' => 'admin.products',
            'Customer' => 'admin.customers',
            'Purchase' => 'admin.purchases',
            'Sale' => 'admin.sales',
            'Warehouse' => 'admin.warehouses',
            'Employee' => 'admin.employees',
            'Account' => 'admin.accounts',
            'Currency' => 'admin.currencies',
            'Unit' => 'admin.units',
            'Branch' => 'admin.branches',
            'CustomerUser' => 'admin.customer-users',
            'WareHouseUser' => 'admin.warehouse-users',
            'AttendanceRequest' => 'admin.attendance-requests',
            'AttendanceSetting' => 'admin.attendance-settings',
            'Gate' => 'admin.gates',
        ];

        return $routeMap[$modelType] ?? 'admin.dashboard';
    }

    /**
     * Format activity changes for better readability.
     */
    private function formatActivityChanges($activity, ?string $modelClass = null): array
    {
        $changes = [];
        
        if ($activity->properties && isset($activity->properties['attributes']) && isset($activity->properties['old'])) {
            $attributes = $activity->properties['attributes'];
            $old = $activity->properties['old'];
            
            foreach ($attributes as $key => $newValue) {
                if (isset($old[$key]) && $old[$key] !== $newValue) {
                    $changes[] = [
                        'field' => $this->formatFieldName($key, $modelClass),
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
                        'field' => $this->formatFieldName($key, $modelClass),
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
    private function formatFieldName(string $field, ?string $modelClass = null): string
    {
        // Universal field mappings
        $universalFieldMap = [
            'name' => 'Name',
            'title' => 'Title',
            'description' => 'Description',
            'email' => 'Email Address',
            'phone' => 'Phone Number',
            'address' => 'Address',
            'city' => 'City',
            'state' => 'State',
            'country' => 'Country',
            'postal_code' => 'Postal Code',
            'status' => 'Status',
            'price' => 'Price',
            'quantity' => 'Quantity',
            'total' => 'Total',
            'created_at' => 'Created Date',
            'updated_at' => 'Updated Date',
            'deleted_at' => 'Deleted Date',
        ];

        // Model-specific field mappings
        $modelSpecificMaps = [
            \App\Models\Supplier::class => [
                'contact_name' => 'Contact Name',
                'id_number' => 'ID Number',
            ],
            \App\Models\Product::class => [
                'sku' => 'SKU',
                'barcode' => 'Barcode',
                'cost_price' => 'Cost Price',
                'selling_price' => 'Selling Price',
                'stock_quantity' => 'Stock Quantity',
                'minimum_stock' => 'Minimum Stock',
            ],
            \App\Models\Customer::class => [
                'contact_person' => 'Contact Person',
                'company_name' => 'Company Name',
            ],
            \App\Models\Employee::class => [
                'employee_id' => 'Employee ID',
                'department' => 'Department',
                'position' => 'Position',
                'salary' => 'Salary',
                'hire_date' => 'Hire Date',
            ],
        ];

        // Check model-specific mapping first
        if ($modelClass && isset($modelSpecificMaps[$modelClass][$field])) {
            return $modelSpecificMaps[$modelClass][$field];
        }

        // Check universal mapping
        if (isset($universalFieldMap[$field])) {
            return $universalFieldMap[$field];
        }

        // Fallback to formatted field name
        return ucwords(str_replace('_', ' ', $field));
    }
}
