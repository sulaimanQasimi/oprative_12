<?php

namespace App\Repositories\Customer\Traits;

use Illuminate\Support\Facades\Route;

trait RegisterRoutes
{
    public static function registerRoutes()
    {
        // Customer Authentication Routes
        Route::prefix('customer')->name('customer.')->group(function () {
            // Redirect root customer path to dashboard if authenticated, otherwise to login
            Route::get('/', function () {
                return auth('customer_user')->check() ? redirect()->route('customer.dashboard') : redirect()->route('customer.login');
            });

            // Guest routes
            Route::middleware('guest:customer_user')
                ->group(function () {
                    Route::get('login', [\App\Http\Controllers\Customer\AuthController::class, 'showLoginForm'])->name('login');
                    Route::post('login', [\App\Http\Controllers\Customer\AuthController::class, 'login']);
                    Route::get('register', [\App\Http\Controllers\Customer\AuthController::class, 'showRegistrationForm'])->name('register');
                    Route::post('register', [\App\Http\Controllers\Customer\AuthController::class, 'register']);
                });

            // Authenticated routes - require customer_user auth
            Route::middleware('auth:customer_user')
            ->group(function () {
                Route::post('logout', [\App\Http\Controllers\Customer\AuthController::class, 'logout'])->name('logout');

                // Dashboard route
                Route::get('dashboard', \App\Livewire\Customer\Dashboard::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_dashboard')
                    ->name('dashboard');

                // Stock Products route
                Route::get('stock-products', \App\Livewire\Customer\CustomerStockProducts::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_stock')
                    ->name('stock-products');

                // Customer Orders routes
                Route::get('orders', \App\Livewire\Customer\CustomerOrder::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_orders')
                    ->name('orders');
                Route::get('orders/{order}/invoice', \App\Http\Controllers\Customer\InvoiceController::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_invoice')
                    ->name('orders.invoice');

                // Profile routes
                Route::get('profile', [\App\Http\Controllers\Customer\ProfileController::class, 'show'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_profile')
                    ->name('profile.show');
                Route::put('profile', [\App\Http\Controllers\Customer\ProfileController::class, 'update'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.edit_profile')
                    ->name('profile.update');
                Route::put('profile/password', [\App\Http\Controllers\Customer\ProfileController::class, 'updatePassword'])
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.edit_profile')
                    ->name('profile.password');

                // Customer Accounts route
                Route::get('/accounts', \App\Livewire\Customer\CustomerAccounts::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_accounts')
                    ->name('accounts');

                // Account incomes route
                Route::get('/account/{account}/incomes', \App\Livewire\Customer\AccountIncomes::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_incomes')
                    ->name('account.incomes');

                // Customer Sales route
                Route::get('/sales', \App\Livewire\Customer\SalesList::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_sales')
                    ->name('sales');

                // Customer Reports route
                Route::get('/reports', \App\Livewire\Customer\Reports::class)
                    ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class.':customer.view_reports')
                    ->name('reports');
            });

            // Catch-all route for unauthenticated access to protected routes
            Route::fallback(function () {
                return auth('customer_user')->check() ? redirect()->route('customer.dashboard') : redirect()->route('customer.login');
            });
        });

        Route::get('/thermal/print/income/{income}', [\App\Http\Controllers\ThermalPrinterController::class, 'printIncome'])
            ->name('thermal.print.income');
        Route::get('/thermal/print/outcome/{outcome}', [\App\Http\Controllers\ThermalPrinterController::class, 'printOutcome'])
            ->name('thermal.print.outcome');

        Route::get('/reports/account/{account}/statement', [\App\Http\Controllers\ReportController::class, 'accountStatement'])->name('reports.account.statement');
    }
}
