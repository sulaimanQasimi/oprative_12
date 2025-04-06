<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\HomeController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;

// Landing page route
Route::get('/', HomeController::class)->name('landing');

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');
});
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();

require __DIR__.'/purchase.php';