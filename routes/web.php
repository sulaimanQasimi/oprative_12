<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WarehouseProductController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;

// Landing page route
Route::get('/', [WarehouseProductController::class, 'index'])->name('landing');

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
});
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();