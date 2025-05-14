<?php

use App\Http\Controllers\Admin\CurrencyController;
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
});
