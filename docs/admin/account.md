# Account Model Documentation

## 1. Overview

### Purpose and Role
The `Account` model serves as the core financial management entity in the Laravel-based admin panel system. It represents customer financial accounts that handle income and outcome transactions, providing comprehensive tracking of financial flows between the business and its customers.

### Common Use Cases
- **Customer Account Management**: Track individual customer financial accounts with unique identifiers
- **Financial Transaction Recording**: Monitor income (repayments) and outcome (loans) transactions
- **Balance Calculation**: Automatically calculate net balances, pending amounts, and financial summaries
- **Financial Reporting**: Generate monthly, yearly, and custom period financial reports
- **Account Status Management**: Handle account lifecycle with pending, active, suspended, and closed states
- **Multi-User Access**: Support both admin panel management and customer portal access

## 2. Model Definition

### Table Structure and Columns

The `accounts` table contains the following structure:

```sql
CREATE TABLE accounts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    customer_id BIGINT NOT NULL,
    name VARCHAR(255) NULL,
    id_number VARCHAR(255) NULL,
    account_number VARCHAR(255) NULL,
    approved_by VARCHAR(255) NULL,
    address VARCHAR(255) NULL,
    status ENUM('pending', 'active', 'suspended', 'closed') DEFAULT 'pending',
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL,
    
    FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
);
```

### Model Properties

```php
class Account extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'id_number',
        'account_number',
        'customer_id',
        'approved_by',
        'address',
        'status'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];
}
```

### Relationships

#### BelongsTo Relationships
```php
// Account belongs to a Customer
public function customer()
{
    return $this->belongsTo(Customer::class);
}
```

#### HasMany Relationships
```php
// Account has many income transactions
public function incomes()
{
    return $this->hasMany(AccountIncome::class);
}

// Account has many outcome transactions
public function outcomes()
{
    return $this->hasMany(AccountOutcome::class);
}
```

#### Filtered Relationships
```php
// Status-based income relationships
public function approvedIncomes()
{
    return $this->incomes()->where('status', 'approved');
}

public function pendingIncomes()
{
    return $this->incomes()->where('status', 'pending');
}

public function rejectedIncomes()
{
    return $this->incomes()->where('status', 'rejected');
}

// Status-based outcome relationships
public function approvedOutcomes()
{
    return $this->outcomes()->where('status', 'approved');
}

public function pendingOutcomes()
{
    return $this->outcomes()->where('status', 'pending');
}

public function rejectedOutcomes()
{
    return $this->outcomes()->where('status', 'rejected');
}
```

### Traits Used
- **SoftDeletes**: Enables soft deletion of accounts, allowing recovery of deleted records
- The model does not use HasFactory or HasUuids traits

### Computed Attributes

#### Financial Summary Attributes
```php
// Total approved income
public function getTotalIncomeAttribute()
{
    return $this->approvedIncomes()->sum('amount');
}

// Total approved outcome
public function getTotalOutcomeAttribute()
{
    return $this->approvedOutcomes()->sum('amount');
}

// Net balance calculation
public function getNetBalanceAttribute()
{
    return $this->total_income - $this->total_outcome;
}

// Pending amounts
public function getPendingIncomeAttribute()
{
    return $this->pendingIncomes()->sum('amount');
}

public function getPendingOutcomeAttribute()
{
    return $this->pendingOutcomes()->sum('amount');
}
```

#### Time-Based Attributes
```php
// Monthly financial data
public function getMonthlyIncomeAttribute()
{
    return $this->approvedIncomes()
        ->whereMonth('date', now()->month)
        ->whereYear('date', now()->year)
        ->sum('amount');
}

public function getMonthlyOutcomeAttribute()
{
    return $this->approvedOutcomes()
        ->whereMonth('date', now()->month)
        ->whereYear('date', now()->year)
        ->sum('amount');
}

// Yearly financial data
public function getYearlyIncomeAttribute()
{
    return $this->approvedIncomes()
        ->whereYear('date', now()->year)
        ->sum('amount');
}

public function getYearlyOutcomeAttribute()
{
    return $this->approvedOutcomes()
        ->whereYear('date', now()->year)
        ->sum('amount');
}

// Monthly breakdown arrays
public function getIncomeByMonthAttribute()
{
    return $this->approvedIncomes()
        ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
        ->whereYear('date', now()->year)
        ->groupBy('month')
        ->get()
        ->pluck('total', 'month')
        ->toArray();
}

public function getOutcomeByMonthAttribute()
{
    return $this->approvedOutcomes()
        ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
        ->whereYear('date', now()->year)
        ->groupBy('month')
        ->get()
        ->pluck('total', 'month')
        ->toArray();
}
```

## 3. Permissions

### Admin Panel Permissions
The account system uses Spatie Laravel Permission package with the following permissions:

#### Core Account Permissions
```php
// Permission naming convention: {action}_{model}
'view_any_account',    // View list of accounts and access index
'view_account',        // View individual account details
'create_account',      // Create new accounts
'update_account',      // Edit and update account information
'delete_account',      // Soft delete accounts
'restore_account',     // Restore soft-deleted accounts
'force_delete_account' // Permanently delete accounts
```

#### Customer Portal Permissions
```php
// Customer-specific permissions with 'customer.' prefix
'customer.view_accounts',    // View customer's own accounts
'customer.manage_accounts',  // Manage account transactions
'customer.view_incomes',     // View income transactions
'customer.manage_incomes'    // Manage income transactions
```

### Permission Seeding Example

```php
// In PermissionSeeder.php
$models = ['account']; // Among other models
$actions = [
    'view' => 'مشاهده',
    'view_any' => 'مشاهده همه', 
    'create' => 'ایجاد',
    'update' => 'ویرایش',
    'delete' => 'حذف',
    'restore' => 'بازیابی',
    'force_delete' => 'حذف کامل',
];

foreach ($models as $model) {
    foreach ($actions as $action => $actionLabel) {
        Permission::firstOrCreate([
            'name' => "{$action}_{$model}",
            'guard_name' => 'web',
        ], [
            'label' => "{$actionLabel} حساب",
        ]);
    }
}

// Customer permissions
$customerPermissions = [
    'customer.view_accounts',
    'customer.manage_accounts',
    'customer.view_incomes',
    'customer.manage_incomes',
];

foreach ($customerPermissions as $permission) {
    Permission::create([
        'name' => $permission, 
        'guard_name' => 'customer_user'
    ]);
}
```

## 4. Controllers

### Admin Controllers

#### AccountController
**Location**: `app/Http/Controllers/Admin/AccountController.php`

**Key Methods**:
```php
class AccountController extends Controller
{
    // Middleware protection for all methods
    public function __construct()
    {
        $this->middleware('permission:view_any_account')->only(['index']);
        $this->middleware('permission:view_account')->only(['show']);
        $this->middleware('permission:create_account')->only(['create', 'store']);
        $this->middleware('permission:update_account')->only(['edit', 'update']);
        $this->middleware('permission:delete_account')->only(['destroy']);
        $this->middleware('permission:restore_account')->only(['restore']);
        $this->middleware('permission:force_delete_account')->only(['forceDelete']);
    }

    // Display paginated list with search and filtering
    public function index(Request $request);
    
    // Show create form
    public function create();
    
    // Store new account
    public function store(Request $request);
    
    // Show account details with transactions
    public function show(Request $request, Account $account);
    
    // Show edit form
    public function edit(Account $account);
    
    // Update account
    public function update(Request $request, Account $account);
    
    // Soft delete account
    public function destroy(Account $account);
    
    // Restore soft-deleted account
    public function restore($id);
    
    // Permanently delete account
    public function forceDelete($id);
}
```

#### Related Controllers
- **AccountIncomeController**: Manages income transactions for accounts
- **AccountOutcomeController**: Manages outcome transactions for accounts

### Customer Controllers

#### CustomerAccountsController
**Location**: `app/Http/Controllers/Customer/CustomerAccountsController.php`

**Key Methods**:
```php
class CustomerAccountsController extends Controller
{
    // List customer's accounts with search functionality
    public function index(Request $request);
    
    // Show create account request form
    public function create();
    
    // Store new account request (pending approval)
    public function store(Request $request);
    
    // Show individual account details
    public function show(Account $account);
    
    // Reset filters and return to index
    public function resetFilters();
}
```

#### AccountDetailsController
**Location**: `app/Http/Controllers/Customer/AccountDetailsController.php`

**Key Methods**:
```php
class AccountDetailsController extends Controller
{
    // Show account incomes and outcomes with filtering
    public function showIncomes(Account $account, Request $request);
    
    // Create income transaction
    public function createIncome(Request $request);
    
    // Create outcome transaction  
    public function createOutcome(Request $request);
    
    // Approve income transaction
    public function approveIncome(Request $request);
    
    // Approve outcome transaction
    public function approveOutcome(Request $request);
}
```

## 5. Routes

### Admin Routes
**File**: `routes/admin.php`

```php
// Account CRUD routes
Route::prefix('accounts')->group(function () {
    Route::get('/', [AccountController::class, 'index'])
        ->name('admin.accounts.index');
    Route::get('/create', [AccountController::class, 'create'])
        ->name('admin.accounts.create');
    Route::post('/', [AccountController::class, 'store'])
        ->name('admin.accounts.store');
    Route::get('/{account:id}', [AccountController::class, 'show'])
        ->name('admin.accounts.show');
    Route::get('/{account:id}/edit', [AccountController::class, 'edit'])
        ->name('admin.accounts.edit');
    Route::put('/{account:id}', [AccountController::class, 'update'])
        ->name('admin.accounts.update');
    Route::delete('/{account:id}', [AccountController::class, 'destroy'])
        ->name('admin.accounts.destroy');
    Route::post('/{id}/restore', [AccountController::class, 'restore'])
        ->name('admin.accounts.restore')->withTrashed();
    Route::delete('/{id}/force-delete', [AccountController::class, 'forceDelete'])
        ->name('admin.accounts.force-delete')->withTrashed();
});

// Account Income routes
Route::prefix('accounts/{account:id}/incomes')->name('admin.account.incomes.')->group(function () {
    Route::post('/', [AccountIncomeController::class, 'store'])->name('store');
    Route::get('/{income:id}', [AccountIncomeController::class, 'show'])->name('show');
    Route::put('/{income:id}', [AccountIncomeController::class, 'update'])->name('update');
    Route::delete('/{income:id}', [AccountIncomeController::class, 'destroy'])->name('destroy');
});

// Account Outcome routes
Route::prefix('accounts/{account:id}/outcomes')->name('admin.account.outcomes.')->group(function () {
    Route::post('/', [AccountOutcomeController::class, 'store'])->name('store');
    Route::get('/{outcome:id}', [AccountOutcomeController::class, 'show'])->name('show');
    Route::put('/{outcome:id}', [AccountOutcomeController::class, 'update'])->name('update');
    Route::delete('/{outcome:id}', [AccountOutcomeController::class, 'destroy'])->name('destroy');
});
```

### Customer Routes
**File**: `app/Repositories/Customer/Traits/RegisterRoutes.php`

```php
// Customer account management routes
Route::get('/accounts', [CustomerAccountsController::class, 'index'])
    ->middleware(PermissionMiddleware::class . ':customer.view_accounts')
    ->name('accounts.index');

Route::get('/accounts/create', [CustomerAccountsController::class, 'create'])
    ->middleware(PermissionMiddleware::class . ':customer.view_accounts')
    ->name('accounts.create');

Route::post('/accounts', [CustomerAccountsController::class, 'store'])
    ->middleware(PermissionMiddleware::class . ':customer.view_accounts')
    ->name('accounts.store');

Route::get('/accounts/reset-filters', [CustomerAccountsController::class, 'resetFilters'])
    ->middleware(PermissionMiddleware::class . ':customer.view_accounts')
    ->name('accounts.resetFilters');

// Account transaction routes
Route::get('/accounts/{account}/incomes', [AccountDetailsController::class, 'showIncomes'])
    ->middleware(PermissionMiddleware::class . ':customer.view_incomes')
    ->name('accounts.show');

Route::post('/accounts/{account}/incomes', [AccountDetailsController::class, 'createIncome'])
    ->middleware(PermissionMiddleware::class . ':customer.manage_accounts')
    ->name('accounts.incomes.store');

Route::post('/accounts/{account}/outcomes', [AccountDetailsController::class, 'createOutcome'])
    ->middleware(PermissionMiddleware::class . ':customer.manage_accounts')
    ->name('accounts.outcomes.store');

Route::post('/accounts/{account}/incomes/{income}/approve', [AccountDetailsController::class, 'approveIncome'])
    ->middleware(PermissionMiddleware::class . ':customer.manage_accounts')
    ->name('accounts.incomes.approve');

Route::post('/accounts/{account}/outcomes/{outcome}/approve', [AccountDetailsController::class, 'approveOutcome'])
    ->middleware(PermissionMiddleware::class . ':customer.manage_accounts')
    ->name('accounts.outcomes.approve');
```

## 6. Views

### Admin Panel Views (Inertia.js/React)
**Directory**: `resources/js/Pages/Admin/Account/`

#### View Files Structure
```
resources/js/Pages/Admin/Account/
├── Index.jsx          # Account listing with search/filter (777 lines)
├── Create.jsx         # Account creation form (561 lines)
├── Edit.jsx           # Account editing form (568 lines)
└── Show.jsx           # Account details with transactions (930 lines)
```

#### Key View Features

**Index.jsx**
- Paginated account listing with search functionality
- Advanced filtering by customer, status, and date ranges
- Bulk operations support
- Real-time search with debouncing
- Permission-based action buttons

**Create.jsx**
- Account creation form with validation
- Customer selection with search
- Auto-generation of account numbers
- Status selection
- Address and identification fields

**Edit.jsx**
- Account editing with pre-populated data
- Validation rules for unique constraints
- Status management
- Customer reassignment capabilities

**Show.jsx**
- Comprehensive account overview with financial summaries
- Tabbed interface for transactions (Overview, Incomes, Outcomes)
- Real-time balance calculations
- Transaction filtering and pagination
- Jalali calendar integration for Persian dates
- Interactive charts and financial metrics

### Customer Portal Views (Inertia.js/React)
**Directory**: `resources/js/Pages/Customer/Accounts/`

#### View Files Structure
```
resources/js/Pages/Customer/Accounts/
├── Index.jsx              # Customer account listing (690 lines)
├── Create.jsx             # Account request form (646 lines)
├── Show.jsx               # Account overview (189 lines)
├── AccountDetails.jsx     # Detailed account view (1096 lines)
├── Incomes.jsx           # Income management (527 lines)
└── Components/           # Reusable components
```

## 7. Links and Navigation

### Admin Panel Navigation
Add to admin sidebar navigation:

```php
// In Navigation component or admin layout
if (auth()->user()->can('view_any_account')) {
    // Accounts menu item
    echo '<a href="' . route('admin.accounts.index') . '" class="nav-link">
        <i class="fas fa-credit-card"></i>
        <span>' . __('Accounts') . '</span>
    </a>';
}
```

### Customer Portal Navigation
Customer navbar integration:

```php
// In customer navigation component
@can('customer.view_accounts')
    <a href="{{ route('customer.accounts.index') }}" class="nav-link">
        <i class="fas fa-wallet"></i>
        {{ __('My Accounts') }}
    </a>
@endcan
```

## 8. Validation Rules

### Account Creation/Update Rules

```php
// Account validation rules
$rules = [
    'name' => 'required|string|max:255',
    'id_number' => 'required|string|max:50|unique:accounts,id_number,' . $account?->id,
    'account_number' => 'required|string|max:50|unique:accounts,account_number,' . $account?->id,
    'customer_id' => 'required|exists:customers,id',
    'address' => 'nullable|string|max:500',
    'status' => 'required|in:pending,active,suspended,closed',
];

// Customer account request rules
$customerRules = [
    'name' => 'required|string|max:255',
    'id_number' => 'required|string|max:50|unique:accounts',
    'address' => 'required|string|max:500',
    // Status and account_number auto-generated
];
```

### Where Rules are Defined
- **Admin Controller**: Direct validation in `store()` and `update()` methods
- **Customer Controller**: Direct validation in `store()` method
- **Form Requests**: Can be extracted to dedicated FormRequest classes

## 9. APIs (if any)

Currently, the system does not expose dedicated API endpoints for account management. However, the customer portal uses internal API-like routes for:

### Customer Internal APIs
```php
// Account search for market orders
Route::get('market-order/search-accounts', [MarketOrderController::class, 'searchAccounts'])
    ->name('market-order.search-accounts');
```

### Authentication/Authorization for APIs
All routes use:
- **Spatie Permission Middleware**: For permission checking
- **Customer Authentication Guard**: For customer portal access
- **Web Authentication Guard**: For admin panel access

## 10. Examples

### Creating an Account Programmatically

```php
use App\Models\Account;
use App\Models\Customer;

// Create new account
$account = Account::create([
    'name' => 'John Doe Personal Account',
    'id_number' => 'ID123456789',
    'account_number' => 'ACC' . date('Y') . str_pad(1, 6, '0', STR_PAD_LEFT),
    'customer_id' => $customer->id,
    'address' => '123 Main Street, City',
    'status' => 'pending',
    'approved_by' => auth()->id(),
]);
```

### Checking Permissions in Controller

```php
// In controller method
public function show(Account $account)
{
    // Check permission
    if (!auth()->user()->can('view_account')) {
        abort(403, 'Unauthorized action.');
    }
    
    // For customer portal - ensure ownership
    if (auth('customer_user')->check()) {
        $customer = CustomerRepository::currentUserCustomer()->model;
        if ($account->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to account.');
        }
    }
    
    return inertia('Admin/Account/Show', [
        'account' => $account->load(['customer', 'incomes', 'outcomes']),
        'permissions' => [
            'view_account' => auth()->user()->can('view_account'),
            'update_account' => auth()->user()->can('update_account'),
            'delete_account' => auth()->user()->can('delete_account'),
        ]
    ]);
}
```

### Checking Permissions in Blade Views

```php
// In admin blade template
@can('create_account')
    <a href="{{ route('admin.accounts.create') }}" class="btn btn-primary">
        {{ __('Create Account') }}
    </a>
@endcan

@can('update_account')
    <a href="{{ route('admin.accounts.edit', $account) }}" class="btn btn-secondary">
        {{ __('Edit Account') }}
    </a>
@endcan

// In customer blade template
@can('customer.view_accounts')
    <div class="account-section">
        <!-- Account content -->
    </div>
@endcan
```

### Financial Calculations Usage

```php
// Get account with financial data
$account = Account::with(['incomes', 'outcomes'])->find(1);

// Access computed attributes
echo "Total Income: " . $account->total_income;
echo "Total Outcome: " . $account->total_outcome;
echo "Net Balance: " . $account->net_balance;
echo "Pending Income: " . $account->pending_income;
echo "Monthly Income: " . $account->monthly_income;

// Get monthly breakdown
$monthlyData = $account->income_by_month;
foreach ($monthlyData as $month => $amount) {
    echo "Month {$month}: {$amount}";
}
```

### Soft Delete Operations

```php
// Soft delete account
$account->delete(); // Sets deleted_at timestamp

// Restore account
$account->restore(); // Clears deleted_at timestamp

// Force delete (permanent)
$account->forceDelete(); // Removes from database

// Query including soft deleted
$accounts = Account::withTrashed()->get();

// Query only soft deleted
$deletedAccounts = Account::onlyTrashed()->get();
```

### Transaction Management

```php
// Add income to account
$account->incomes()->create([
    'amount' => 1000.00,
    'description' => 'Payment received',
    'status' => 'pending',
    'date' => now(),
]);

// Add outcome to account
$account->outcomes()->create([
    'amount' => 500.00,
    'description' => 'Loan disbursed',
    'status' => 'approved',
    'date' => now(),
]);

// Approve pending transactions
$account->pendingIncomes()->update(['status' => 'approved']);
```

## Best Practices

1. **Always check permissions** before performing account operations
2. **Use transactions** for financial operations to ensure data consistency
3. **Validate account ownership** in customer portal to prevent unauthorized access
4. **Implement proper error handling** for financial calculations
5. **Use soft deletes** to maintain audit trails
6. **Generate unique account numbers** using proper algorithms
7. **Log financial operations** for audit purposes
8. **Implement proper filtering and pagination** for large datasets
9. **Use computed attributes** for consistent financial calculations
10. **Follow Laravel conventions** for naming and structure

This documentation provides a comprehensive guide to the Account model implementation, covering all aspects from basic model definition to advanced usage patterns and best practices. 