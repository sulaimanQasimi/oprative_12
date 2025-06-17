# UnitController Operations - Senior Developer Procedure Guide

## 🎯 Overview & Architecture

### System Architecture
The UnitController implements a comprehensive CRUD system for measurement units with:
- **Permission-based access control** (Spatie Laravel Permission)
- **Soft deletion** capabilities with restore functionality
- **Inertia.js + React** frontend integration
- **Database transactions** for data integrity
- **Activity logging** for audit trails

### Core Design Patterns
- **MVC Pattern**: Clear separation of concerns
- **Policy Pattern**: Authorization through UnitPolicy
- **Repository Pattern**: (Recommended enhancement)
- **Service Layer**: (For complex business logic)

---

## 🔐 Security Implementation

### 1. Permission System
```php
// Middleware protection in constructor
$this->middleware('can:view_any_unit')->only(['index']);
$this->middleware('can:view_unit,unit')->only(['show']);
$this->middleware('can:create_unit')->only(['create', 'store']);
$this->middleware('can:update_unit,unit')->only(['edit', 'update']);
$this->middleware('can:delete_unit,unit')->only(['destroy']);
$this->middleware('can:restore_unit,unit')->only(['restore']);
$this->middleware('can:force_delete_unit,unit')->only(['forceDelete']);
```

### 2. Input Validation
```php
// Enhanced validation rules method
protected function getValidationRules(Unit $unit = null): array
{
    return [
        'name' => [
            'required',
            'string',
            'max:255',
            'min:2',
            'regex:/^[a-zA-Z\s\-\_\.]+$/' // Only letters, spaces, hyphens, underscores, dots
        ],
        'code' => [
            'required',
            'string',
            'max:10',
            'min:1',
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

## 📋 CRUD Operations - Enhanced Implementation

### 1. INDEX - Advanced Listing
```php
public function index(Request $request)
{
    try {
        // Build query with advanced filtering
        $query = Unit::query();
        
        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('symbol', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }
        
        // Status filtering
        if ($request->filled('status')) {
            match($request->status) {
                'active' => $query->where('is_active', true),
                'inactive' => $query->where('is_active', false),
                'deleted' => $query->onlyTrashed(),
                'all' => $query->withTrashed(),
                default => null
            };
        }
        
        // Date range filtering
        if ($request->filled(['date_from', 'date_to'])) {
            $query->whereBetween('created_at', [
                $request->date_from,
                $request->date_to
            ]);
        }
        
        // Sorting with validation
        $allowedSorts = ['name', 'code', 'symbol', 'created_at', 'updated_at'];
        $sortBy = in_array($request->sort_by, $allowedSorts) ? $request->sort_by : 'name';
        $sortDirection = in_array($request->sort_direction, ['asc', 'desc']) ? $request->sort_direction : 'asc';
        
        $query->orderBy($sortBy, $sortDirection);
        
        // Pagination with per-page validation
        $perPage = min(max((int) $request->get('per_page', 15), 5), 100);
        $units = $query->paginate($perPage)->withQueryString();
        
        // Get statistics
        $stats = $this->getUnitStatistics();
        
        // Permission checks
        $permissions = $this->getUserPermissions();
        
        return Inertia::render('Admin/Unit/Index', [
            'units' => $units,
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'status', 'sort_by', 'sort_direction', 'date_from', 'date_to']),
            'stats' => $stats,
        ]);
        
    } catch (\Exception $e) {
        Log::error('Unit index error', [
            'error' => $e->getMessage(),
            'user_id' => Auth::id(),
            'request_data' => $request->all()
        ]);
        
        return back()->withErrors(['error' => 'Failed to load units. Please try again.']);
    }
}

private function getUnitStatistics(): array
{
    return Cache::remember('unit_statistics', 300, function () {
        return [
            'total_units' => Unit::count(),
            'active_units' => Unit::where('is_active', true)->count(),
            'inactive_units' => Unit::where('is_active', false)->count(),
            'deleted_units' => Unit::onlyTrashed()->count(),
            'units_with_products' => Unit::has('products')->count(),
            'most_used_unit' => Unit::withCount('products')
                ->orderBy('products_count', 'desc')
                ->first(['name', 'products_count']),
        ];
    });
}
```

### 2. STORE - Advanced Creation
```php
public function store(Request $request)
{
    // Validate input
    $validated = $request->validate($this->getValidationRules());
    
    DB::beginTransaction();
    
    try {
        // Additional business logic validation
        $this->validateBusinessRules($validated);
        
        // Normalize data
        $validated['code'] = strtoupper($validated['code']);
        $validated['name'] = ucwords(strtolower($validated['name']));
        $validated['is_active'] = $validated['is_active'] ?? true;
        
        // Create unit
        $unit = Unit::create($validated);
        
        // Log activity
        activity('unit')
            ->performedOn($unit)
            ->causedBy(Auth::user())
            ->withProperties($validated)
            ->log('Unit created');
        
        // Clear cache
        Cache::forget('unit_statistics');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', "Unit '{$unit->name}' created successfully.")
            ->with('created_unit_id', $unit->id);
            
    } catch (ValidationException $e) {
        DB::rollback();
        return back()
            ->withInput()
            ->withErrors($e->errors());
            
    } catch (\Exception $e) {
        DB::rollback();
        
        Log::error('Unit creation failed', [
            'error' => $e->getMessage(),
            'user_id' => Auth::id(),
            'input_data' => $validated ?? $request->all()
        ]);
        
        return back()
            ->withInput()
            ->withErrors(['error' => 'Failed to create unit. Please check your input and try again.']);
    }
}

private function validateBusinessRules(array $data): void
{
    // Check for similar names (avoid duplicates)
    $similarUnits = Unit::where('name', 'like', "%{$data['name']}%")
        ->orWhere('symbol', $data['symbol'])
        ->exists();
        
    if ($similarUnits) {
        throw ValidationException::withMessages([
            'name' => 'A similar unit name or symbol already exists.'
        ]);
    }
    
    // Validate symbol format (if specific rules needed)
    if (isset($data['symbol']) && !preg_match('/^[a-zA-Z0-9\/\²\³°]+$/', $data['symbol'])) {
        throw ValidationException::withMessages([
            'symbol' => 'Symbol contains invalid characters.'
        ]);
    }
}
```

### 3. SHOW - Detailed View
```php
public function show(Unit $unit)
{
    try {
        // Load relationships efficiently
        $unit->load([
            'products:id,name,unit_id,price,stock_quantity',
            'wholesaleProducts:id,name,wholesale_unit_id',
            'retailProducts:id,name,retail_unit_id'
        ]);
        
        // Get usage analytics
        $analytics = [
            'total_products' => $unit->products()->count(),
            'active_products' => $unit->products()->where('is_active', true)->count(),
            'total_inventory_value' => $unit->products()->sum(DB::raw('price * stock_quantity')),
            'avg_product_price' => $unit->products()->avg('price'),
            'low_stock_products' => $unit->products()
                ->where('stock_quantity', '<=', DB::raw('min_stock_level'))
                ->count(),
        ];
        
        // Get recent activity
        $recentActivity = activity()
            ->forSubject($unit)
            ->with('causer')
            ->latest()
            ->limit(10)
            ->get();
        
        // Permission checks
        $permissions = $this->getUserPermissions($unit);
        
        return Inertia::render('Admin/Unit/Show', [
            'unit' => $unit,
            'analytics' => $analytics,
            'recent_activity' => $recentActivity,
            'permissions' => $permissions,
        ]);
        
    } catch (ModelNotFoundException $e) {
        return Redirect::route('admin.units.index')
            ->withErrors(['error' => 'Unit not found.']);
            
    } catch (\Exception $e) {
        Log::error('Unit show error', [
            'unit_id' => $unit->id,
            'error' => $e->getMessage(),
            'user_id' => Auth::id()
        ]);
        
        return Redirect::route('admin.units.index')
            ->withErrors(['error' => 'Failed to load unit details.']);
    }
}
```

### 4. UPDATE - Advanced Modification
```php
public function update(Request $request, Unit $unit)
{
    // Validate input
    $validated = $request->validate($this->getValidationRules($unit));
    
    DB::beginTransaction();
    
    try {
        // Store original data for comparison
        $originalData = $unit->toArray();
        
        // Additional validation for updates
        $this->validateUpdateBusinessRules($validated, $unit);
        
        // Normalize data
        $validated['code'] = strtoupper($validated['code']);
        $validated['name'] = ucwords(strtolower($validated['name']));
        
        // Check if unit is being deactivated and has active products
        if (isset($validated['is_active']) && 
            !$validated['is_active'] && 
            $unit->products()->where('is_active', true)->exists()) {
            
            return back()->withErrors([
                'is_active' => 'Cannot deactivate unit that has active products.'
            ]);
        }
        
        // Update unit
        $unit->update($validated);
        
        // Log changes
        $changes = array_diff_assoc($validated, $originalData);
        if (!empty($changes)) {
            activity('unit')
                ->performedOn($unit)
                ->causedBy(Auth::user())
                ->withProperties([
                    'old' => Arr::only($originalData, array_keys($changes)),
                    'new' => $changes
                ])
                ->log('Unit updated');
        }
        
        // Clear cache
        Cache::forget('unit_statistics');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', "Unit '{$unit->name}' updated successfully.");
            
    } catch (ValidationException $e) {
        DB::rollback();
        return back()
            ->withInput()
            ->withErrors($e->errors());
            
    } catch (\Exception $e) {
        DB::rollback();
        
        Log::error('Unit update failed', [
            'unit_id' => $unit->id,
            'error' => $e->getMessage(),
            'user_id' => Auth::id(),
            'input_data' => $validated ?? $request->all()
        ]);
        
        return back()
            ->withInput()
            ->withErrors(['error' => 'Failed to update unit.']);
    }
}

private function validateUpdateBusinessRules(array $data, Unit $unit): void
{
    // Check if code change affects existing products
    if (isset($data['code']) && $data['code'] !== $unit->code) {
        $productCount = $unit->products()->count();
        if ($productCount > 0) {
            Log::warning('Unit code changed with existing products', [
                'unit_id' => $unit->id,
                'old_code' => $unit->code,
                'new_code' => $data['code'],
                'product_count' => $productCount
            ]);
        }
    }
}
```

### 5. DESTROY - Safe Deletion
```php
public function destroy(Unit $unit)
{
    DB::beginTransaction();
    
    try {
        // Check for dependencies
        $dependencies = $this->checkUnitDependencies($unit);
        
        if (!empty($dependencies)) {
            return back()->withErrors([
                'error' => 'Cannot delete unit. It is currently used by: ' . 
                          implode(', ', $dependencies)
            ]);
        }
        
        // Store data for logging before deletion
        $unitData = $unit->toArray();
        
        // Soft delete
        $unit->delete();
        
        // Log activity
        activity('unit')
            ->performedOn($unit)
            ->causedBy(Auth::user())
            ->withProperties($unitData)
            ->log('Unit deleted (soft)');
        
        // Clear cache
        Cache::forget('unit_statistics');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', "Unit '{$unit->name}' deleted successfully. You can restore it if needed.");
            
    } catch (\Exception $e) {
        DB::rollback();
        
        Log::error('Unit deletion failed', [
            'unit_id' => $unit->id,
            'error' => $e->getMessage(),
            'user_id' => Auth::id()
        ]);
        
        return back()->withErrors(['error' => 'Failed to delete unit.']);
    }
}

private function checkUnitDependencies(Unit $unit): array
{
    $dependencies = [];
    
    // Check products
    $productCount = $unit->products()->count();
    if ($productCount > 0) {
        $dependencies[] = "{$productCount} products";
    }
    
    // Check wholesale products
    $wholesaleCount = $unit->wholesaleProducts()->count();
    if ($wholesaleCount > 0) {
        $dependencies[] = "{$wholesaleCount} wholesale products";
    }
    
    // Check retail products
    $retailCount = $unit->retailProducts()->count();
    if ($retailCount > 0) {
        $dependencies[] = "{$retailCount} retail products";
    }
    
    return $dependencies;
}
```

### 6. RESTORE & FORCE DELETE
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
        
        Cache::forget('unit_statistics');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', "Unit '{$unit->name}' restored successfully.");
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit restoration failed', ['unit_id' => $unit->id, 'error' => $e->getMessage()]);
        return back()->withErrors(['error' => 'Failed to restore unit.']);
    }
}

public function forceDelete(Unit $unit)
{
    DB::beginTransaction();
    
    try {
        // Final dependency check
        if ($this->checkUnitDependencies($unit)) {
            return back()->withErrors(['error' => 'Cannot permanently delete unit with dependencies.']);
        }
        
        $unitData = $unit->toArray();
        $unit->forceDelete();
        
        activity('unit')
            ->causedBy(Auth::user())
            ->withProperties($unitData)
            ->log('Unit permanently deleted');
        
        Cache::forget('unit_statistics');
        
        DB::commit();
        
        return Redirect::route('admin.units.index')
            ->with('success', 'Unit permanently deleted.');
            
    } catch (\Exception $e) {
        DB::rollback();
        Log::error('Unit force deletion failed', ['unit_id' => $unit->id, 'error' => $e->getMessage()]);
        return back()->withErrors(['error' => 'Failed to permanently delete unit.']);
    }
}
```

---

## 🔧 Helper Methods

```php
private function getUserPermissions(Unit $unit = null): array
{
    return [
        'can_create' => Gate::allows('create_unit'),
        'can_view' => $unit ? Gate::allows('view_unit', $unit) : Gate::allows('view_unit', Unit::class),
        'can_update' => $unit ? Gate::allows('update_unit', $unit) : Gate::allows('update_unit', Unit::class),
        'can_delete' => $unit ? Gate::allows('delete_unit', $unit) : Gate::allows('delete_unit', Unit::class),
        'can_restore' => $unit ? Gate::allows('restore_unit', $unit) : Gate::allows('restore_unit', Unit::class),
        'can_force_delete' => $unit ? Gate::allows('force_delete_unit', $unit) : Gate::allows('force_delete_unit', Unit::class),
    ];
}
```

---

## 🧪 Testing Strategy

### Unit Tests
```php
// tests/Unit/UnitTest.php
class UnitTest extends TestCase
{
    use RefreshDatabase;
    
    public function test_unit_creation_with_valid_data()
    {
        $unitData = [
            'name' => 'Kilogram',
            'code' => 'KG',
            'symbol' => 'kg',
            'description' => 'Unit of mass'
        ];
        
        $unit = Unit::create($unitData);
        
        $this->assertDatabaseHas('units', $unitData);
        $this->assertEquals('KG', $unit->code);
        $this->assertTrue($unit->is_active);
    }
    
    public function test_unit_code_must_be_unique()
    {
        Unit::factory()->create(['code' => 'KG']);
        
        $this->expectException(QueryException::class);
        Unit::factory()->create(['code' => 'KG']);
    }
    
    public function test_unit_soft_deletion()
    {
        $unit = Unit::factory()->create();
        $unit->delete();
        
        $this->assertSoftDeleted('units', ['id' => $unit->id]);
        $this->assertNotNull($unit->fresh()->deleted_at);
    }
}
```

### Feature Tests
```php
// tests/Feature/UnitControllerTest.php
class UnitControllerTest extends TestCase
{
    use RefreshDatabase;
    
    protected User $user;
    
    protected function setUp(): void
    {
        parent::setUp();
        $this->user = User::factory()->create();
    }
    
    public function test_authorized_user_can_view_units_index()
    {
        $this->user->givePermissionTo('view_any_unit');
        
        $response = $this->actingAs($this->user)
            ->get(route('admin.units.index'));
            
        $response->assertStatus(200);
        $response->assertInertia(fn (Assert $page) => 
            $page->component('Admin/Unit/Index')
                 ->has('units')
                 ->has('permissions')
        );
    }
    
    public function test_unauthorized_user_cannot_create_unit()
    {
        $response = $this->actingAs($this->user)
            ->post(route('admin.units.store'), [
                'name' => 'Test Unit',
                'code' => 'TU',
                'symbol' => 'tu'
            ]);
            
        $response->assertStatus(403);
    }
    
    public function test_unit_creation_with_valid_permissions()
    {
        $this->user->givePermissionTo('create_unit');
        
        $unitData = [
            'name' => 'Meter',
            'code' => 'M',
            'symbol' => 'm',
            'description' => 'Unit of length'
        ];
        
        $response = $this->actingAs($this->user)
            ->post(route('admin.units.store'), $unitData);
            
        $response->assertRedirect(route('admin.units.index'));
        $response->assertSessionHas('success');
        $this->assertDatabaseHas('units', $unitData);
    }
    
    public function test_unit_validation_rules()
    {
        $this->user->givePermissionTo('create_unit');
        
        $response = $this->actingAs($this->user)
            ->post(route('admin.units.store'), [
                'name' => '', // Required field
                'code' => 'TOOLONGCODE', // Max 10 characters
                'symbol' => '' // Required field
            ]);
            
        $response->assertSessionHasErrors(['name', 'code', 'symbol']);
    }
}
```

---

## 📊 Performance Optimization

### Database Indexing
```sql
-- Migration: add_indexes_to_units_table
CREATE INDEX idx_units_name ON units(name);
CREATE INDEX idx_units_code ON units(code);
CREATE INDEX idx_units_active ON units(is_active);
CREATE INDEX idx_units_deleted_at ON units(deleted_at);
CREATE INDEX idx_units_created_at ON units(created_at);

-- Composite indexes for common queries
CREATE INDEX idx_units_active_name ON units(is_active, name);
CREATE INDEX idx_units_active_created ON units(is_active, created_at);
```

### Query Optimization
```php
// Efficient queries with proper indexing
public function getActiveUnitsForSelect()
{
    return Unit::where('is_active', true)
        ->orderBy('name')
        ->pluck('name', 'id');
}

// Avoid N+1 queries
public function getUnitsWithProductCounts()
{
    return Unit::withCount(['products', 'products as active_products_count' => function ($query) {
        $query->where('is_active', true);
    }])->get();
}
```

### Caching Strategy
```php
// Cache frequently accessed data
public function getCachedUnitOptions()
{
    return Cache::remember('unit_options', 3600, function () {
        return Unit::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'symbol'])
            ->map(function ($unit) {
                return [
                    'value' => $unit->id,
                    'label' => "{$unit->name} ({$unit->symbol})"
                ];
            });
    });
}
```

---

## 🚀 Deployment Checklist

### Pre-deployment
- [ ] Run all tests (`php artisan test`)
- [ ] Check code quality (`php artisan insights`)
- [ ] Verify database migrations
- [ ] Update API documentation
- [ ] Test permission system
- [ ] Verify caching configuration

### Post-deployment
- [ ] Run migrations
- [ ] Seed permissions if needed
- [ ] Clear application cache
- [ ] Verify logging is working
- [ ] Test all CRUD operations
- [ ] Monitor error logs

---

## 🔍 Monitoring & Maintenance

### Key Metrics to Monitor
1. **Response times** for unit operations
2. **Error rates** by operation type
3. **Cache hit ratios** for unit data
4. **Database query performance**
5. **Permission check latency**

### Regular Maintenance Tasks
```php
// Artisan command: CleanupUnitsCommand
class CleanupUnitsCommand extends Command
{
    public function handle()
    {
        // Archive old deleted units
        $archivedCount = Unit::onlyTrashed()
            ->where('deleted_at', '<', now()->subDays(90))
            ->forceDelete();
            
        // Clear old cache entries
        Cache::forget('unit_statistics');
        Cache::forget('unit_options');
        
        $this->info("Archived {$archivedCount} old deleted units");
    }
}
```

---

## 📚 Additional Resources

### Related Documentation
- [Laravel Authorization](https://laravel.com/docs/authorization)
- [Spatie Laravel Permission](https://spatie.be/docs/laravel-permission)
- [Inertia.js Guide](https://inertiajs.com/)
- [Laravel Testing](https://laravel.com/docs/testing)

### Code Review Checklist
- [ ] Permission middleware correctly applied
- [ ] Input validation comprehensive
- [ ] Database transactions used appropriately
- [ ] Error handling and logging implemented
- [ ] Frontend permissions properly checked
- [ ] Tests cover all scenarios
- [ ] Performance considerations addressed
- [ ] Security best practices followed

---

*Last updated: January 2024*
*Review frequency: Monthly or after major changes* 
