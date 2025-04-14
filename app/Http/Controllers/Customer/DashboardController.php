<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerStockIncome;
use App\Models\CustomerStockOutcome;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index(Request $request)
    {
        // Get the authenticated customer user
        $user = auth('customer_user')->user();
        $customer = $user->customer;

        // Apply date filters if present
        $dateFrom = $request->input('date_from');
        $dateTo = $request->input('date_to');
        
        // Base query for stock incomes with date filters
        $incomeQuery = CustomerStockIncome::where('customer_id', $customer->id);
        if ($dateFrom) {
            $incomeQuery->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $incomeQuery->whereDate('created_at', '<=', $dateTo);
        }
        
        // Base query for stock outcomes with date filters
        $outcomeQuery = CustomerStockOutcome::where('customer_id', $customer->id);
        if ($dateFrom) {
            $outcomeQuery->whereDate('created_at', '>=', $dateFrom);
        }
        if ($dateTo) {
            $outcomeQuery->whereDate('created_at', '<=', $dateTo);
        }

        // Get top products by stock movement (from the view)
        $topProducts = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->where('customer_id', $customer->id);
            
        // Apply date filters to top products if present
        if ($dateFrom || $dateTo) {
            $topProducts = $topProducts->where(function($query) use ($dateFrom, $dateTo) {
                if ($dateFrom) {
                    $query->where('last_movement_date', '>=', $dateFrom);
                }
                if ($dateTo) {
                    $query->where('last_movement_date', '<=', $dateTo);
                }
            });
        }
        
        $topProducts = $topProducts->select(
                'products.id',
                'products.name',
                'customer_stock_product_movements.income_quantity',
                'customer_stock_product_movements.outcome_quantity',
                'customer_stock_product_movements.net_quantity',
                'customer_stock_product_movements.income_total',
                'customer_stock_product_movements.outcome_total',
                'customer_stock_product_movements.net_total'
            )
            ->orderBy('income_quantity', 'desc')
            ->limit(5)
            ->get();

        // Get monthly stock data for the current year
        $year = date('Y');
        $monthlyStockData = [];
        
        // Monthly income data with date filters
        $monthlyIncomes = $incomeQuery->clone()
            ->whereYear('created_at', $year)
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(total) as total_value')
            )
            ->groupBy('month')
            ->get()
            ->keyBy('month');
            
        // Monthly outcome data with date filters
        $monthlyOutcomes = $outcomeQuery->clone()
            ->whereYear('created_at', $year)
            ->select(
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(quantity) as total_quantity'),
                DB::raw('SUM(total) as total_value')
            )
            ->groupBy('month')
            ->get()
            ->keyBy('month');
        
        // Prepare monthly data for chart
        for ($month = 1; $month <= 12; $month++) {
            $monthName = date('M', mktime(0, 0, 0, $month, 1));
            $monthlyStockData[] = [
                'name' => $monthName,
                'income' => $monthlyIncomes->has($month) ? round($monthlyIncomes[$month]->total_quantity) : 0,
                'outcome' => $monthlyOutcomes->has($month) ? round($monthlyOutcomes[$month]->total_quantity) : 0,
                'incomeValue' => $monthlyIncomes->has($month) ? round($monthlyIncomes[$month]->total_value, 2) : 0,
                'outcomeValue' => $monthlyOutcomes->has($month) ? round($monthlyOutcomes[$month]->total_value, 2) : 0
            ];
        }

        // Get stock distribution data for pie chart
        $stockDistribution = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->where('customer_id', $customer->id)
            ->where('net_quantity', '>', 0)
            ->select(
                'products.name',
                'customer_stock_product_movements.net_quantity as value'
            )
            ->orderBy('net_quantity', 'desc')
            ->limit(5)
            ->get();

        // Get recent stock movements
        $recentIncomes = CustomerStockIncome::where('customer_id', $customer->id)
            ->with('product')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference' => $income->reference_number,
                    'product' => $income->product->name,
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'date' => $income->created_at->format('Y-m-d'),
                    'type' => 'income'
                ];
            });
            
        $recentOutcomes = CustomerStockOutcome::where('customer_id', $customer->id)
            ->with('product')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference' => $outcome->reference_number,
                    'product' => $outcome->product->name,
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'date' => $outcome->created_at->format('Y-m-d'),
                    'type' => 'outcome'
                ];
            });
            
        $recentMovements = $recentIncomes->concat($recentOutcomes)
            ->sortByDesc('date')
            ->take(5)
            ->values()
            ->all();

        // Calculate totals with date filters
        $totalIncome = $incomeQuery->clone()->sum('total');
        $totalOutcome = $outcomeQuery->clone()->sum('total');
        $totalIncomeQuantity = $incomeQuery->clone()->sum('quantity');
        $totalOutcomeQuantity = $outcomeQuery->clone()->sum('quantity');
        $netQuantity = $totalIncomeQuantity - $totalOutcomeQuantity;
        $netValue = $totalIncome - $totalOutcome;

        // Prepare the data for the view
        $data = [
            'user' => $user,
            'stats' => [
                'top_products' => $topProducts,
                'monthly_stock_data' => $monthlyStockData,
                'stock_distribution' => $stockDistribution,
                'recent_movements' => $recentMovements,
                'total_income' => $totalIncome,
                'total_outcome' => $totalOutcome,
                'total_income_quantity' => $totalIncomeQuantity,
                'total_outcome_quantity' => $totalOutcomeQuantity,
                'net_quantity' => $netQuantity,
                'net_value' => $netValue,
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo
                ]
            ]
        ];

        return Inertia::render('Customer/Dashboard', $data);
    }
    
    /**
     * Search for products by name or barcode
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchProducts(Request $request)
    {
        $search = $request->input('search');
        
        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        // First check products that the customer already has in stock
        $customerProducts = DB::table('customer_stock_product_movements')
            ->where('customer_id', $customer->id)
            ->where('net_quantity', '>', 0)
            ->pluck('product_id')
            ->toArray();
            
        $products = Product::select('id', 'name', 'barcode', 'purchase_price', 'retail_price', 'image')
            ->where('is_activated', true)
            ->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->when(!empty($customerProducts), function($query) use ($customerProducts) {
                // Prioritize products the customer already has
                return $query->orderByRaw('FIELD(id, ' . implode(',', $customerProducts) . ') DESC');
            })
            ->limit(10)
            ->get();
            
        // Add current stock information for each product
        $products->map(function($product) use ($customer) {
            $stockInfo = DB::table('customer_stock_product_movements')
                ->where('customer_id', $customer->id)
                ->where('product_id', $product->id)
                ->first();
                
            $product->current_stock = $stockInfo ? $stockInfo->net_quantity : 0;
            return $product;
        });

        return response()->json($products);
    }
} 