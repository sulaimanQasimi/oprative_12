<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\WarehouseProductController;
use App\Repositories\Customer\CustomerRepository;

// Landing page route
Route::get('/', [WarehouseProductController::class, 'index'])->name('landing');

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
});
CustomerRepository::registerRoutes();
// Warehouse products API endpoint for load more functionality
Route::get('/warehouse-products', [WarehouseProductController::class, 'index'])
    ->name('warehouse-products.index')
    ->middleware('ajax');

require __DIR__.'/purchase.php';
