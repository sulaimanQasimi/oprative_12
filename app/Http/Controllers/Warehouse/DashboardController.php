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

        // Calculate total product stock and value
        $productsData = $warehouse->products()
            ->select(
                DB::raw('SUM(net_quantity) as total_stock'),
                DB::raw('SUM(net_total) as total_inventory_value'),
                DB::raw('SUM(income_quantity) as total_income_quantity'),
                DB::raw('SUM(outcome_quantity) as total_outcome_quantity'),
                DB::raw('SUM(income_total) as total_income_value'),
                DB::raw('SUM(outcome_total) as total_outcome_value'),
                DB::raw('SUM(profit) as total_profit')
            )
            ->first();

        // Get low stock products (less than 10 items)
        $lowStockCount = $warehouse->products()
            ->where('net_quantity', '<', 10)
            ->count();

        // Get top selling products
        $topSellingProducts = $warehouse->products()
            ->orderBy('outcome_quantity', 'desc')
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    "product_id" => $product->product_id,
                    "name" => $product->product->name,
                    "qty_sold" => $product->outcome_quantity,
                    "revenue" => $product->outcome_total,
                    "profit" => $product->profit,
                ];
            });

        // Monthly sales data for charts
        $monthlySales = $warehouse->warehouseOutcome()
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('YEAR(created_at) as year'),
                DB::raw('SUM(total) as total_amount')
            )
            ->whereYear('created_at', date('Y'))
            ->groupBy('year', 'month')
            ->orderBy('year')
            ->orderBy('month')
            ->get()
            ->map(function ($record) {
                $monthName = date('M', mktime(0, 0, 0, $record->month, 1));
                return [
                    'name' => $monthName,
                    'value' => (float) $record->total_amount
                ];
            });

        // Daily activity data for the last 7 days
        $dailyActivity = $warehouse->warehouseOutcome()
            ->select(
                DB::raw('DATE(created_at) as date'),
                DB::raw('COUNT(*) as transactions'),
                DB::raw('SUM(total) as total_amount')
            )
            ->where('created_at', '>=', now()->subDays(7))
            ->groupBy('date')
            ->orderBy('date')
            ->get()
            ->map(function ($record) {
                $dayName = date('D', strtotime($record->date));
                return [
                    'name' => $dayName,
                    'value' => (int) $record->transactions
                ];
            });

        // Get recent products with movement
        $recentProductMovement = $warehouse->products()
            ->take(5)
            ->get()
            ->map(function ($product) {
                return [
                    "product_id" => $product->product_id,
                    "name" => $product->product->name,
                    "income_quantity" => $product->income_quantity,
                    "outcome_quantity" => $product->outcome_quantity,
                    "net_quantity" => $product->net_quantity,
                ];
            });

        $stats = [
            'products_count' => $warehouse->products()->count(),
            'incoming_transfers_count' => $warehouse->transfersTo()->count(),
            'outgoing_transfers_count' => $warehouse->transfersFrom()->count(),
            'recent_activities' => $this->getRecentActivities($warehouse),

            // New stats
            'total_stock' => $productsData->total_stock ?? 0,
            'total_inventory_value' => $productsData->total_inventory_value ?? 0,
            'total_income_quantity' => $productsData->total_income_quantity ?? 0,
            'total_outcome_quantity' => $productsData->total_outcome_quantity ?? 0,
            'total_income_value' => $productsData->total_income_value ?? 0,
            'total_outcome_value' => $productsData->total_outcome_value ?? 0,
            'total_profit' => $productsData->total_profit ?? 0,
            'low_stock_count' => $lowStockCount,
            'top_selling_products' => $topSellingProducts,
            'monthly_sales' => $monthlySales,
            'daily_activity' => count($dailyActivity) > 0 ? $dailyActivity : $this->getDefaultDailyData(),
            'recent_product_movement' => $recentProductMovement,

            // Calculate useful ratios
            'inventory_turnover' => $productsData->total_stock > 0
                ? ($productsData->total_outcome_quantity / $productsData->total_stock)
                : 0,
            'profit_margin' => $productsData->total_outcome_value > 0
                ? ($productsData->total_profit / $productsData->total_outcome_value * 100)
                : 0,
        ];

        return Inertia::render('Warehouse/Dashboard', [
            'stats' => $stats,
        ]);
    }

    /**
     * Get recent activities for the warehouse.
     */
    private function getRecentActivities($warehouse)
    {
        $activities = [];

        // Add recent income records
        $recentIncome = $warehouse->warehouseIncome()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($income) {
                return [
                    'title' => 'New income: ' . $income->reference,
                    'time' => $income->created_at->diffForHumans(),
                    'type' => 'income',
                    'amount' => $income->amount,
                ];
            });

        // Add recent outcome records
        $recentOutcome = $warehouse->warehouseOutcome()
            ->latest()
            ->take(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'title' => 'New outcome: ' . $outcome->reference,
                    'time' => $outcome->created_at->diffForHumans(),
                    'type' => 'outcome',
                    'amount' => $outcome->amount,
                ];
            });

        // Merge and sort by time
        return $recentIncome->concat($recentOutcome)
            ->sortByDesc('created_at')
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * Get default daily data when no records are available.
     */
    private function getDefaultDailyData()
    {
        $days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
        $defaultData = [];

        foreach ($days as $day) {
            $defaultData[] = [
                'name' => $day,
                'value' => 0
            ];
        }

        return $defaultData;
    }
}
