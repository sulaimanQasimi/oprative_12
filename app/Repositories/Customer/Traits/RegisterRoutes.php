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
use App\Http\Controllers\Customer\CustomerOrderController;
use App\Livewire\Customer\CustomerStockProducts;
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
                });

            // Authenticated routes - require customer_user auth
            Route::middleware('auth:customer_user')
                ->group(function () {

                    Route::get('/reports/account/{account}/statement', action: [ReportController::class, 'accountStatement'])
                    ->name('reports.account.statement');


                    Route::post('logout', [AuthController::class, 'logout'])->name('logout');

                    // Dashboard route
                    Route::get('dashboard', [DashboardController::class, 'index'])
                        ->name('dashboard');

                    // Dashboard product search
                    Route::get('dashboard/search-products', [DashboardController::class, 'searchProducts'])
                        ->name('dashboard.search-products');

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
                    Route::get('stock-products', [\App\Http\Controllers\Customer\StockProductsController::class, 'index'])
                        ->name('stock-products');

                    // Stock Incomes and Outcomes routes
                    Route::get('stock-incomes', [\App\Http\Controllers\Customer\StockIncomeController::class, 'index'])
                        ->name('stock-incomes.index');

                    Route::get('stock-incomes/create', [\App\Http\Controllers\Customer\StockIncomeController::class, 'create'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-incomes.create');

                    Route::get('stock-incomes/search-products', [\App\Http\Controllers\Customer\StockIncomeController::class, 'searchProducts'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-incomes.search-products');

                    Route::post('stock-incomes', [\App\Http\Controllers\Customer\StockIncomeController::class, 'store'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-incomes.store');

                    Route::get('stock-incomes/{stockIncome}', [\App\Http\Controllers\Customer\StockIncomeController::class, 'show'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-incomes.show');

                    Route::get('stock-outcomes', [\App\Http\Controllers\Customer\StockOutcomeController::class, 'index'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-outcomes.index');

                    Route::get('stock-outcomes/{stockOutcome}', [\App\Http\Controllers\Customer\StockOutcomeController::class, 'show'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_stock')
                        ->name('stock-outcomes.show');

                    // Customer Orders routes (now using React)
                    Route::get('orders', [CustomerOrderController::class,'view'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                        ->name('orders');

                    // Customer Orders API endpoints
                    Route::prefix('api')->name('api.')->group(function () {
                        Route::get('orders', [CustomerOrderController::class, 'index'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.index');

                        Route::get('orders/filter-options', [CustomerOrderController::class, 'getFilterOptions'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.filter-options');

                        Route::post('orders/clear-filters', [CustomerOrderController::class, 'clearFilters'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.clear-filters');

                        Route::get('orders/{id}', [CustomerOrderController::class, 'show'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.show');

                        Route::get('orders/{id}/status', [CustomerOrderController::class, 'getOrderStatus'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.status');

                        Route::get('orders/{id}/items', [CustomerOrderController::class, 'getOrderItems'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.items');

                        Route::get('orders/{id}/details', [CustomerOrderController::class, 'getOrderDetails'])
                            ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                            ->name('orders.details');
                    });

                    Route::get('orders/{order}/invoice', InvoiceController::class)
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_invoice')
                        ->name('orders.invoice');

                    Route::get('orders/{order}/thermal-print', [CustomerOrderController::class, 'thermalPrint'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_orders')
                        ->name('orders.thermal-print');

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

                    // Settings route
                    Route::get('settings', [ProfileController::class, 'show'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_profile')
                        ->name('settings');

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

                    Route::post('/accounts/{account}/outcomes', [AccountDetailsController::class, 'createOutcome'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.manage_accounts')
                        ->name('accounts.outcomes.store');

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

                    // Customer Wallet routes
                    Route::get('/wallet', [\App\Http\Controllers\Customer\WalletController::class, 'wallet'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_wallet')
                        ->name('wallet');

                    Route::get('/wallet/deposit', [\App\Http\Controllers\Customer\WalletController::class, 'depositForm'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.deposit_wallet')
                        ->name('wallet.deposit.form');

                    Route::post('/wallet/deposit', [\App\Http\Controllers\Customer\WalletController::class, 'deposit'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.deposit_wallet')
                        ->name('wallet.deposit');

                    Route::get('/wallet/withdraw', [\App\Http\Controllers\Customer\WalletController::class, 'withdrawForm'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.withdraw_wallet')
                        ->name('wallet.withdraw.form');

                    Route::post('/wallet/withdraw', [\App\Http\Controllers\Customer\WalletController::class, 'withdraw'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.withdraw_wallet')
                        ->name('wallet.withdraw');

                    Route::get('/wallet/export', [\App\Http\Controllers\Customer\WalletController::class, 'exportTransactions'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_wallet')
                        ->name('wallet.export');

                    Route::get('/wallet/transaction/{transactionId}', [\App\Http\Controllers\Customer\WalletController::class, 'getTransaction'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_wallet')
                        ->name('wallet.transaction');

                    // Customer Reports route
                    Route::get('/reports', [\App\Http\Controllers\Customer\ReportsController::class, 'index'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_reports')
                        ->name('reports');
                    Route::post('/reports/generate', [\App\Http\Controllers\Customer\ReportsController::class, 'generate'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_reports')
                        ->name('reports.generate');
                    Route::post('/reports/excel', [\App\Http\Controllers\Customer\ReportsController::class, 'exportExcel'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_reports')
                        ->name('reports.excel');
                    Route::post('/reports/pdf', [\App\Http\Controllers\Customer\ReportsController::class, 'exportPDF'])
                        ->middleware(\Spatie\Permission\Middleware\PermissionMiddleware::class . ':customer.view_reports')
                        ->name('reports.pdf');
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

        // Customer Account Statement Routes
        Route::get('/reports/account/{account}/statement', [ReportController::class, 'customerAccountStatement'])
            ->name('customer.reports.account-statement');
        Route::get('/reports/account/{account}/statement/download', [ReportController::class, 'downloadCustomerAccountStatement'])
            ->name('customer.reports.account-statement.pdf');

    }
}
