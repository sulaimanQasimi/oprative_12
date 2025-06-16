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
        Route::get('/{user:id}', [UserController::class, 'show'])->name('admin.users.show');
        Route::get('/{user:id}/edit', [UserController::class, 'edit'])->name('admin.users.edit');
        Route::put('/{user:id}', [UserController::class, 'update'])->name('admin.users.update');
        Route::delete('/{user:id}', [UserController::class, 'destroy'])->name('admin.users.destroy');
        Route::post('/{user:id}/assign-role', [UserController::class, 'assignRole'])->name('admin.users.assign-role');
        Route::delete('/{user:id}/remove-role/{role}', [UserController::class, 'removeRole'])->name('admin.users.remove-role');
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
        Route::get('/{permission:id}', [PermissionController::class, 'show'])->name('admin.permissions.show');
        Route::get('/{permission:id}/edit', [PermissionController::class, 'edit'])->name('admin.permissions.edit');
        Route::put('/{permission:id}', [PermissionController::class, 'update'])->name('admin.permissions.update');
        Route::delete('/{permission:id}', [PermissionController::class, 'destroy'])->name('admin.permissions.destroy');
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
        Route::get('/{id}/edit', [UnitController::class, 'edit'])->name('admin.units.edit');
        Route::put('/{id}', [UnitController::class, 'update'])->name('admin.units.update');
        Route::delete('/{id}', [UnitController::class, 'destroy'])->name('admin.units.destroy');
    });

    // Supplier Management
    Route::prefix('suppliers')->group(function () {
        Route::get('/', [SupplierController::class, 'index'])->name('admin.suppliers.index');
        Route::get('/create', [SupplierController::class, 'create'])->name('admin.suppliers.create');
        Route::post('/', [SupplierController::class, 'store'])->name('admin.suppliers.store');
        Route::get('/{id}', [SupplierController::class, 'show'])->name('admin.suppliers.show');
        Route::get('/{id}/edit', [SupplierController::class, 'edit'])->name('admin.suppliers.edit');
        Route::put('/{id}', [SupplierController::class, 'update'])->name('admin.suppliers.update');
        Route::delete('/{id}', [SupplierController::class, 'destroy'])->name('admin.suppliers.destroy');
        Route::get('/{id}/payments', [SupplierController::class, 'payments'])->name('admin.suppliers.payments');
        Route::get('/{id}/purchases', [SupplierController::class, 'purchases'])->name('admin.suppliers.purchases');
    });

    // Product Management
    Route::prefix('products')->group(function () {
        Route::get('/', [ProductController::class, 'index'])->name('admin.products.index');
        Route::get('/create', [ProductController::class, 'create'])->name('admin.products.create');
        Route::post('/', [ProductController::class, 'store'])->name('admin.products.store');
        Route::get('/{product:id}/edit', [ProductController::class, 'edit'])->name('admin.products.edit');
        Route::put('/{product:id}', [ProductController::class, 'update'])->name('admin.products.update');
        Route::delete('/{product:id}', [ProductController::class, 'destroy'])->name('admin.products.destroy');
    });

    // Employee Management
    Route::prefix('employees')->group(function () {
        Route::get('/', [EmployeeController::class, 'index'])->name('admin.employees.index');
        Route::get('/create', [EmployeeController::class, 'create'])->name('admin.employees.create');
        Route::post('/', [EmployeeController::class, 'store'])->name('admin.employees.store');
        Route::get('/{id}', [EmployeeController::class, 'show'])->name('admin.employees.show');
        Route::get('/{id}/edit', [EmployeeController::class, 'edit'])->name('admin.employees.edit');
        Route::put('/{id}', [EmployeeController::class, 'update'])->name('admin.employees.update');
        Route::delete('/{id}', [EmployeeController::class, 'destroy'])->name('admin.employees.destroy');
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
        Route::post('/{warehouse:id}/sales', [WarehouseController::class, 'storeSale'])->name('admin.warehouses.sales.store');

        // Warehouse user management
        Route::get('/{warehouse:id}/users/create', [WarehouseUserController::class, 'create'])->name('admin.warehouses.users.create');
        Route::post('/{warehouse:id}/users', [WarehouseUserController::class, 'store'])->name('admin.warehouses.users.store');
        Route::get('/{warehouse:id}/users/{warehouseUser}/edit', [WarehouseUserController::class, 'edit'])->name('admin.warehouses.users.edit');
        Route::put('/{warehouse:id}/users/{warehouseUser}', [WarehouseUserController::class, 'update'])->name('admin.warehouses.users.update');
    });

    // Accounts Management
    Route::prefix('accounts')->group(function () {
        Route::get('/', [AccountController::class, 'index'])->name('admin.accounts.index');
        Route::get('/create', [AccountController::class, 'create'])->name('admin.accounts.create');
        Route::post('/', [AccountController::class, 'store'])->name('admin.accounts.store');
        Route::get('/{account:id}', [AccountController::class, 'show'])->name('admin.accounts.show');
        Route::get('/{account:id}/edit', [AccountController::class, 'edit'])->name('admin.accounts.edit');
        Route::put('/{account:id}', [AccountController::class, 'update'])->name('admin.accounts.update');
        Route::delete('/{account:id}', [AccountController::class, 'destroy'])->name('admin.accounts.destroy');

        // Account Income/Outcome management
        Route::get('/{account:id}/incomes', [AccountController::class, 'incomes'])->name('admin.accounts.incomes');
        Route::get('/{account:id}/outcomes', [AccountController::class, 'outcomes'])->name('admin.accounts.outcomes');
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
    });
});
