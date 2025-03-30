<?php

namespace App\Repositories\Customer\Traits;

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Customer\AccountDetailsController;
use App\Http\Controllers\Customer\AuthController;
use App\Http\Controllers\Customer\ProfileController;
use App\Http\Controllers\Customer\InvoiceController;
use App\Http\Controllers\Customer\SalesListController;
use App\Http\Controllers\ThermalPrinterController;
use App\Http\Controllers\ReportController;
use App\Http\Controllers\Customer\CustomerAccountsController;
use App\Http\Controllers\Customer\MarketOrderController;
use App\Http\Controllers\Customer\DashboardController;
use App\Livewire\Customer\CustomerStockProducts;
use App\Livewire\Customer\CustomerOrder;
use App\Livewire\Customer\Reports;

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
                    Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
                    Route::post('login', [AuthController::class, 'login']);
                    Route::get('register', [AuthController::class, 'showRegistrationForm'])->name('register');
                    Route::post('register', [AuthController::class, 'register']);
                });

            // Authenticated routes - require customer_user auth
            Route::middleware('auth:customer_user')
                ->group(function () {
                    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

                    // Dashboard route
                    Route::get('dashboard', [DashboardController::class, 'index'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_dashboard')
                        ->name('dashboard');

                    // Market Order routes (controller-based)
                    Route::get('create_orders', [MarketOrderController::class, 'create'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('create_orders');

                    // Market Order API endpoints
                    Route::post('market-order/start', [MarketOrderController::class, 'startOrder'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('market-order.start');

                    Route::get('market-order/search-products', [MarketOrderController::class, 'searchProducts'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('market-order.search-products');

                    Route::post('market-order/process-barcode', [MarketOrderController::class, 'processBarcode'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('market-order.process-barcode');

                    Route::get('market-order/search-accounts', [MarketOrderController::class, 'searchAccounts'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('market-order.search-accounts');

                    Route::post('market-order/complete', [MarketOrderController::class, 'completeOrder'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.create_orders')
                        ->name('market-order.complete');

                    // Stock Products route
                    Route::get('stock-products', CustomerStockProducts::class)
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-products');

                    // Customer Orders routes
                    Route::get('orders', CustomerOrder::class)
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                        ->name('orders');
                    Route::get('orders/{order}/invoice', InvoiceController::class)
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_invoice')
                        ->name('orders.invoice');

                    // Profile routes
                    Route::get('profile', [ProfileController::class, 'show'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_profile')
                        ->name('profile.show');
                    Route::put('profile', [ProfileController::class, 'update'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.edit_profile')
                        ->name('profile.update');
                    Route::put('profile/password', [ProfileController::class, 'updatePassword'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.edit_profile')
                        ->name('profile.password');

                    // Customer Accounts route - replaced Livewire with Controller
                    Route::get('/accounts', [CustomerAccountsController::class, 'index'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_accounts')
                        ->name('accounts.index');
                    Route::get('/accounts/create', [CustomerAccountsController::class, 'create'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_accounts')
                        ->name('accounts.create');
                    Route::post('/accounts', [CustomerAccountsController::class, 'store'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_accounts')
                        ->name('accounts.store');
                    Route::get('/accounts/reset-filters', [CustomerAccountsController::class, 'resetFilters'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_accounts')
                        ->name('accounts.resetFilters');

                    // Account routes (controller-based)
                    Route::get('/accounts/{account}/incomes', [AccountDetailsController::class, 'showIncomes'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_incomes')
                        ->name('accounts.show');

                    Route::post('/accounts/{account}/incomes', [AccountDetailsController::class, 'createIncome'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_accounts')
                        ->name('accounts.incomes.store');

                    Route::post('/accounts/{account}/incomes/{income}/approve', [AccountDetailsController::class, 'approveIncome'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_accounts')
                        ->name('accounts.incomes.approve');
                    Route::post('/accounts/{account}/outcomes/{outcome}/approve', [AccountDetailsController::class, 'approveOutcome'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_accounts')
                        ->name('accounts.outcomes.approve');

                    // Customer Sales routes
                    Route::get('/sales', [SalesListController::class, 'index'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_sales')
                        ->name('sales.index');

                    Route::get('/sales/{sale}', [SalesListController::class, 'show'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_sales')
                        ->name('sales.show');

                    Route::post('/sales/{sale}/payment', [SalesListController::class, 'addPayment'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_sales')
                        ->name('sales.payment');
                    Route::post('/sales/{sale}/confirm', [SalesListController::class, 'confirmSale'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_sales')
                        ->name('sales.confirm');

                    // Customer Reports route
                    Route::get('/reports', Reports::class)
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_reports')
                        ->name('reports');
                });

            // Catch-all route for unauthenticated access to protected routes
            Route::fallback(function () {
                return auth('customer_user')->check() ? redirect()->route('customer.dashboard') : redirect()->route('customer.login');
            });
        });

        Route::get('/thermal/print/income/{income}', [ThermalPrinterController::class, 'printIncome'])
            ->name('thermal.print.income');
        Route::get('/thermal/print/outcome/{outcome}', [ThermalPrinterController::class, 'printOutcome'])
            ->name('thermal.print.outcome');

        Route::get('/reports/account/{account}/statement', [ReportController::class, 'accountStatement'])
            ->name('reports.account.statement');
    }
}
