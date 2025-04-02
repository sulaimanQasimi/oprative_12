<?php

namespace App\Repositories\Warehouse\Traits;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Warehouse\AuthController;
use App\Http\Controllers\Warehouse\DashboardController;
use App\Http\Controllers\Warehouse\ProfileController;
use App\Http\Controllers\Warehouse\ProductController;
use App\Http\Controllers\Warehouse\IncomeController;
use App\Http\Controllers\Warehouse\OutcomeController;
use App\Http\Controllers\Warehouse\UsersController;

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

                // Products management
                Route::get('products', [ProductController::class, 'index'])->name('products');
                Route::get('products/create', [ProductController::class, 'create'])->name('products.create');
                Route::post('products', [ProductController::class, 'store'])->name('products.store');
                Route::get('products/{product}', [ProductController::class, 'show'])->name('products.show');
                Route::get('products/{product}/edit', [ProductController::class, 'edit'])->name('products.edit');
                Route::put('products/{product}', [ProductController::class, 'update'])->name('products.update');
                Route::delete('products/{product}', [ProductController::class, 'destroy'])->name('products.destroy');

                // Income management
                Route::get('income', [IncomeController::class, 'index'])->name('income');
                Route::get('income/create', [IncomeController::class, 'create'])->name('income.create');
                Route::post('income', [IncomeController::class, 'store'])->name('income.store');
                Route::get('income/{income}', [IncomeController::class, 'show'])->name('income.show');
                Route::get('income/{income}/edit', [IncomeController::class, 'edit'])->name('income.edit');
                Route::put('income/{income}', [IncomeController::class, 'update'])->name('income.update');
                Route::delete('income/{income}', [IncomeController::class, 'destroy'])->name('income.destroy');

                // Outcome management
                Route::get('outcome', [OutcomeController::class, 'index'])->name('outcome');
                Route::get('outcome/create', [OutcomeController::class, 'create'])->name('outcome.create');
                Route::post('outcome', [OutcomeController::class, 'store'])->name('outcome.store');
                Route::get('outcome/{outcome}', [OutcomeController::class, 'show'])->name('outcome.show');
                Route::get('outcome/{outcome}/edit', [OutcomeController::class, 'edit'])->name('outcome.edit');
                Route::put('outcome/{outcome}', [OutcomeController::class, 'update'])->name('outcome.update');
                Route::delete('outcome/{outcome}', [OutcomeController::class, 'destroy'])->name('outcome.destroy');

                // Users management
                Route::get('users', [UsersController::class, 'index'])->name('users');
                Route::get('users/create', [UsersController::class, 'create'])->name('users.create');
                Route::post('users', [UsersController::class, 'store'])->name('users.store');
                Route::get('users/{user}', [UsersController::class, 'show'])->name('users.show');
                Route::get('users/{user}/edit', [UsersController::class, 'edit'])->name('users.edit');
                Route::put('users/{user}', [UsersController::class, 'update'])->name('users.update');
                Route::delete('users/{user}', [UsersController::class, 'destroy'])->name('users.destroy');

                // Profile routes
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
