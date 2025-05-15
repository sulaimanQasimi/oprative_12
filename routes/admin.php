<?php

use App\Http\Controllers\Admin\CurrencyController;
use App\Http\Controllers\Admin\SupplierController;
use App\Http\Controllers\Admin\ProductController;
use App\Http\Controllers\Admin\WarehouseController;
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

    // Warehouse Management
    Route::prefix('warehouses')->group(function () {
        Route::get('/', [WarehouseController::class, 'index'])->name('admin.warehouses.index');
        Route::get('/create', [WarehouseController::class, 'create'])->name('admin.warehouses.create');
        Route::post('/', [WarehouseController::class, 'store'])->name('admin.warehouses.store');
        Route::get('/{warehouse:id}/edit', [WarehouseController::class, 'edit'])->name('admin.warehouses.edit');
        Route::put('/{warehouse:id}', [WarehouseController::class, 'update'])->name('admin.warehouses.update');
        Route::delete('/{warehouse:id}', [WarehouseController::class, 'destroy'])->name('admin.warehouses.destroy');
        Route::get('/{warehouse:id}', [WarehouseController::class, 'show'])->name('admin.warehouses.show');

        // Warehouse user management
        Route::post('/{warehouse:id}/users', [WarehouseController::class, 'addUser'])->name('admin.warehouses.users.add');
        Route::put('/{warehouse:id}/users/{user}', [WarehouseController::class, 'updateUser'])->name('admin.warehouses.users.update');
    });
});
