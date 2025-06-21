****# UnitController Operations Procedure Guide
## Senior Developer Implementation Standards

### Table of Contents
1. [Overview](#overview)
2. [Architecture & Design Patterns](#architecture--design-patterns)
3. [Security Implementation](#security-implementation)
4. [CRUD Operations](#crud-operations)
5. [Error Handling](#error-handling)
6. [Performance Optimization](#performance-optimization)
7. [Testing Strategy](#testing-strategy)
8. [API Documentation](#api-documentation)
9. [Deployment Considerations](#deployment-considerations)
10. [Maintenance & Monitoring](#maintenance--monitoring)

---

## Overview

The `UnitController` manages measurement units in the inventory system with comprehensive CRUD operations, permission-based access control, and soft deletion capabilities.

### Core Responsibilities
- ✅ **CRUD Operations**: Create, Read, Update, Delete units
- ✅ **Permission Management**: Role-based access control
- ✅ **Soft Deletion**: Safe deletion with restore capability
- ✅ **Data Validation**: Input sanitization and validation
- ✅ **Frontend Integration**: Inertia.js with React components

---

## Architecture & Design Patterns

### 1. **MVC Pattern Implementation**
```php
// Controller Layer - Business Logic
class UnitController extends Controller
{
    // Middleware for authorization
    // Service injection for complex operations
    // Response formatting
}

// Model Layer - Data Management
class Unit extends Model
{
    use SoftDeletes;
    // Relationships, mutators, accessors
}

// View Layer - Frontend (React/Inertia)
// Component-based UI with permission checks
```

### 2. **Repository Pattern (Recommended Enhancement)**
```php
// Future enhancement for better separation of concerns
interface UnitRepositoryInterface
{
    public function findAll(array $filters = []);
    public function findById(int $id);
    public function create(array $data);
    public function update(int $id, array $data);
    public function delete(int $id);
}
```

### 3. **Service Layer Pattern (Recommended)**
```php
// For complex business logic
class UnitService
{
    public function createUnitWithValidation(array $data);
    public function bulkImport(array $units);
    public function generateReport();
}
```

---

## Security Implementation

### 1. **Permission System**
```php
// Middleware Protection
$this->middleware('can:view_any_unit')->only(['index']);
$this->middleware('can:view_unit,unit')->only(['show']);
$this->middleware('can:create_unit')->only(['create', 'store']);
$this->middleware('can:update_unit,unit')->only(['edit', 'update']);
$this->middleware('can:delete_unit,unit')->only(['destroy']);
```

### 2. **Input Validation Rules**
```php
// Enhanced validation rules
protected function validationRules(Unit $unit = null): array
{
    return [
        'name' => 'required|string|max:255|min:2',
        'code' => [
            'required',
            'string',
            'max:10',
            'alpha_num',
            Rule::unique('units')->ignore($unit?->id),
        ],
        'symbol' => 'required|string|max:5|min:1',
        'description' => 'nullable|string|max:500',
        'is_active' => 'boolean',
    ];
}
```

### 3. **Mass Assignment Protection**
```php
// In Unit Model
protected $fillable = [
    'name',
    'code', 
    'symbol',
    'description',
    'is_active'
];

protected $guarded = ['id', 'created_at', 'updated_at'];
```

---

## CRUD Operations

### 1. **INDEX - List All Units**
```php
public function index(Request $request)
{
    try {
        // Query with filters, pagination, and search
        $query = Unit::query();
        
        // Apply search filters
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('symbol', 'like', "%{$search}%");
            });
        }
        
        // Apply status filter
        if ($request->filled('status')) {
            if ($request->status === 'active') {
                $query->where('is_active', true);
            } elseif ($request->status === 'inactive') {
                $query->where('is_active', false);
            }
        }
        
        // Include soft deleted if requested
        if ($request->boolean('include_deleted')) {
            $query->withTrashed();
        }
        
        // Ordering
        $query->orderBy(
            $request->get('sort_by', 'name'),
            $request->get('sort_direction', 'asc')
        );
        
        // Pagination
        $units = $query->paginate(
            $request->get('per_page', 15)
        )->withQueryString();
        
        // Permission checks for frontend
        $permissions = $this->getUserPermissions();
        
        return Inertia::render('Admin/Unit/Index', [
            'units' => $units,
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_direction']),
            'stats' => $this->getUnitStats(),
        ]);
        
    } catch (\Exception $e) {
        Log::error('Unit index error: ' . $e->getMessage());
        return back()->withErrors(['error' => 'Failed to load units.']);
    }
}
```

### 2. **CREATE - Add New Unit**
```php
public function store(Request $request)
{
    $validated = $request->validate($this->validationRules());
    
    DB::beginTransaction();
    
    try {
        // Create unit
        $unit = Unit::create($validated);
        
        // Log activity
        activity('unit')
            ->performedOn($unit)
            ->causedBy(Auth::user())
            ->log('Unit created');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', 'Unit created successfully.')
            ->with('unit_id', $unit->id);
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit creation error: ' . $e->getMessage());
        
        return back()
            ->withInput()
            ->withErrors(['error' => 'Failed to create unit. Please try again.']);
    }
}
```

### 3. **READ - Show Specific Unit**
```php
public function show(Unit $unit)
{
    try {
        // Load relationships if needed
        $unit->load(['products', 'createdBy', 'updatedBy']);
        
        // Get usage statistics
        $stats = [
            'products_count' => $unit->products()->count(),
            'active_products' => $unit->products()->where('is_active', true)->count(),
            'total_inventory_value' => $unit->products()->sum('total_value'),
        ];
        
        $permissions = $this->getUserPermissions($unit);
        
        return Inertia::render('Admin/Unit/Show', [
            'unit' => $unit,
            'stats' => $stats,
            'permissions' => $permissions,
            'activity_log' => activity()->forSubject($unit)->limit(10)->get(),
        ]);
        
    } catch (\Exception $e) {
        Log::error('Unit show error: ' . $e->getMessage());
        return Redirect::route('admin.units.index')
            ->withErrors(['error' => 'Unit not found.']);
    }
}
```

### 4. **UPDATE - Modify Existing Unit**
```php
public function update(Request $request, Unit $unit)
{
    $validated = $request->validate($this->validationRules($unit));
    
    DB::beginTransaction();
    
    try {
        // Track changes
        $originalData = $unit->toArray();
        
        // Update unit
        $unit->update($validated);
        
        // Log changes
        $changes = array_diff_assoc($validated, $originalData);
        if (!empty($changes)) {
            activity('unit')
                ->performedOn($unit)
                ->causedBy(Auth::user())
                ->withProperties([
                    'old' => $originalData,
                    'new' => $changes
                ])
                ->log('Unit updated');
        }
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', 'Unit updated successfully.');
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit update error: ' . $e->getMessage());
        
        return back()
            ->withInput()
            ->withErrors(['error' => 'Failed to update unit.']);
    }
}
```

### 5. **DELETE - Soft Delete Unit**
```php
public function destroy(Unit $unit)
{
    DB::beginTransaction();
    
    try {
        // Check if unit is in use
        if ($unit->products()->exists()) {
            return back()->withErrors([
                'error' => 'Cannot delete unit that is currently in use by products.'
            ]);
        }
        
        // Soft delete
        $unit->delete();
        
        // Log activity
        activity('unit')
            ->performedOn($unit)
            ->causedBy(Auth::user())
            ->log('Unit deleted (soft)');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', 'Unit deleted successfully.');
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit deletion error: ' . $e->getMessage());
        
        return back()->withErrors(['error' => 'Failed to delete unit.']);
    }
}
```

### 6. **RESTORE - Restore Soft Deleted Unit**
```php
public function restore(Unit $unit)
{
    DB::beginTransaction();
    
    try {
        $unit->restore();
        
        activity('unit')
            ->performedOn($unit)
            ->causedBy(Auth::user())
            ->log('Unit restored');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', 'Unit restored successfully.');
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit restoration error: ' . $e->getMessage());
        
        return back()->withErrors(['error' => 'Failed to restore unit.']);
    }
}
```

---

## Error Handling

### 1. **Custom Exception Classes**
```php
// Create custom exceptions for better error handling
class UnitNotFoundException extends \Exception {}
class UnitInUseException extends \Exception {}
class UnitValidationException extends \Exception {}
```

### 2. **Global Error Handler**
```php
// In App\Exceptions\Handler.php
public function render($request, Throwable $exception)
{
    if ($exception instanceof UnitNotFoundException) {
        return response()->json(['error' => 'Unit not found'], 404);
    }
    
    if ($exception instanceof UnitInUseException) {
        return response()->json(['error' => 'Unit is currently in use'], 422);
    }
    
    return parent::render($request, $exception);
}
```

---

## Performance Optimization

### 1. **Database Indexing**
```sql
-- Add database indexes for performance
CREATE INDEX idx_units_name ON units(name);
CREATE INDEX idx_units_code ON units(code);
CREATE INDEX idx_units_active ON units(is_active);
CREATE INDEX idx_units_deleted_at ON units(deleted_at);
```

### 2. **Query Optimization**
```php
// Use eager loading to prevent N+1 queries
$units = Unit::with(['products:id,name,unit_id'])
    ->select(['id', 'name', 'code', 'symbol', 'is_active'])
    ->paginate(15);

// Use database-level counting instead of collection counting
$stats = [
    'total_units' => Unit::count(),
    'active_units' => Unit::where('is_active', true)->count(),
    'inactive_units' => Unit::where('is_active', false)->count(),
];
```

### 3. **Caching Strategy**
```php
// Cache frequently accessed data
public function getUnitStats()
{
    return Cache::remember('unit_stats', 300, function () {
        return [
            'total' => Unit::count(),
            'active' => Unit::where('is_active', true)->count(),
            'with_products' => Unit::has('products')->count(),
        ];
    });
}
```

---

## Testing Strategy

### 1. **Unit Tests**
```php
// tests/Unit/UnitTest.php
class UnitTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_unit_can_be_created()
    {
        $unit = Unit::factory()->create([
            'name' => 'Kilogram',
            'code' => 'KG',
            'symbol' => 'kg'
        ]);
        
        $this->assertDatabaseHas('units', [
            'name' => 'Kilogram',
            'code' => 'KG'
        ]);
    }
    
    public function test_unit_code_must_be_unique()
    {
        Unit::factory()->create(['code' => 'KG']);
        
        $this->expectException(ValidationException::class);
        Unit::factory()->create(['code' => 'KG']);
    }
}
```

### 2. **Feature Tests**
```php
// tests/Feature/UnitControllerTest.php
class UnitControllerTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_authenticated_user_can_view_units()
    {
        $user = User::factory()->create();
        $user->givePermissionTo('view_any_unit');
        
        $response = $this->actingAs($user)
            ->get(route('admin.units.index'));
            
        $response->assertStatus(200);
    }
    
    public function test_unauthorized_user_cannot_create_unit()
    {
        $user = User::factory()->create();
        
        $response = $this->actingAs($user)
            ->post(route('admin.units.store'), [
                'name' => 'Test Unit',
                'code' => 'TU',
                'symbol' => 'tu'
            ]);
            
        $response->assertStatus(403);
    }
}
```

---

## API Documentation

### Endpoints Overview
```yaml
GET    /admin/units           # List all units
POST   /admin/units           # Create new unit
GET    /admin/units/{unit}    # Show specific unit
PUT    /admin/units/{unit}    # Update unit
DELETE /admin/units/{unit}    # Soft delete unit
POST   /admin/units/{unit}/restore    # Restore deleted unit
DELETE /admin/units/{unit}/force-delete # Permanently delete unit
```

### Request/Response Examples
```json
// POST /admin/units
{
    "name": "Kilogram",
    "code": "KG",
    "symbol": "kg",
    "description": "Unit of mass",
    "is_active": true
}

// Response
{
    "message": "Unit created successfully",
    "unit": {
        "id": 1,
        "name": "Kilogram",
        "code": "KG",
        "symbol": "kg",
        "is_active": true,
        "created_at": "2024-01-01T00:00:00Z"
    }
}
```

---

## Deployment Considerations

### 1. **Environment Configuration**
```env
# .env settings for units module
UNITS_CACHE_TTL=300
UNITS_PER_PAGE=15
UNITS_MAX_IMPORT_SIZE=1000
```

### 2. **Database Migrations**
```php
// Ensure proper migration order
// 001_create_units_table.php
// 002_add_indexes_to_units_table.php
// 003_add_description_to_units_table.php
```

### 3. **Monitoring & Logging**
```php
// Add monitoring for unit operations
Log::channel('units')->info('Unit operation', [
    'action' => 'create',
    'user_id' => Auth::id(),
    'unit_data' => $validated
]);
```

---

## Maintenance & Monitoring

### 1. **Regular Cleanup Tasks**
```php
// Artisan command for cleanup
// app/Console/Commands/CleanupUnits.php
class CleanupUnits extends Command
{
    public function handle()
    {
        // Remove permanently deleted units older than 30 days
        Unit::onlyTrashed()
            ->where('deleted_at', '<', now()->subDays(30))
            ->forceDelete();
            
        $this->info('Unit cleanup completed.');
    }
}
```

### 2. **Health Checks**
```php
// Monitor unit system health
public function healthCheck()
{
    return [
        'units_count' => Unit::count(),
        'active_units' => Unit::where('is_active', true)->count(),
        'units_with_products' => Unit::has('products')->count(),
        'last_created' => Unit::latest()->first()?->created_at,
    ];
}
```

### 3. **Performance Monitoring**
```php
// Track slow queries and optimize
DB::listen(function ($query) {
    if ($query->time > 1000) { // Queries taking more than 1 second
        Log::warning('Slow query detected', [
            'sql' => $query->sql,
            'time' => $query->time,
            'bindings' => $query->bindings
        ]);
    }
});
```

---

## Best Practices Summary

1. ✅ **Always use database transactions** for multi-step operations
2. ✅ **Implement proper error handling** with meaningful messages
3. ✅ **Use soft deletes** for data integrity
4. ✅ **Log all important actions** for audit trails
5. ✅ **Validate all inputs** on both frontend and backend
6. ✅ **Use permission middleware** for security
7. ✅ **Cache frequently accessed data** for performance
8. ✅ **Write comprehensive tests** for all functionality
9. ✅ **Monitor performance** and optimize queries
10. ✅ **Document all changes** and maintain this guide

---

*This procedure guide should be reviewed and updated regularly as the system evolves.* 
