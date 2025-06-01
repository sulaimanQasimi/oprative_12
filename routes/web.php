<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SecuGenFingerprintController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;
use App\Http\Controllers\Warehouse\ReportController;

// Landing page route
Route::get('/',HomeController::class);

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
    
    // Employee Management Routes
    Route::resource('employees', EmployeeController::class);
    
    // Fingerprint Management Routes
    Route::resource('fingerprints', SecuGenFingerprintController::class);
    Route::get('employees/{employee}/fingerprints', [SecuGenFingerprintController::class, 'byEmployee'])
        ->name('employees.fingerprints');
});

// Register repository routes
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();
require __DIR__.'/purchase.php';
Route::redirect('/login', '/')->name('login');

// Include admin routes
Route::prefix('adminpanel')
->group(function () {
    require __DIR__.'/admin.php';
});
