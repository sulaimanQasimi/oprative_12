<?php

use App\Http\Controllers\Admin\AuthController;
use App\Http\Controllers\Admin\DashboardController;
use App\Http\Controllers\Admin\ProfileController;
use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\BioMetricController;
use App\Http\Controllers\Admin\AttendanceSettingController;
use App\Http\Controllers\Admin\GateController;
use App\Http\Controllers\Admin\AttendanceRequestController;
use App\Http\Controllers\Admin\WarehouseUserController;
use App\Http\Controllers\Admin\CustomerController;
use App\Http\Controllers\Admin\CustomerUserController;
use App\Http\Controllers\Admin\AccountController;
use App\Http\Controllers\Admin\AccountIncomeController;
use App\Http\Controllers\Admin\AccountOutcomeController;
use App\Http\Controllers\Admin\PurchaseController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\RoleController;
use App\Http\Controllers\Admin\PermissionController;
use App\Http\Controllers\Admin\SalesController;
use App\Http\Controllers\Admin\ActivityLogController;
use App\Http\Controllers\Admin\{IncomeController, OutcomeController, TransferController};
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application.
|
*/

// Admin Authentication Routes (Guest only)
Route::middleware('guest')->group(function () {
    Route::get('/login', [AuthController::class, 'showLoginForm'])->name('admin.login');
    Route::post('/login', [AuthController::class, 'login']);
});

// Redirect root admin path to dashboard if authenticated, otherwise to login
Route::get('/', function () {
    return Auth::check() ? redirect()->route('admin.dashboard') : redirect()->route('admin.login');
});

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('admin.dashboard');

    // Profile Management
    Route::prefix('profile')->name('admin.profile.')->group(function () {
        Route::get('/', [ProfileController::class, 'edit'])->name('edit');
        Route::patch('/', [ProfileController::class, 'update'])->name('update');
        Route::patch('/password', [ProfileController::class, 'updatePassword'])->name('password.update');
        Route::delete('/', [ProfileController::class, 'destroy'])->name('destroy');
    });

    // Authentication
    Route::post('/logout', [AuthController::class, 'logout'])->name('admin.logout');

    // User Management
    Route::prefix('users')->group(function () {
        Route::get('/', [UserController::class, 'index'])->name('admin.users.index');
        Route::get('/create', [UserController::class, 'create'])->name('admin.users.create');
        Route::post('/', [UserController::class, 'store'])->name('admin.users.store');
        Route::get('/import', [UserController::class, 'importForm'])->name('admin.users.import.form');
        Route::post('/import', [UserController::class, 'import'])->name('admin.users.import');
        Route::get('/export', [UserController::class, 'export'])->name('admin.users.export');
        Route::post('/stop-impersonating', [UserController::class, 'stopImpersonating'])->name('admin.users.stop-impersonating');
        Route::get('/{user:id}', [UserController::class, 'show'])->name('admin.users.show');
        Route::get('/{user:id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/{user:id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/{user:id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        Route::post('/{user:id}/restore', [UserController::class, 'restore'])->name('admin.users.restore')->withTrashed();
        Route::delete('/{user:id}/force-delete', [UserController::class, 'forceDelete'])->name('admin.users.force-delete')->withTrashed();
        Route::post('/{user:id}/assign-role', [UserController::class, 'assignRole'])->name('admin.users.assign-role');
        Route::delete('/{user:id}/remove-role/{role}', [UserController::class, 'removeRole'])->name('admin.users.remove-role');
        Route::post('/{user:id}/assign-permissions', [UserController::class, 'assignPermissions'])->name('admin.users.assign-permissions');
        Route::delete('/{user:id}/remove-permissions', [UserController::class, 'removePermissions'])->name('admin.users.remove-permissions');
        Route::post('/{user:id}/impersonate', [UserController::class, 'impersonate'])->name('admin.users.impersonate');
        Route::get('/{user:id}/activity-log', [UserController::class, 'activityLog'])->name('admin.users.activity-log');
    });

    // Role Management
    Route::prefix('roles')->group(function () {
        Route::get('/', [RoleController::class, 'index'])->name('admin.roles.index');
        Route::get('/create', [RoleController::class, 'create'])->name('admin.roles.create');
        Route::post('/', [RoleController::class, 'store'])->name('admin.roles.store');
        Route::get('/{role:id}', [RoleController::class, 'show'])->name('admin.roles.show');
        Route::get('/{role:id}/edit', [RoleController::class, 'edit'])->name('admin.roles.edit');
        Route::put('/{role:id}', [RoleController::class, 'update'])->name('admin.roles.update');
        Route::delete('/{role:id}', [RoleController::class, 'destroy'])->name('admin.roles.destroy');
        Route::post('/{role:id}/assign-permission', [RoleController::class, 'assignPermission'])->name('admin.roles.assign-permission');
        Route::delete('/{role:id}/remove-permission/{permission}', [RoleController::class, 'removePermission'])->name('admin.roles.remove-permission');
    });

    // Permission Management
    Route::prefix('permissions')->group(function () {
        Route::get('/', [PermissionController::class, 'index'])->name('admin.permissions.index');
        Route::get('/create', [PermissionController::class, 'create'])->name('admin.permissions.create');
        Route::post('/', [PermissionController::class, 'store'])->name('admin.permissions.store');
    });

    // Currency Management
    Route::prefix('currencies')->group(function () {
        Route::get('/', [CurrencyController::class, 'index'])->name('admin.currencies.index');
        Route::get('/create', [CurrencyController::class, 'create'])->name('admin.currencies.create');
        Route::post('/', [CurrencyController::class, 'store'])->name('admin.currencies.store');
        Route::get('/{id}/edit', [CurrencyController::class, 'edit'])->name('admin.currencies.edit');
        Route::put('/{id}', [CurrencyController::class, 'update'])->name('admin.currencies.update');
        Route::delete('/{id}', [CurrencyController::class, 'destroy'])->name('admin.currencies.destroy');
    });

    // Unit Management
    Route::prefix('units')->group(function () {
        Route::get('/', [UnitController::class, 'index'])->name('admin.units.index');
        Route::get('/create', [UnitController::class, 'create'])->name('admin.units.create');
        Route::post('/', [UnitController::class, 'store'])->name('admin.units.store');
        Route::get('/{unit}', [UnitController::class, 'show'])->name('admin.units.show');
        Route::get('/{unit}/edit', [UnitController::class, 'edit'])->name('admin.units.edit');
        Route::put('/{unit}', [UnitController::class, 'update'])->name('admin.units.update');
        Route::delete('/{unit}', [UnitController::class, 'destroy'])->name('admin.units.destroy');
        Route::post('/{unit}/restore', [UnitController::class, 'restore'])->name('admin.units.restore');
        Route::delete('/{unit}/force-delete', [UnitController::class, 'forceDelete'])->name('admin.units.force-delete');
    });

    // Supplier Management
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('admin.suppliers.index');
        Route::get('/create', [SupplierController::class, 'create'])->name('admin.suppliers.create');
        Route::post('/', [SupplierController::class, 'store'])->name('admin.suppliers.store');
        Route::get('/{supplier}', [SupplierController::class, 'show'])->name('admin.suppliers.show');
        Route::get('/{supplier}/edit', [SupplierController::class, 'edit'])->name('admin.suppliers.edit');
        Route::put('/{supplier}', [SupplierController::class, 'update'])->name('admin.suppliers.update');
        Route::delete('/{supplier}', [SupplierController::class, 'destroy'])->name('admin.suppliers.destroy');
        Route::post('/{supplier}/restore', [SupplierController::class, 'restore'])->name('admin.suppliers.restore')->withTrashed();
        Route::delete('/{supplier}/force-delete', [SupplierController::class, 'forceDelete'])->name('admin.suppliers.force-delete')->withTrashed();
        Route::get('/{supplier}/payments', [SupplierController::class, 'payments'])->name('admin.suppliers.payments');
        Route::get('/{supplier}/purchases', [SupplierController::class, 'purchases'])->name('admin.suppliers.purchases');
        Route::get('/{supplier}/activity-log', [SupplierController::class, 'activityLog'])->name('admin.suppliers.activity-log');
    });

    // Product Management
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('admin.products.index');
        Route::get('/create', [ProductController::class, 'create'])->name('admin.products.create');
        Route::post('/', [ProductController::class, 'store'])->name('admin.products.store');
        Route::get('/{product:id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/{product:id}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/{product:id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
        Route::patch('/{id}/restore', [ProductController::class, 'restore'])->name('admin.products.restore');
        Route::delete('/{id}/force', [ProductController::class, 'forceDelete'])->name('admin.products.force-delete');
    });

    // Employee Management
    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('admin.employees.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('admin.employees.create');
        Route::post('/', [EmployeeController::class, 'store'])->name('admin.employees.store');
        Route::get('/verify', [EmployeeController::class, 'verify'])->name('admin.employees.verify');
        Route::post('/verify-employee', [EmployeeController::class, 'verifyEmployee'])->name('admin.employees.verify-employee');
        Route::post('/record-attendance', [EmployeeController::class, 'recordAttendance'])->name('admin.attendance.record');
        Route::get('/today-stats', [EmployeeController::class, 'getTodayStats'])->name('admin.attendance.today-stats');
        Route::post('/mark-attendance', [EmployeeController::class, 'markAttendance'])->name('admin.employees.mark-attendance');

        // Employee Biometric routes
        Route::get('/{id}/biometric/create', [BioMetricController::class, 'create'])->name('admin.employees.biometric.create');
        Route::post('/{id}/biometric', [BioMetricController::class, 'store'])->name('admin.employees.biometric.store');
        Route::get('/{id}/biometric/edit', [BioMetricController::class, 'edit'])->name('admin.employees.biometric.edit');
        Route::put('/{id}/biometric', [BioMetricController::class, 'update'])->name('admin.employees.biometric.update');
        Route::delete('/{id}/biometric', [BioMetricController::class, 'destroy'])->name('admin.employees.biometric.destroy');

        // Employee routes
        Route::get('/manual-attendance', [EmployeeController::class, 'manualAttendance'])->name('admin.employees.manual-attendance');
        Route::post('/manual-record-attendance', [EmployeeController::class, 'recordManualAttendance'])->name('admin.attendance.manual-record');
        Route::get('/attendance-report', [EmployeeController::class, 'attendanceReport'])->name('admin.employees.attendance-report');
        Route::get('/{id}', [EmployeeController::class, 'show'])->name('admin.employees.show');
        Route::get('/{id}/edit', [EmployeeController::class, 'edit'])->name('admin.employees.edit');
        Route::put('/{id}', [EmployeeController::class, 'update'])->name('admin.employees.update');
        Route::delete('/{id}', [EmployeeController::class, 'destroy'])->name('admin.employees.destroy');
    });

    // Attendance Settings routes
    Route::prefix('attendance-settings')->group(function () {
        Route::get('/', [AttendanceSettingController::class, 'index'])->name('admin.attendance-settings.index');
        Route::get('/create', [AttendanceSettingController::class, 'create'])->name('admin.attendance-settings.create');
        Route::post('/', [AttendanceSettingController::class, 'store'])->name('admin.attendance-settings.store');
        Route::get('/{attendanceSetting}', [AttendanceSettingController::class, 'show'])->name('admin.attendance-settings.show');
        Route::get('/{attendanceSetting}/edit', [AttendanceSettingController::class, 'edit'])->name('admin.attendance-settings.edit');
        Route::put('/{attendanceSetting}', [AttendanceSettingController::class, 'update'])->name('admin.attendance-settings.update');
        Route::delete('/{attendanceSetting}', [AttendanceSettingController::class, 'destroy'])->name('admin.attendance-settings.destroy');
    });

    // Gates routes
    Route::prefix('gates')->group(function () {
        Route::get('/', [GateController::class, 'index'])->name('admin.gates.index');
        Route::get('/create', [GateController::class, 'create'])->name('admin.gates.create');
        Route::post('/', [GateController::class, 'store'])->name('admin.gates.store');
        Route::get('/{gate}', [GateController::class, 'show'])->name('admin.gates.show');
        Route::get('/{gate}/edit', [GateController::class, 'edit'])->name('admin.gates.edit');
        Route::put('/{gate}', [GateController::class, 'update'])->name('admin.gates.update');
        Route::delete('/{gate}', [GateController::class, 'destroy'])->name('admin.gates.destroy');
        Route::patch('/{id}/restore', [GateController::class, 'restore'])->name('admin.gates.restore');
        Route::delete('/{id}/force', [GateController::class, 'forceDelete'])->name('admin.gates.force-delete');
    });

    // Attendance Request routes
    Route::prefix('attendance-requests')->group(function () {
        // Manager/Admin routes
        Route::get('/', [AttendanceRequestController::class, 'index'])->name('admin.attendance-requests.index');
        Route::get('/{attendanceRequest}', [AttendanceRequestController::class, 'show'])->name('admin.attendance-requests.show');
        Route::patch('/{attendanceRequest}/approve', [AttendanceRequestController::class, 'approve'])->name('admin.attendance-requests.approve');
        Route::patch('/{attendanceRequest}/reject', [AttendanceRequestController::class, 'reject'])->name('admin.attendance-requests.reject');
        Route::post('/bulk-approve', [AttendanceRequestController::class, 'bulkApprove'])->name('admin.attendance-requests.bulk-approve');
        Route::post('/bulk-reject', [AttendanceRequestController::class, 'bulkReject'])->name('admin.attendance-requests.bulk-reject');
        Route::get('/api/pending-count', [AttendanceRequestController::class, 'getPendingCount'])->name('admin.attendance-requests.pending-count');

        // Employee routes
        Route::get('/my/requests', [AttendanceRequestController::class, 'myRequests'])->name('admin.attendance-requests.my-requests');
        Route::get('/my/create', [AttendanceRequestController::class, 'create'])->name('admin.attendance-requests.create');
        Route::post('/my/store', [AttendanceRequestController::class, 'store'])->name('admin.attendance-requests.store');
    });

    // Customer Management (Store)
    Route::prefix('customers')->group(function () {
        Route::get('/', [CustomerController::class, 'index'])->name('admin.customers.index');
        Route::get('/create', [CustomerController::class, 'create'])->name('admin.customers.create');
        Route::post('/', [CustomerController::class, 'store'])->name('admin.customers.store');
        Route::get('/{customer:id}', [CustomerController::class, 'show'])->name('admin.customers.show');
        Route::get('/{customer:id}/edit', [CustomerController::class, 'edit'])->name('admin.customers.edit');
        Route::put('/{customer:id}', [CustomerController::class, 'update'])->name('admin.customers.update');
        Route::delete('/{customer:id}', [CustomerController::class, 'destroy'])->name('admin.customers.destroy');

        // Customer income management
        Route::get('/{customer:id}/income', [CustomerController::class, 'income'])->name('admin.customers.income');

        // Customer outcome management
        Route::get('/{customer:id}/outcome', [CustomerController::class, 'outcome'])->name('admin.customers.outcome');

        // Customer orders management
        Route::get('/{customer:id}/orders', [CustomerController::class, 'orders'])->name('admin.customers.orders');
        Route::get('/{customer:id}/orders/{order}', [CustomerController::class, 'showOrder'])->name('admin.customers.orders.show');

        // Customer user management
        Route::post('/{customer:id}/users', [CustomerController::class, 'addUser'])->name('admin.customers.users.store');
        Route::put('/{customer:id}/users/{user}', [CustomerController::class, 'updateUser'])->name('admin.customers.users.update');
    });

    // Customer User Management
    Route::prefix('customer-users')->group(function () {
        Route::get('/', [CustomerUserController::class, 'index'])->name('admin.customer-users.index');
        Route::get('/create', [CustomerUserController::class, 'create'])->name('admin.customer-users.create');
        Route::post('/', [CustomerUserController::class, 'store'])->name('admin.customer-users.store');
        Route::get('/{customerUser:id}', [CustomerUserController::class, 'show'])->name('admin.customer-users.show');
        Route::get('/{customerUser:id}/edit', [CustomerUserController::class, 'edit'])->name('admin.customer-users.edit');
        Route::put('/{customerUser:id}', [CustomerUserController::class, 'update'])->name('admin.customer-users.update');
        Route::delete('/{customerUser:id}', [CustomerUserController::class, 'destroy'])->name('admin.customer-users.destroy');
    });

    // Warehouse Management
    Route::prefix('warehouses')->group(function () {
        Route::get('/', [WarehouseController::class, 'index'])->name('admin.warehouses.index');
        Route::get('/create', [WarehouseController::class, 'create'])->name('admin.warehouses.create');
        Route::post('/', [WarehouseController::class, 'store'])->name('admin.warehouses.store');
        Route::get('/{warehouse:id}/edit', [WarehouseController::class, 'edit'])->name('admin.warehouses.edit');
        Route::put('/{warehouse:id}', [WarehouseController::class, 'update'])->name('admin.warehouses.update');
        Route::delete('/{warehouse:id}', [WarehouseController::class, 'destroy'])->name('admin.warehouses.destroy');
        Route::post('/{warehouse:id}/restore', [WarehouseController::class, 'restore'])->name('admin.warehouses.restore');
        Route::delete('/{warehouse:id}/force-delete', [WarehouseController::class, 'forceDelete'])->name('admin.warehouses.force-delete');
        Route::get('/{warehouse:id}', [WarehouseController::class, 'show'])->name('admin.warehouses.show');

        // Warehouse products
        Route::get('/{warehouse:id}/products', [WarehouseController::class, 'products'])->name('admin.warehouses.products');

        // Warehouse import management
        Route::get('/{warehouse:id}/import', [WarehouseController::class, 'income'])->name('admin.warehouses.income');
        Route::get('/{warehouse:id}/import/create', [WarehouseController::class, 'createIncome'])->name('admin.warehouses.income.create');
        Route::post('/{warehouse:id}/import', [WarehouseController::class, 'storeIncome'])->name('admin.warehouses.income.store');

        // Warehouse export management
        Route::get('/{warehouse:id}/export', [WarehouseController::class, 'outcome'])->name('admin.warehouses.outcome');
        Route::get('/{warehouse:id}/export/create', [WarehouseController::class, 'createOutcome'])->name('admin.warehouses.outcome.create');
        Route::post('/{warehouse:id}/export', [WarehouseController::class, 'storeOutcome'])->name('admin.warehouses.outcome.store');

        // Warehouse transfer management
        Route::get('/{warehouse:id}/transfers', [WarehouseController::class, 'transfers'])->name('admin.warehouses.transfers');
        Route::get('/{warehouse:id}/transfers/create', [WarehouseController::class, 'createTransfer'])->name('admin.warehouses.transfers.create');
        Route::post('/{warehouse:id}/transfers', [WarehouseController::class, 'storeTransfer'])->name('admin.warehouses.transfers.store');

        // Warehouse sales management
        Route::get('/{warehouse:id}/sales', [WarehouseController::class, 'sales'])->name('admin.warehouses.sales');
        Route::get('/{warehouse:id}/sales/create', [WarehouseController::class, 'createSale'])->name('admin.warehouses.sales.create');
        Route::get('/{warehouse:id}/sales/{sale}', [WarehouseController::class, 'showSale'])->name('admin.warehouses.sales.show');
        Route::post('/{warehouse:id}/sales', [WarehouseController::class, 'storeSale'])->name('admin.warehouses.sales.store');

        // Warehouse user management
        Route::get('/{warehouse:id}/users/create', [WarehouseUserController::class, 'create'])->name('admin.warehouses.users.create');
        Route::post('/{warehouse:id}/users', [WarehouseUserController::class, 'store'])->name('admin.warehouses.users.store');
        Route::get('/{warehouse:id}/users/{warehouseUser}/edit', [WarehouseUserController::class, 'edit'])->name('admin.warehouses.users.edit');
        Route::put('/{warehouse:id}/users/{warehouseUser}', [WarehouseUserController::class, 'update'])->name('admin.warehouses.users.update');

        // Warehouse wallet management
        Route::get('/{warehouse:id}/wallet', [WarehouseController::class, 'wallet'])->name('admin.warehouses.wallet');
    });

    // Accounts Management
    Route::prefix('accounts')->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('admin.accounts.index');
        Route::get('/{account:id}', [AccountController::class, 'show'])->name('admin.accounts.show');
    });

    // Account Income CRUD routes
    Route::prefix('accounts/{account:id}/incomes')->name('admin.account.incomes.')->group(function () {
        Route::post('/', [AccountIncomeController::class, 'store'])->name('store');
        Route::get('/{income:id}', [AccountIncomeController::class, 'show'])->name('show');
        Route::put('/{income:id}', [AccountIncomeController::class, 'update'])->name('update');
        Route::delete('/{income:id}', [AccountIncomeController::class, 'destroy'])->name('destroy');
    });

    // Account Outcome CRUD routes
    Route::prefix('accounts/{account:id}/outcomes')->name('admin.account.outcomes.')->group(function () {
        Route::post('/', [AccountOutcomeController::class, 'store'])->name('store');
        Route::get('/{outcome:id}', [AccountOutcomeController::class, 'show'])->name('show');
        Route::put('/{outcome:id}', [AccountOutcomeController::class, 'update'])->name('update');
        Route::delete('/{outcome:id}', [AccountOutcomeController::class, 'destroy'])->name('destroy');
    });

    // Purchase Management
    Route::prefix('purchases')->group(function () {
        Route::get('/', [PurchaseController::class, 'index'])->name('admin.purchases.index');
        Route::get('/create', [PurchaseController::class, 'create'])->name('admin.purchases.create');
        Route::post('/', [PurchaseController::class, 'store'])->name('admin.purchases.store');
        Route::get('/{purchase:id}', [PurchaseController::class, 'show'])->name('admin.purchases.show');
        Route::get('/{purchase:id}/edit', [PurchaseController::class, 'edit'])->name('admin.purchases.edit');
        Route::put('/{purchase:id}', [PurchaseController::class, 'update'])->name('admin.purchases.update');
        Route::delete('/{purchase:id}', [PurchaseController::class, 'destroy'])->name('admin.purchases.destroy');

        // Purchase Items Management
        Route::get('/{purchase:id}/items', [PurchaseController::class, 'items'])->name('admin.purchases.items');
        Route::get('/{purchase:id}/items/create', [PurchaseController::class, 'createItem'])->name('admin.purchases.items.create');
        Route::post('/{purchase:id}/items', [PurchaseController::class, 'storeItem'])->name('admin.purchases.items.store');
        Route::delete('/{purchase:id}/items/{item:id}', [PurchaseController::class, 'destroyItem'])->name('admin.purchases.items.destroy');

        // Purchase Additional Costs Management
        Route::get('/{purchase:id}/additional-costs/create', [PurchaseController::class, 'createAdditionalCost'])->name('admin.purchases.additional-costs.create');
        Route::post('/{purchase:id}/additional-costs', [PurchaseController::class, 'storeAdditionalCost'])->name('admin.purchases.additional-costs.store');
        Route::delete('/{purchase:id}/additional-costs/{cost:id}', [PurchaseController::class, 'destroyAdditionalCost'])->name('admin.purchases.additional-costs.destroy');

        // Purchase Payments Management
        Route::get('/{purchase:id}/payments/create', [PurchaseController::class, 'createPayment'])->name('admin.purchases.payments.create');
        Route::post('/{purchase:id}/payments', [PurchaseController::class, 'storePayment'])->name('admin.purchases.payments.store');
        Route::delete('/{purchase:id}/payments/{payment:id}', [PurchaseController::class, 'destroyPayment'])->name('admin.purchases.payments.destroy');

        // Purchase Warehouse Transfer Management
        Route::get('/{purchase:id}/warehouse-transfer', [PurchaseController::class, 'warehouseTransfer'])->name('admin.purchases.warehouse-transfer');
        Route::post('/{purchase:id}/warehouse-transfer', [PurchaseController::class, 'storeWarehouseTransfer'])->name('admin.purchases.warehouse-transfer.store');
    });

    // Sales Management
    Route::prefix('sales')->group(function () {
        Route::get('/', [SalesController::class, 'index'])->name('admin.sales.index');
    });

    // Warehouse Income Management
    Route::prefix('incomes')->group(function () {
        Route::get('/', [IncomeController::class, 'index'])->name('admin.incomes.index');
    });


    // Warehouse Income Management
    Route::prefix('outcomes')->group(function () {
        Route::get('/', [OutcomeController::class, 'index'])->name('admin.outcomes.index');
    });
    // Warehouse Income Management
    Route::prefix('transfer')->group(function () {
        Route::get('/', [TransferController::class, 'index'])->name('admin.transfers.index');
    });

    // Universal Activity Log Routes
    Route::prefix('activity-logs')->group(function () {
        Route::get('/', [ActivityLogController::class, 'index'])->name('admin.activity-logs.index');
        Route::get('/{modelType}/{modelId}', [ActivityLogController::class, 'show'])->name('admin.activity-logs.show');
    });

    // Report Routes
    Route::prefix('reports')->group(function () {
        Route::get('/accounts/{account}/statement', [\App\Http\Controllers\ReportController::class, 'accountStatement'])->name('reports.account-statement');
        Route::get('/accounts/{account}/statement/download', [\App\Http\Controllers\ReportController::class, 'downloadAccountStatement'])->name('reports.account-statement.pdf');
    });

    // Customer Report Routes
    Route::prefix('customer-reports')->group(function () {
        Route::get('/accounts/{account}/statement', [\App\Http\Controllers\ReportController::class, 'customerAccountStatement'])->name('customer.reports.account-statement');
        Route::get('/accounts/{account}/statement/download', [\App\Http\Controllers\ReportController::class, 'downloadCustomerAccountStatement'])->name('customer.reports.account-statement.pdf');
    });
});
