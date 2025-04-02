<?php

namespace App\Repositories\Warehouse\Traits;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Warehouse\AuthController;
use App\Http\Controllers\Warehouse\DashboardController;
use App\Http\Controllers\Warehouse\ProfileController;

trait RegisterRoutes
{
    public static function registerRoutes()
    {
        // Warehouse Authentication Routes
        Route::prefix('warehouse')->name('warehouse.')->group(function () {
            // Guest routes
            Route::middleware('guest:warehouse_user')->group(function () {
                Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
                Route::post('login', [AuthController::class, 'login']);
            });

            // Authenticated routes
            Route::middleware('auth:warehouse_user')->group(function () {
                Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
                Route::get('profile', [ProfileController::class, 'edit'])->name('profile.edit');
                Route::patch('profile', [ProfileController::class, 'update'])->name('profile.update');
                Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            });

            // Redirect root warehouse path to dashboard if authenticated, otherwise to login
            Route::get('/', function () {
                return redirect()->route(auth()->guard('warehouse_user')->check()
                    ? 'warehouse.dashboard'
                    : 'warehouse.login');
            });
        });
    }
}
