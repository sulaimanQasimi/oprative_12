<?php

use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\WarehouseController;
use App\Http\Controllers\Admin\UnitController;
use App\Http\Controllers\Admin\EmployeeController;
use App\Http\Controllers\Admin\WarehouseUserController;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Admin Routes
|--------------------------------------------------------------------------
|
| Here is where you can register admin routes for your application.
|
*/

Route::middleware(['auth', 'verified'])->group(function () {
    // Dashboard
    Route::get('/dashboard', function () {
        return Inertia::render('Admin/Dashboard');
    })->name('admin.dashboard');

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
        Route::get('/{warehouse:id}/income', [WarehouseController::class, 'income'])->name('admin.warehouses.income');

        // Warehouse export management
        Route::get('/{warehouse:id}/outcome', [WarehouseController::class, 'outcome'])->name('admin.warehouses.outcome');

        // Warehouse transfer management
        Route::get('/{warehouse:id}/transfers', [WarehouseController::class, 'transfers'])->name('admin.warehouses.transfers');
        Route::get('/{warehouse:id}/transfers/create', [WarehouseController::class, 'createTransfer'])->name('admin.warehouses.transfers.create');
        Route::post('/{warehouse:id}/transfers', [WarehouseController::class, 'storeTransfer'])->name('admin.warehouses.transfers.store');

        // Warehouse user management
        Route::get('/{warehouse:id}/users/create', [WarehouseUserController::class, 'create'])->name('admin.warehouses.users.create');
        Route::post('/{warehouse:id}/users', [WarehouseUserController::class, 'store'])->name('admin.warehouses.users.store');
        Route::get('/{warehouse:id}/users/{warehouseUser}/edit', [WarehouseUserController::class, 'edit'])->name('admin.warehouses.users.edit');
        Route::put('/{warehouse:id}/users/{warehouseUser}', [WarehouseUserController::class, 'update'])->name('admin.warehouses.users.update');
    });
});
