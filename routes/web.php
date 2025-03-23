<?php

use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

Route::view('dashboard', 'dashboard')
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
});

// Customer Authentication Routes
Route::prefix('customer')->name('customer.')->group(function () {
    // Guest routes
    Route::middleware('guest:customer')->group(function () {
        Route::get('login', [App\Http\Controllers\Customer\AuthController::class, 'showLoginForm'])->name('login');
        Route::post('login', [App\Http\Controllers\Customer\AuthController::class, 'login']);
        Route::get('register', [App\Http\Controllers\Customer\AuthController::class, 'showRegistrationForm'])->name('register');
        Route::post('register', [App\Http\Controllers\Customer\AuthController::class, 'register']);
    });

    // Authenticated routes
    Route::middleware('auth:customer')->group(function () {
        Route::post('logout', [App\Http\Controllers\Customer\AuthController::class, 'logout'])->name('logout');
        // Route::get('dashboard', function () {
        //     return view('customer.dashboard');
        // })->name('dashboard');

        Route::get('dashboard', \App\Livewire\Customer\Dashboard::class)->name('dashboard');

        // Stock Products route
        Route::get('stock-products', \App\Livewire\Customer\CustomerStockProducts::class)->name('stock-products');

        // Customer Orders route
        Route::get('orders', \App\Livewire\Customer\CustomerOrder::class)->name('orders');

        // Add new invoice route
        Route::get('orders/{order}/invoice', \App\Http\Controllers\Customer\InvoiceController::class)->name('orders.invoice');

        // Profile routes
        Route::get('profile', [App\Http\Controllers\Customer\ProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [App\Http\Controllers\Customer\ProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])->name('profile.password');

        // Customer Accounts route
        Route::get('/accounts', \App\Livewire\Customer\CustomerAccounts::class)->name('accounts');

        // Account incomes route
        Route::get('/account/{account}/incomes', \App\Livewire\Customer\AccountIncomes::class)->name('account.incomes');
    });
});

Route::get('/thermal/print/income/{income}', [App\Http\Controllers\ThermalPrinterController::class, 'printIncome'])
    ->name('thermal.print.income');
Route::get('/thermal/print/outcome/{outcome}', [App\Http\Controllers\ThermalPrinterController::class, 'printOutcome'])
    ->name('thermal.print.outcome');

require __DIR__.'/auth.php';
require __DIR__.'/purchase.php';
