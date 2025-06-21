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
use App\Http\Controllers\Warehouse\SaleController;
use App\Http\Controllers\Warehouse\ReportController;

trait RegisterRoutes
{
    public static function registerRoutes()
    {
        // Warehouse Authentication Routes
        Route::prefix('warehouse')->name('warehouse.')->group(function () {
            // Guest routes
            Route::middleware('guest:warehouse_user')->group(function () {
                Route::get('login', action: [AuthController::class, 'showLoginForm'])->name('login');
                Route::post('login', [AuthController::class, 'login']);
            });

            // Authenticated routes
            Route::middleware('auth:warehouse_user')->group(function () {
                // Dashboard
                Route::get('dashboard', [DashboardController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_dashboard')
                    ->name('dashboard');

                // Products management
                Route::get('products', [ProductController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_products')
                    ->name('products');

                Route::get('products/create', [ProductController::class, 'create'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.create_products')
                    ->name('products.create');

                Route::post('products', [ProductController::class, 'store'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.create_products')
                    ->name('products.store');

                Route::get('products/{product}', [ProductController::class, 'show'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_products')
                    ->name('products.show');

                Route::get('products/{product}/edit', [ProductController::class, 'edit'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.edit_products')
                    ->name('products.edit');

                Route::put('products/{product}', [ProductController::class, 'update'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.edit_products')
                    ->name('products.update');

                Route::delete('products/{product}', [ProductController::class, 'destroy'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.delete_products')
                    ->name('products.destroy');

                // Income management
                Route::get('income', [IncomeController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_income')
                    ->name('income');

                Route::get('income/{income}', [IncomeController::class, 'show'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_income_details')
                    ->name('income.show');

                // Outcome management
                Route::get('outcome', [OutcomeController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_outcome')
                    ->name('outcome');

                Route::get('outcome/{outcome}', [OutcomeController::class, 'show'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_outcome_details')
                    ->name('outcome.show');

                // Sales management
                Route::get('sales', [SaleController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_sales')
                    ->name('sales');

                Route::get('sales/create', [SaleController::class, 'create'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.create_sales')
                    ->name('sales.create');

                Route::post('sales', [SaleController::class, 'store'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.create_sales')
                    ->name('sales.store');

                Route::get('sales/{sale}', [SaleController::class, 'show'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_sale_details')
                    ->name('sales.show');

                Route::get('sales/{sale}/edit', [SaleController::class, 'edit'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.edit_sales')
                    ->name('sales.edit');

                Route::get('sales/{sale}/invoice', [SaleController::class, 'invoice'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.generate_invoice')
                    ->name('sales.invoice');

                Route::post('sales/{sale}/confirm', [SaleController::class, 'confirm'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.confirm_sales')
                    ->name('sales.confirm');

                Route::put('sales/{sale}', [SaleController::class, 'update'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.edit_sales')
                    ->name('sales.update');

                Route::delete('sales/{sale}', [SaleController::class, 'destroy'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.delete_sales')
                    ->name('sales.destroy');

                // Reports management
                Route::get('reports', [ReportController::class, 'index'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_reports')
                    ->name('reports');

                Route::post('reports/generate', [ReportController::class, 'generate'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.generate_reports')
                    ->name('reports.generate');

                // Profile routes
                Route::get('profile', [ProfileController::class, 'edit'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.view_profile')
                    ->name('profile.edit');

                Route::patch('profile', [ProfileController::class, 'update'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.edit_profile')
                    ->name('profile.update');

                Route::post('logout', [AuthController::class, 'logout'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':warehouse.logout')
                    ->name('logout');
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
