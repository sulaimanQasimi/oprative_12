# UnitController Operations - Senior Developer Procedure Guide

## 🎯 Executive Summary

This document provides comprehensive procedures for implementing and maintaining the UnitController following senior developer standards. The controller manages measurement units with full CRUD operations, permission-based access control, soft deletion, and audit trails.

---

## 🏗️ Architecture Overview

### System Design
- **Pattern**: MVC with Policy-based authorization
- **Framework**: Laravel 10+ with Inertia.js + React
- **Security**: Spatie Laravel Permission package
- **Database**: MySQL with soft deletes and activity logging
- **Caching**: Redis-based performance optimization

### Core Components
```
UnitController (Business Logic)
├── UnitPolicy (Authorization)
├── Unit Model (Data Layer)
├── UnitRequest (Validation)
├── React Components (Frontend)
└── Database Migrations (Schema)
```

---

## 🔐 Security Implementation

### 1. Permission Matrix
| Action | Permission | Middleware | Policy Method |
|--------|------------|------------|---------------|
| Index | `view_any_unit` | ✅ | `viewAny()` |
| Show | `view_unit` | ✅ | `view()` |
| Create | `create_unit` | ✅ | `create()` |
| Store | `create_unit` | ✅ | `create()` |
| Edit | `update_unit` | ✅ | `update()` |
| Update | `update_unit` | ✅ | `update()` |
| Delete | `delete_unit` | ✅ | `delete()` |
| Restore | `restore_unit` | ✅ | `restore()` |
| Force Delete | `force_delete_unit` | ✅ | `forceDelete()` |

### 2. Validation Rules
```php
protected function getValidationRules(Unit $unit = null): array
{
    return [
        'name' => [
            'required',
            'string',
            'max:255',
            'min:2',
            'regex:/^[a-zA-Z\s\-\_\.]+$/'
        ],
        'code' => [
            'required',
            'string',
            'max:10',
            'alpha_num',
            'uppercase',
            Rule::unique('units')->ignore($unit?->id),
        ],
        'symbol' => [
            'required',
            'string',
            'max:5',
            'min:1',
        ],
        'description' => 'nullable|string|max:500',
        'is_active' => 'boolean',
    ];
}
```

---

## 📋 CRUD Operations Implementation

### 1. INDEX - Advanced Listing
**Purpose**: Display paginated, filtered, and searchable unit list

**Key Features**:
- Advanced search and filtering
- Sorting with validation
- Pagination with query preservation
- Statistics dashboard
- Permission-aware UI

**Code Structure**:
```php
public function index(Request $request)
{
    try {
        // 1. Build filtered query
        $query = $this->buildFilteredQuery($request);
        
        // 2. Apply sorting
        $query = $this->applySorting($query, $request);
        
        // 3. Paginate results
        $units = $query->paginate($this->getValidatedPerPage($request));
        
        // 4. Get statistics
        $stats = $this->getUnitStatistics();
        
        // 5. Check permissions
        $permissions = $this->getUserPermissions();
        
        // 6. Return Inertia response
        return Inertia::render('Admin/Unit/Index', [
            'units' => $units,
            'permissions' => $permissions,
            'filters' => $request->validated(),
            'stats' => $stats,
        ]);
        
    } catch (\Exception $e) {
        return $this->handleError($e, 'Failed to load units');
    }
}

private function buildFilteredQuery(Request $request): Builder
{
    $query = Unit::query();
    
    // Search functionality
    if ($request->filled('search')) {
        $search = $request->search;
        $query->where(function ($q) use ($search) {
            $q->where('name', 'like', "%{$search}%")
              ->orWhere('code', 'like', "%{$search}%")
              ->orWhere('symbol', 'like', "%{$search}%");
        });
    }
    
    // Status filtering
    match($request->get('status')) {
        'active' => $query->where('is_active', true),
        'inactive' => $query->where('is_active', false),
        'deleted' => $query->onlyTrashed(),
        'all' => $query->withTrashed(),
        default => null
    };
    
    return $query;
}
```

### 2. STORE - Enhanced Creation
**Purpose**: Create new units with comprehensive validation

**Key Features**:
- Multi-layer validation
- Business rule enforcement
- Activity logging
- Cache invalidation
- Database transactions

**Implementation**:
```php
public function store(UnitStoreRequest $request)
{
    DB::beginTransaction();
    
    try {
        // 1. Get validated data
        $validated = $request->validated();
        
        // 2. Apply business rules
        $this->enforceBusinessRules($validated);
        
        // 3. Normalize data
        $validated = $this->normalizeUnitData($validated);
        
        // 4. Create unit
        $unit = Unit::create($validated);
        
        // 5. Log activity
        $this->logActivity('created', $unit, $validated);
        
        // 6. Clear cache
        $this->clearUnitCache();
        
        DB::commit();
        
        return $this->successResponse(
            'admin.units.index',
            "Unit '{$unit->name}' created successfully.",
            ['created_unit_id' => $unit->id]
        );
        
    } catch (ValidationException $e) {
        DB::rollback();
        return $this->validationError($e);
        
    } catch (\Exception $e) {
        DB::rollback();
        return $this->handleError($e, 'Failed to create unit');
    }
}

private function enforceBusinessRules(array $data): void
{
    // Check for similar units
    if (Unit::where('name', 'LIKE', "%{$data['name']}%")->exists()) {
        throw ValidationException::withMessages([
            'name' => 'A similar unit name already exists.'
        ]);
    }
    
    // Validate symbol format
    if (!preg_match('/^[a-zA-Z0-9\/\²\³°]+$/', $data['symbol'])) {
        throw ValidationException::withMessages([
            'symbol' => 'Symbol contains invalid characters.'
        ]);
    }
}
```

### 3. SHOW - Detailed View with Analytics
**Purpose**: Display comprehensive unit information with usage statistics

```php
public function show(Unit $unit)
{
    try {
        // Load relationships efficiently
        $unit->load([
            'products:id,name,unit_id,price,stock_quantity',
            'createdBy:id,name',
            'updatedBy:id,name'
        ]);
        
        // Calculate analytics
        $analytics = $this->calculateUnitAnalytics($unit);
        
        // Get activity history
        $activityLog = $this->getUnitActivityLog($unit);
        
        // Check permissions
        $permissions = $this->getUserPermissions($unit);
        
        return Inertia::render('Admin/Unit/Show', [
            'unit' => $unit,
            'analytics' => $analytics,
            'activityLog' => $activityLog,
            'permissions' => $permissions,
        ]);
        
    } catch (\Exception $e) {
        return $this->handleError($e, 'Failed to load unit details');
    }
}

private function calculateUnitAnalytics(Unit $unit): array
{
    return [
        'total_products' => $unit->products()->count(),
        'active_products' => $unit->products()->where('is_active', true)->count(),
        'total_inventory_value' => $unit->products()
            ->sum(DB::raw('price * stock_quantity')),
        'average_price' => $unit->products()->avg('price'),
        'low_stock_count' => $unit->products()
            ->whereRaw('stock_quantity <= min_stock_level')
            ->count(),
    ];
}
```

### 4. UPDATE - Change Tracking
**Purpose**: Update units with change detection and audit trails

```php
public function update(UnitUpdateRequest $request, Unit $unit)
{
    DB::beginTransaction();
    
    try {
        // Store original data
        $originalData = $unit->toArray();
        
        // Get validated data
        $validated = $request->validated();
        
        // Validate business rules for updates
        $this->validateUpdateRules($validated, $unit);
        
        // Normalize data
        $validated = $this->normalizeUnitData($validated);
        
        // Update unit
        $unit->update($validated);
        
        // Track and log changes
        $this->logChanges($unit, $originalData, $validated);
        
        // Clear cache
        $this->clearUnitCache();
        
        DB::commit();
        
        return $this->successResponse(
            'admin.units.index',
            "Unit '{$unit->name}' updated successfully."
        );
        
    } catch (\Exception $e) {
        DB::rollback();
        return $this->handleError($e, 'Failed to update unit');
    }
}

private function validateUpdateRules(array $data, Unit $unit): void
{
    // Check if deactivating unit with active products
    if (isset($data['is_active']) && 
        !$data['is_active'] && 
        $unit->products()->where('is_active', true)->exists()) {
        
        throw ValidationException::withMessages([
            'is_active' => 'Cannot deactivate unit with active products.'
        ]);
    }
}
```

### 5. DELETE - Safe Removal
**Purpose**: Soft delete with dependency checking

```php
public function destroy(Unit $unit)
{
    DB::beginTransaction();
    
    try {
        // Check dependencies
        $dependencies = $this->checkDependencies($unit);
        
        if (!empty($dependencies)) {
            return back()->withErrors([
                'error' => 'Cannot delete unit used by: ' . implode(', ', $dependencies)
            ]);
        }
        
        // Store data before deletion
        $unitData = $unit->toArray();
        
        // Soft delete
        $unit->delete();
        
        // Log activity
        $this->logActivity('deleted', $unit, $unitData);
        
        // Clear cache
        $this->clearUnitCache();
        
        DB::commit();
        
        return $this->successResponse(
            'admin.units.index',
            "Unit '{$unit->name}' deleted. Can be restored if needed."
        );
        
    } catch (\Exception $e) {
        DB::rollback();
        return $this->handleError($e, 'Failed to delete unit');
    }
}

private function checkDependencies(Unit $unit): array
{
    $dependencies = [];
    
    if ($count = $unit->products()->count()) {
        $dependencies[] = "{$count} products";
    }
    
    if ($count = $unit->wholesaleProducts()->count()) {
        $dependencies[] = "{$count} wholesale products";
    }
    
    if ($count = $unit->retailProducts()->count()) {
        $dependencies[] = "{$count} retail products";
    }
    
    return $dependencies;
}
```

---

## 🛠️ Helper Methods & Utilities

### Permission Management
```php
private function getUserPermissions(Unit $unit = null): array
{
    return [
        'can_create' => Gate::allows('create_unit'),
        'can_view' => $unit ? Gate::allows('view_unit', $unit) : true,
        'can_update' => $unit ? Gate::allows('update_unit', $unit) : true,
        'can_delete' => $unit ? Gate::allows('delete_unit', $unit) : true,
        'can_restore' => $unit ? Gate::allows('restore_unit', $unit) : true,
        'can_force_delete' => $unit ? Gate::allows('force_delete_unit', $unit) : true,
    ];
}
```

### Data Normalization
```php
private function normalizeUnitData(array $data): array
{
    return [
        ...$data,
        'code' => strtoupper($data['code']),
        'name' => ucwords(strtolower($data['name'])),
        'is_active' => $data['is_active'] ?? true,
    ];
}
```

### Activity Logging
```php
private function logActivity(string $action, Unit $unit, array $data = []): void
{
    activity('unit')
        ->performedOn($unit)
        ->causedBy(Auth::user())
        ->withProperties($data)
        ->log("Unit {$action}");
}
```

### Error Handling
```php
private function handleError(\Exception $e, string $message): RedirectResponse
{
    Log::error("Unit operation failed: {$message}", [
        'error' => $e->getMessage(),
        'user_id' => Auth::id(),
        'trace' => $e->getTraceAsString()
    ]);
    
    return back()->withErrors(['error' => $message . ' Please try again.']);
}
```

---

## 🧪 Testing Strategy

### 1. Unit Tests
```php
// tests/Unit/UnitTest.php
class UnitTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_unit_creation_sets_defaults()
    {
        $unit = Unit::factory()->create(['is_active' => null]);
        $this->assertTrue($unit->is_active);
    }
    
    public function test_unit_code_is_automatically_uppercase()
    {
        $unit = Unit::factory()->create(['code' => 'kg']);
        $this->assertEquals('KG', $unit->code);
    }
    
    public function test_unit_soft_deletion()
    {
        $unit = Unit::factory()->create();
        $unit->delete();
        
        $this->assertSoftDeleted('units', ['id' => $unit->id]);
    }
    
    public function test_unit_relationships()
    {
        $unit = Unit::factory()->create();
        $product = Product::factory()->create(['unit_id' => $unit->id]);
        
        $this->assertTrue($unit->products->contains($product));
    }
}
```

### 2. Feature Tests
```php
// tests/Feature/UnitControllerTest.php
class UnitControllerTest extends TestCase
{
    use RefreshDatabase;
    
    protected User $adminUser;
    protected User $regularUser;
    
    protected function setUp(): void
    {
        parent::setUp();
        
        $this->adminUser = User::factory()->create();
        $this->adminUser->givePermissionTo([
            'view_any_unit', 'create_unit', 'update_unit', 'delete_unit'
        ]);
        
        $this->regularUser = User::factory()->create();
    }
    
    public function test_admin_can_view_units_index()
    {
        Unit::factory()->count(3)->create();
        
        $response = $this->actingAs($this->adminUser)
            ->get(route('admin.units.index'));
            
        $response->assertOk();
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Unit/Index')
                 ->has('units.data', 3)
                 ->has('permissions')
                 ->where('permissions.can_create', true)
        );
    }
    
    public function test_regular_user_cannot_access_units()
    {
        $response = $this->actingAs($this->regularUser)
            ->get(route('admin.units.index'));
            
        $response->assertForbidden();
    }
    
    public function test_admin_can_create_unit()
    {
        $unitData = [
            'name' => 'Kilogram',
            'code' => 'KG',
            'symbol' => 'kg',
            'description' => 'Unit of mass'
        ];
        
        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.units.store'), $unitData);
            
        $response->assertRedirect(route('admin.units.index'));
        $response->assertSessionHas('success');
        
        $this->assertDatabaseHas('units', [
            'name' => 'Kilogram',
            'code' => 'KG',
            'symbol' => 'kg'
        ]);
    }
    
    public function test_validation_prevents_duplicate_codes()
    {
        Unit::factory()->create(['code' => 'KG']);
        
        $response = $this->actingAs($this->adminUser)
            ->post(route('admin.units.store'), [
                'name' => 'Kilogram',
                'code' => 'KG',
                'symbol' => 'kg'
            ]);
            
        $response->assertSessionHasErrors('code');
        $this->assertDatabaseCount('units', 1);
    }
    
    public function test_cannot_delete_unit_with_products()
    {
        $unit = Unit::factory()->create();
        Product::factory()->create(['unit_id' => $unit->id]);
        
        $response = $this->actingAs($this->adminUser)
            ->delete(route('admin.units.destroy', $unit));
            
        $response->assertSessionHasErrors('error');
        $this->assertDatabaseHas('units', ['id' => $unit->id]);
    }
}
```

### 3. Permission Tests
```php
// tests/Feature/UnitPermissionTest.php
class UnitPermissionTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_permission_matrix()
    {
        $actions = [
            'index' => 'view_any_unit',
            'show' => 'view_unit',
            'create' => 'create_unit',
            'store' => 'create_unit',
            'edit' => 'update_unit',
            'update' => 'update_unit',
            'destroy' => 'delete_unit'
        ];
        
        foreach ($actions as $action => $permission) {
            $user = User::factory()->create();
            $unit = Unit::factory()->create();
            
            // Test without permission
            $response = $this->actingAs($user)
                ->get(route("admin.units.{$action}", $unit));
            $response->assertForbidden();
            
            // Test with permission
            $user->givePermissionTo($permission);
            $response = $this->actingAs($user)
                ->get(route("admin.units.{$action}", $unit));
            $response->assertOk();
        }
    }
}
```

---

## ⚡ Performance Optimization

### 1. Database Optimization
```sql
-- Essential indexes for performance
CREATE INDEX idx_units_name ON units(name);
CREATE INDEX idx_units_code ON units(code);
CREATE INDEX idx_units_active ON units(is_active);
CREATE INDEX idx_units_deleted_at ON units(deleted_at);

-- Composite indexes for common queries
CREATE INDEX idx_units_active_name ON units(is_active, name);
CREATE INDEX idx_units_active_created ON units(is_active, created_at DESC);
```

### 2. Query Optimization
```php
// Efficient pagination with counting
public function getUnitsWithCounts()
{
    return Unit::select(['id', 'name', 'code', 'symbol', 'is_active'])
        ->withCount([
            'products',
            'products as active_products_count' => function ($query) {
                $query->where('is_active', true);
            }
        ])
        ->paginate(15);
}

// Prevent N+1 queries
public function getUnitsWithRelations()
{
    return Unit::with([
        'products:id,unit_id,name',
        'createdBy:id,name',
        'updatedBy:id,name'
    ])->get();
}
```

### 3. Caching Strategy
```php
// Cache configuration
public function getCacheConfig(): array
{
    return [
        'unit_statistics' => ['ttl' => 300, 'tags' => ['units']],
        'unit_options' => ['ttl' => 3600, 'tags' => ['units']],
        'unit_dependencies' => ['ttl' => 600, 'tags' => ['units', 'products']],
    ];
}

// Smart cache invalidation
public function clearUnitCache(): void
{
    Cache::tags(['units'])->flush();
}

// Cached statistics
public function getUnitStatistics(): array
{
    return Cache::remember('unit_statistics', 300, function () {
        return [
            'total' => Unit::count(),
            'active' => Unit::where('is_active', true)->count(),
            'with_products' => Unit::has('products')->count(),
            'average_products_per_unit' => Unit::withCount('products')
                ->avg('products_count'),
        ];
    });
}
```

---

## 🚀 Deployment Procedures

### Pre-deployment Checklist
- [ ] **Code Quality**: Run `php artisan insights` and fix all issues
- [ ] **Testing**: All tests pass (`php artisan test --coverage`)
- [ ] **Security**: Security scan completed
- [ ] **Performance**: Query analysis completed
- [ ] **Documentation**: All changes documented

### Deployment Steps
1. **Backup Database**: Create backup before deployment
2. **Deploy Code**: Push code to production
3. **Run Migrations**: `php artisan migrate --force`
4. **Seed Permissions**: `php artisan db:seed --class=PermissionSeeder`
5. **Clear Cache**: `php artisan cache:clear && php artisan config:clear`
6. **Verify Operations**: Test all CRUD operations
7. **Monitor Logs**: Watch for errors in first 24 hours

### Post-deployment Validation
```bash
# Test all endpoints
curl -X GET "https://app.com/admin/units" -H "Authorization: Bearer {token}"
curl -X POST "https://app.com/admin/units" -H "Content-Type: application/json" -d '{"name":"Test","code":"TEST","symbol":"t"}'

# Check database
php artisan tinker
>>> Unit::count()
>>> Permission::where('name', 'LIKE', '%unit%')->count()

# Verify permissions
>>> User::find(1)->can('view_any_unit')
```

---

## 📊 Monitoring & Maintenance

### Key Performance Indicators (KPIs)
1. **Response Time**: < 200ms for index, < 100ms for show
2. **Error Rate**: < 0.1% for all operations
3. **Cache Hit Ratio**: > 90% for statistics
4. **Database Query Time**: < 50ms average
5. **Memory Usage**: < 50MB per request

### Monitoring Setup
```php
// Custom monitoring middleware
class UnitPerformanceMonitor
{
    public function handle($request, Closure $next)
    {
        $start = microtime(true);
        $response = $next($request);
        $duration = microtime(true) - $start;
        
        if ($duration > 0.2) { // Log slow requests
            Log::warning('Slow unit operation', [
                'url' => $request->url(),
                'method' => $request->method(),
                'duration' => $duration,
                'user_id' => Auth::id()
            ]);
        }
        
        return $response;
    }
}
```

### Maintenance Tasks
```php
// Artisan command: app/Console/Commands/MaintainUnits.php
class MaintainUnitsCommand extends Command
{
    protected $signature = 'units:maintain {--archive} {--cleanup}';
    
    public function handle()
    {
        if ($this->option('archive')) {
            $this->archiveOldDeletedUnits();
        }
        
        if ($this->option('cleanup')) {
            $this->cleanupOrphanedData();
        }
        
        $this->optimizeDatabase();
        $this->generateHealthReport();
    }
    
    private function archiveOldDeletedUnits()
    {
        $count = Unit::onlyTrashed()
            ->where('deleted_at', '<', now()->subDays(90))
            ->forceDelete();
            
        $this->info("Archived {$count} old deleted units");
    }
    
    private function cleanupOrphanedData()
    {
        // Clean up orphaned activity logs
        // Clean up old cache entries
        // Verify data integrity
    }
    
    private function optimizeDatabase()
    {
        DB::statement('OPTIMIZE TABLE units');
        $this->info('Database optimized');
    }
}
```

### Health Check Endpoint
```php
// For monitoring systems
public function healthCheck(): JsonResponse
{
    try {
        $health = [
            'status' => 'healthy',
            'timestamp' => now()->toISOString(),
            'database' => $this->checkDatabase(),
            'cache' => $this->checkCache(),
            'permissions' => $this->checkPermissions(),
            'statistics' => $this->getBasicStats(),
        ];
        
        return response()->json($health);
        
    } catch (\Exception $e) {
        return response()->json([
            'status' => 'unhealthy',
            'error' => $e->getMessage()
        ], 500);
    }
}

private function checkDatabase(): array
{
    return [
        'connected' => DB::connection()->getPdo() !== null,
        'unit_count' => Unit::count(),
        'last_created' => Unit::latest()->first()?->created_at,
    ];
}
```

---

## 📚 Code Review Checklist

### Security Review
- [ ] All routes protected by appropriate middleware
- [ ] Input validation covers all edge cases
- [ ] SQL injection prevention verified
- [ ] XSS protection in place
- [ ] Permission checks implemented correctly

### Performance Review
- [ ] Database queries optimized
- [ ] N+1 query problems avoided
- [ ] Appropriate caching implemented
- [ ] Memory usage within limits
- [ ] Response times acceptable

### Code Quality Review
- [ ] Follows PSR-12 coding standards
- [ ] Proper error handling throughout
- [ ] Comprehensive logging implemented
- [ ] Unit and feature tests comprehensive
- [ ] Documentation up to date

### Business Logic Review
- [ ] All business rules properly implemented
- [ ] Edge cases handled correctly
- [ ] Data integrity maintained
- [ ] Audit trail complete
- [ ] User experience optimized

---

## 📖 Additional Resources

### Laravel Documentation
- [Authorization](https://laravel.com/docs/authorization)
- [Validation](https://laravel.com/docs/validation)
- [Database](https://laravel.com/docs/database)
- [Testing](https://laravel.com/docs/testing)

### Third-party Packages
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- [Laravel Activity Log](https://spatie.be/docs/laravel-activitylog)
- [Inertia.js](https://inertiajs.com/)

### Best Practices
- [Laravel Best Practices](https://github.com/alexeymezenin/laravel-best-practices)
- [PHP The Right Way](https://phptherightway.com/)
- [Clean Code PHP](https://github.com/jupeter/clean-code-php)

---

## 🔄 Continuous Improvement

### Monthly Review Process
1. **Performance Analysis**: Review response times and query performance
2. **Security Audit**: Check for new vulnerabilities
3. **Code Quality**: Review and refactor complex methods
4. **Test Coverage**: Ensure comprehensive test coverage
5. **Documentation**: Update procedures and documentation

### Feedback Loop
- Monitor user feedback on unit management features
- Track error reports and fix root causes
- Gather performance metrics and optimize bottlenecks
- Review and update business rules as needed

---

*Document Version: 2.0*
*Last Updated: January 2024*
*Next Review: February 2024*

*This guide should be reviewed monthly and updated whenever significant changes are made to the UnitController or related systems.*
