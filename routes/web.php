<?php

use Illuminate\Support\Facades\Route;
use Livewire\Volt\Volt;

Route::get('/', \App\Livewire\Dashboard::class)->name('home');

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

        Route::get('dashboard', \App\Livewire\Dashboard::class)->name('dashboard');

        // Profile routes
        Route::get('profile', [App\Http\Controllers\Customer\ProfileController::class, 'show'])->name('profile.show');
        Route::put('profile', [App\Http\Controllers\Customer\ProfileController::class, 'update'])->name('profile.update');
        Route::put('profile/password', [App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])->name('profile.password');
    });
});

require __DIR__.'/auth.php';
require __DIR__.'/purchase.php';
