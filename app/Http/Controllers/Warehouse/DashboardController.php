<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class DashboardController extends Controller
{
    /**
     * Display the dashboard.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        // Get batch inventory data from the view
        $batchInventory = DB::table('warehouse_batch_inventory')
            ->where('warehouse_id', $warehouse->id)
            ->get();

        // Calculate summary statistics
        $summaryStats = $this->calculateSummaryStats($batchInventory);
        
        // Get expiry analysis
        $expiryAnalysis = $this->getExpiryAnalysis($batchInventory);
        
        // Get monthly trends
        $monthlyTrends = $this->getMonthlyTrends($warehouse);
        
        // Get top products by value
        $topProducts = $this->getTopProducts($batchInventory);
        
        // Get recent activities
        $recentActivities = $this->getRecentActivities($warehouse);

        $stats = [
            // Summary statistics
            'total_batches' => $summaryStats['total_batches'],
            'total_products' => $summaryStats['total_products'],
            'total_stock_value' => $summaryStats['total_stock_value'],
            'total_remaining_qty' => $summaryStats['total_remaining_qty'],
            'average_days_to_expiry' => $summaryStats['average_days_to_expiry'],
            
            // Expiry analysis
            'expired_batches' => $expiryAnalysis['expired_batches'],
            'expiring_soon_batches' => $expiryAnalysis['expiring_soon_batches'],
            'valid_batches' => $expiryAnalysis['valid_batches'],
            'expiry_chart_data' => $expiryAnalysis['chart_data'],
            
            // Monthly trends
            'monthly_income' => $monthlyTrends['income'],
            'monthly_outcome' => $monthlyTrends['outcome'],
            'monthly_profit' => $monthlyTrends['profit'],
            
            // Top products
            'top_products' => $topProducts,
            
            // Recent activities
            'recent_activities' => $recentActivities,
            
            // Chart data for Chart.js
            'chart_data' => [
                'expiry_status' => $expiryAnalysis['chart_data'],
                'monthly_trends' => $monthlyTrends['chart_data'],
                'top_products_chart' => $this->prepareTopProductsChart($topProducts),
                'stock_distribution' => $this->prepareStockDistributionChart($batchInventory),
            ]
        ];

        return Inertia::render('Warehouse/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Calculate summary statistics from batch inventory
     */
    private function calculateSummaryStats($batchInventory)
    {
        $totalBatches = $batchInventory->count();
        $totalProducts = $batchInventory->unique('product_id')->count();
        $totalStockValue = $batchInventory->sum('total_income_value');
        $totalRemainingQty = $batchInventory->sum('remaining_qty');
        
        $validBatches = $batchInventory->where('expiry_status', 'valid');
        $averageDaysToExpiry = $validBatches->avg('days_to_expiry');

        return [
            'total_batches' => $totalBatches,
            'total_products' => $totalProducts,
            'total_stock_value' => $totalStockValue,
            'total_remaining_qty' => $totalRemainingQty,
            'average_days_to_expiry' => round($averageDaysToExpiry ?? 0, 1),
        ];
    }

    /**
     * Get expiry analysis data
     */
    private function getExpiryAnalysis($batchInventory)
    {
        $expiredBatches = $batchInventory->where('expiry_status', 'expired')->count();
        $expiringSoonBatches = $batchInventory->where('expiry_status', 'expiring_soon')->count();
        $validBatches = $batchInventory->where('expiry_status', 'valid')->count();

        $chartData = [
            [
                'label' => 'Valid',
                'value' => $validBatches,
                'color' => '#10b981',
                'backgroundColor' => 'rgba(16, 185, 129, 0.2)',
            ],
            [
                'label' => 'Expiring Soon',
                'value' => $expiringSoonBatches,
                'color' => '#f59e0b',
                'backgroundColor' => 'rgba(245, 158, 11, 0.2)',
            ],
            [
                'label' => 'Expired',
                'value' => $expiredBatches,
                'color' => '#ef4444',
                'backgroundColor' => 'rgba(239, 68, 68, 0.2)',
            ],
        ];

        return [
            'expired_batches' => $expiredBatches,
            'expiring_soon_batches' => $expiringSoonBatches,
            'valid_batches' => $validBatches,
            'chart_data' => $chartData,
        ];
    }

    /**
     * Get monthly trends data
     */
    private function getMonthlyTrends($warehouse)
    {
        $currentYear = date('Y');
        
        // Get monthly income data
        $monthlyIncome = $warehouse->warehouseIncome()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total) as total_amount')
            )
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        // Get monthly outcome data
        $monthlyOutcome = $warehouse->warehouseOutcome()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total) as total_amount')
            )
            ->whereYear('created_at', $currentYear)
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->keyBy('month');

        $chartData = [];
        $incomeData = [];
        $outcomeData = [];
        $profitData = [];

        for ($month = 1; $month <= 12; $month++) {
            $monthName = date('M', mktime(0, 0, 0, $month, 1));
            $income = $monthlyIncome->get($month)?->total_amount ?? 0;
            $outcome = $monthlyOutcome->get($month)?->total_amount ?? 0;
            $profit = $outcome - $income;

            $chartData[] = [
                'month' => $monthName,
                'income' => $income,
                'outcome' => $outcome,
                'profit' => $profit,
            ];

            $incomeData[] = $income;
            $outcomeData[] = $outcome;
            $profitData[] = $profit;
        }

        return [
            'income' => $incomeData,
            'outcome' => $outcomeData,
            'profit' => $profitData,
            'chart_data' => $chartData,
        ];
    }

    /**
     * Get top products by value
     */
    private function getTopProducts($batchInventory)
    {
        return $batchInventory
            ->groupBy('product_id')
            ->map(function ($batches, $productId) {
                $firstBatch = $batches->first();
                return [
                    'product_id' => $productId,
                    'name' => $firstBatch->product_name,
                    'barcode' => $firstBatch->product_barcode,
                    'total_remaining_qty' => $batches->sum('remaining_qty'),
                    'total_value' => $batches->sum('total_income_value'),
                    'batches_count' => $batches->count(),
                    'expired_batches' => $batches->where('expiry_status', 'expired')->count(),
                    'expiring_soon_batches' => $batches->where('expiry_status', 'expiring_soon')->count(),
                ];
            })
            ->sortByDesc('total_value')
            ->take(10)
            ->values()
            ->all();
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($warehouse)
    {
        $activities = [];

        // Get recent income records
        $recentIncome = $warehouse->warehouseIncome()
            ->with(['product', 'batch'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($income) {
                return [
                    'id' => $income->id,
                    'title' => 'Income: ' . ($income->product->name ?? 'Unknown Product'),
                    'time' => $income->created_at->diffForHumans(),
                    'type' => 'income',
                    'amount' => $income->total,
                    'quantity' => $income->quantity,
                    'reference' => $income->reference,
                    'batch_reference' => $income->batch?->reference_number,
                ];
            });

        // Get recent outcome records
        $recentOutcome = $warehouse->warehouseOutcome()
            ->with(['product', 'batch'])
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'title' => 'Outcome: ' . ($outcome->product->name ?? 'Unknown Product'),
                    'time' => $outcome->created_at->diffForHumans(),
                    'type' => 'outcome',
                    'amount' => $outcome->total,
                    'quantity' => $outcome->quantity,
                    'reference' => $outcome->reference,
                    'batch_reference' => $outcome->batch?->reference_number,
                ];
            });

        return $recentIncome->concat($recentOutcome)
            ->sortByDesc('time')
            ->take(10)
            ->values()
            ->all();
    }

    /**
     * Prepare top products chart data
     */
    private function prepareTopProductsChart($topProducts)
    {
        return [
            'labels' => collect($topProducts)->pluck('name')->toArray(),
            'datasets' => [
                [
                    'label' => 'Total Value',
                    'data' => collect($topProducts)->pluck('total_value')->toArray(),
                    'backgroundColor' => 'rgba(16, 185, 129, 0.8)',
                    'borderColor' => 'rgba(16, 185, 129, 1)',
                    'borderWidth' => 1,
                ],
                [
                    'label' => 'Remaining Quantity',
                    'data' => collect($topProducts)->pluck('total_remaining_qty')->toArray(),
                    'backgroundColor' => 'rgba(59, 130, 246, 0.8)',
                    'borderColor' => 'rgba(59, 130, 246, 1)',
                    'borderWidth' => 1,
                ],
            ],
        ];
    }

    /**
     * Prepare stock distribution chart data
     */
    private function prepareStockDistributionChart($batchInventory)
    {
        $distribution = $batchInventory
            ->groupBy('expiry_status')
            ->map(function ($batches, $status) {
                return [
                    'status' => $status,
                    'count' => $batches->count(),
                    'total_value' => $batches->sum('total_income_value'),
                    'total_quantity' => $batches->sum('remaining_qty'),
                ];
            });

        return [
            'labels' => $distribution->keys()->toArray(),
            'datasets' => [
                [
                    'label' => 'Batch Count',
                    'data' => $distribution->pluck('count')->toArray(),
                    'backgroundColor' => [
                        'rgba(16, 185, 129, 0.8)',
                        'rgba(245, 158, 11, 0.8)',
                        'rgba(239, 68, 68, 0.8)',
                    ],
                    'borderColor' => [
                        'rgba(16, 185, 129, 1)',
                        'rgba(245, 158, 11, 1)',
                        'rgba(239, 68, 68, 1)',
                    ],
                    'borderWidth' => 2,
                ],
            ],
        ];
    }
}
