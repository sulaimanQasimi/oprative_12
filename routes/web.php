<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;
use App\Http\Controllers\Warehouse\ReportController;

// Landing page route
Route::get('/',HomeController::class);

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
});

// Register repository routes
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();
require __DIR__.'/purchase.php';
Route::redirect('/login', '/')->name('login');