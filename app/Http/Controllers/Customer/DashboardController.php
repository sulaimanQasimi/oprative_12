<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerStockIncome;
use App\Models\CustomerStockOutcome;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Database\QueryException;

class DashboardController extends Controller
{
    /**
     * Display the customer dashboard with enhanced stats and charts
     */
    public function index(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'date_from' => 'nullable|date|before_or_equal:today',
                'date_to' => 'nullable|date|after_or_equal:date_from|before_or_equal:today',
                'chart_type' => 'nullable|in:monthly,weekly,daily',
                'product_filter' => 'nullable|string|max:100',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Customer/Dashboard', [
                    'auth' => $this->getAuthData(),
                    'errors' => $validator->errors(),
                    'stats' => [],
                ]);
            }

            $user = auth('customer_user')->user();
            if (!$user || !$user->customer) {
                Log::warning('Dashboard access attempted without valid customer association', [
                    'user_id' => $user ? $user->id : null,
                    'ip' => $request->ip()
                ]);
                return redirect()->route('customer.login');
            }

            $customer = $user->customer;
            $dateFrom = $request->input('date_from');
            $dateTo = $request->input('date_to');
            $chartType = $request->input('chart_type', 'monthly');
            $productFilter = $request->input('product_filter');

            $dashboardData = $this->getDashboardData($customer->id, $dateFrom, $dateTo, $chartType, $productFilter);

            $data = [
                'auth' => $this->getAuthData(),
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                ],
                'stats' => $dashboardData,
                'filters' => [
                    'date_from' => $dateFrom,
                    'date_to' => $dateTo,
                    'chart_type' => $chartType,
                    'product_filter' => $productFilter
                ]
            ];

            return Inertia::render('Customer/Dashboard', $data);
        } catch (QueryException $e) {
            Log::error('Database error in dashboard', [
                'message' => $e->getMessage(),
                'user_id' => auth('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return Inertia::render('Customer/Dashboard', [
                'auth' => $this->getAuthData(),
                'errors' => ['database' => 'A database error occurred. Please try again later.'],
                'stats' => [],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading dashboard', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => auth('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return Inertia::render('Customer/Dashboard', [
                'auth' => $this->getAuthData(),
                'errors' => ['general' => 'An error occurred while loading the dashboard.'],
                'stats' => [],
            ]);
        }
    }

    /**
     * Get comprehensive dashboard data with Chart.js integration
     */
    private function getDashboardData($customerId, $dateFrom, $dateTo, $chartType, $productFilter)
    {
        $inventoryOverview = $this->getInventoryOverview($customerId, $productFilter);
        $stockMovementCharts = $this->getStockMovementCharts($customerId, $dateFrom, $dateTo, $chartType);
        $productPerformance = $this->getProductPerformance($customerId, $dateFrom, $dateTo);
        $expiryAnalysis = $this->getExpiryAnalysis($customerId);
        $recentActivities = $this->getRecentActivities($customerId);
        $financialSummary = $this->getFinancialSummary($customerId, $dateFrom, $dateTo);
        $topProducts = $this->getTopProducts($customerId, $dateFrom, $dateTo);

        return [
            'inventory_overview' => $inventoryOverview,
            'stock_movement_charts' => $stockMovementCharts,
            'product_performance' => $productPerformance,
            'expiry_analysis' => $expiryAnalysis,
            'recent_activities' => $recentActivities,
            'financial_summary' => $financialSummary,
            'top_products' => $topProducts,
        ];
    }

    /**
     * Get inventory overview from customer_inventory view
     */
    private function getInventoryOverview($customerId, $productFilter = null)
    {
        $query = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0);

        if ($productFilter) {
            $query->where('product_name', 'like', "%{$productFilter}%");
        }

        $inventory = $query->get();

        $totalProducts = $inventory->count();
        $totalQuantity = $inventory->sum(fn($item) => $item->remaining_qty/$item->unit_amount);
        $totalValue = $inventory->sum(function($item) {
            return ($item->remaining_qty/$item->unit_amount) * $item->purchase_price;
        });
        
        $expiryStatus = $inventory->groupBy('expiry_status')
            ->map(function ($items) {
                return [
                    'count' => $items->count(),
                    'quantity' => $items->sum('remaining_qty'),
                    'value' => $items->sum(function($item) {
                        return ($item->remaining_qty/$item->unit_amount) * $item->purchase_price;
                    })
                ];
            });

        return [
            'total_products' => $totalProducts,
            'total_quantity' => $totalQuantity,
            'total_value' => $totalValue,
            'expiry_status' => $expiryStatus,
            'products' => $inventory->take(10)->map(function ($item) {
                return [
                    'id' => $item->batch_id,
                    'product_name' => $item->product_name,
                    'batch_reference' => $item->batch_reference,
                    'remaining_qty' => $item->remaining_qty/$item->unit_amount,
                    'unit_name' => $item->unit_name,
                    'purchase_price' => $item->purchase_price,
                    'total_value' => ($item->remaining_qty/$item->unit_amount) * $item->purchase_price,
                    'expiry_status' => $item->expiry_status,
                    'days_to_expiry' => $item->days_to_expiry,
                    'expire_date' => $item->expire_date,
                ];
            })
        ];
    }

    /**
     * Get stock movement charts data for Chart.js
     */
    private function getStockMovementCharts($customerId, $dateFrom, $dateTo, $chartType)
    {
        $dateFormat = $this->getDateFormat($chartType);

        $incomeQuery = CustomerStockIncome::where('customer_id', $customerId);
        if ($dateFrom) $incomeQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $incomeQuery->whereDate('created_at', '<=', $dateTo);

        $incomeData = $incomeQuery->select(
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            DB::raw('SUM(quantity/unit_amount) as total_quantity'),
            DB::raw('SUM(total) as total_value'),
            DB::raw('COUNT(*) as transactions')
        )
        ->groupBy('period')
        ->orderBy('period')
        ->get();

        $outcomeQuery = CustomerStockOutcome::where('customer_id', $customerId);
        if ($dateFrom) $outcomeQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $outcomeQuery->whereDate('created_at', '<=', $dateTo);

        $outcomeData = $outcomeQuery->select(
            DB::raw("DATE_FORMAT(created_at, '{$dateFormat}') as period"),
            DB::raw('SUM(quantity/unit_amount) as total_quantity'),
            DB::raw('SUM(total) as total_value'),
            DB::raw('COUNT(*) as transactions')
        )
        ->groupBy('period')
        ->orderBy('period')
        ->get();

        $labels = $incomeData->pluck('period')->merge($outcomeData->pluck('period'))->unique()->sort()->values();
        
        $incomeDataset = $labels->map(function ($label) use ($incomeData) {
            $data = $incomeData->where('period', $label)->first();
            return $data ? $data->total_quantity : 0;
        });

        $outcomeDataset = $labels->map(function ($label) use ($outcomeData) {
            $data = $outcomeData->where('period', $label)->first();
            return $data ? $data->total_quantity : 0;
        });

        $incomeValueDataset = $labels->map(function ($label) use ($incomeData) {
            $data = $incomeData->where('period', $label)->first();
            return $data ? $data->total_value : 0;
        });

        $outcomeValueDataset = $labels->map(function ($label) use ($outcomeData) {
            $data = $outcomeData->where('period', $label)->first();
            return $data ? $data->total_value : 0;
        });

        return [
            'labels' => $labels,
            'quantity_datasets' => [
                [
                    'label' => 'Income Quantity',
                    'data' => $incomeDataset,
                    'borderColor' => 'rgb(34, 197, 94)',
                    'backgroundColor' => 'rgba(34, 197, 94, 0.1)',
                    'tension' => 0.4
                ],
                [
                    'label' => 'Outcome Quantity',
                    'data' => $outcomeDataset,
                    'borderColor' => 'rgb(239, 68, 68)',
                    'backgroundColor' => 'rgba(239, 68, 68, 0.1)',
                    'tension' => 0.4
                ]
            ],
            'value_datasets' => [
                [
                    'label' => 'Income Value',
                    'data' => $incomeValueDataset,
                    'borderColor' => 'rgb(59, 130, 246)',
                    'backgroundColor' => 'rgba(59, 130, 246, 0.1)',
                    'tension' => 0.4
                ],
                [
                    'label' => 'Outcome Value',
                    'data' => $outcomeValueDataset,
                    'borderColor' => 'rgb(245, 158, 11)',
                    'backgroundColor' => 'rgba(245, 158, 11, 0.1)',
                    'tension' => 0.4
                ]
            ]
        ];
    }

    /**
     * Get product performance data
     */
    private function getProductPerformance($customerId, $dateFrom, $dateTo)
    {
        $query = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0);

        if ($dateFrom || $dateTo) {
            $query->where(function($q) use ($dateFrom, $dateTo) {
                if ($dateFrom) $q->where('issue_date', '>=', $dateFrom);
                if ($dateTo) $q->where('issue_date', '<=', $dateTo);
            });
        }

        $performance = $query->select(
            'product_name',
            DB::raw('SUM(remaining_qty/unit_amount) as total_quantity'),
            DB::raw('SUM((remaining_qty/unit_amount) * purchase_price) as total_value'),
            DB::raw('COUNT(DISTINCT batch_id) as batch_count'),
            DB::raw('AVG(purchase_price) as avg_price')
        )
        ->groupBy('product_name')
        ->orderBy('total_value', 'desc')
        ->limit(10)
        ->get();

        return $performance->map(function ($item) {
            return [
                'product_name' => $item->product_name,
                'total_quantity' => $item->total_quantity,
                'total_value' => $item->total_value,
                'batch_count' => $item->batch_count,
                'avg_price' => $item->avg_price,
            ];
        });
    }

    /**
     * Get expiry analysis
     */
    private function getExpiryAnalysis($customerId)
    {
        $expiryData = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0)
            ->whereNotNull('expire_date')
            ->select(
                'expiry_status',
                DB::raw('COUNT(*) as product_count'),
                DB::raw('SUM(remaining_qty/unit_amount) as total_quantity'),
                DB::raw('SUM((remaining_qty/unit_amount) * purchase_price) as total_value')
            )
            ->groupBy('expiry_status')
            ->get();

        $expiringSoon = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0)
            ->where('expiry_status', 'expiring_soon')
            ->orderBy('days_to_expiry')
            ->limit(5)
            ->get();

        return [
            'summary' => $expiryData,
            'expiring_soon' => $expiringSoon->map(function ($item) {
                return [
                    'product_name' => $item->product_name,
                    'batch_reference' => $item->batch_reference,
                    'remaining_qty' => $item->remaining_qty/$item->unit_amount,
                    'days_to_expiry' => $item->days_to_expiry,
                    'expire_date' => $item->expire_date,
                    'total_value' => ($item->remaining_qty/$item->unit_amount) * $item->purchase_price,
                ];
            })
        ];
    }

    /**
     * Get recent activities
     */
    private function getRecentActivities($customerId)
    {
        $recentIncomes = CustomerStockIncome::where('customer_id', $customerId)
            ->with(['product:id,name', 'batch:id,reference_number'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($income) {
                return [
                    'id' => $income->id,
                    'type' => 'income',
                    'reference' => $income->reference_number,
                    'product' => $income->product->name,
                    'batch' => $income->batch ? $income->batch->reference_number : null,
                    'quantity' => $income->quantity,
                    'price' => $income->purchase_price,
                    'total' => $income->total,
                    'date' => $income->created_at->format('Y-m-d H:i'),
                    'relative_time' => $income->created_at->diffForHumans(),
                ];
            });

        $recentOutcomes = CustomerStockOutcome::where('customer_id', $customerId)
            ->with(['product:id,name', 'batch:id,reference_number'])
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'type' => 'outcome',
                    'reference' => $outcome->reference_number,
                    'product' => $outcome->product->name,
                    'batch' => $outcome->batch ? $outcome->batch->reference_number : null,
                    'quantity' =>($outcome->is_wholesale) ? $outcome->quantity/$outcome->unit_amount : $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'date' => $outcome->created_at->format('Y-m-d H:i'),
                    'relative_time' => $outcome->created_at->diffForHumans(),
                ];
            });

        return $recentIncomes->concat($recentOutcomes)
            ->sortByDesc('date')
            ->take(10)
            ->values();
    }

    /**
     * Get financial summary
     */
    private function getFinancialSummary($customerId, $dateFrom, $dateTo)
    {
        $incomeQuery = CustomerStockIncome::where('customer_id', $customerId);
        if ($dateFrom) $incomeQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $incomeQuery->whereDate('created_at', '<=', $dateTo);

        $incomeSummary = $incomeQuery->select(
            DB::raw('SUM(quantity/unit_amount) as total_quantity'),
            DB::raw('SUM(total) as total_value'),
            DB::raw('COUNT(*) as transaction_count'),
            DB::raw('AVG(price) as avg_price')
        )->first();

        $outcomeQuery = CustomerStockOutcome::where('customer_id', $customerId);
        if ($dateFrom) $outcomeQuery->whereDate('created_at', '>=', $dateFrom);
        if ($dateTo) $outcomeQuery->whereDate('created_at', '<=', $dateTo);

        $outcomeSummary = $outcomeQuery->select(
            DB::raw('SUM(quantity/unit_amount) as total_quantity'),
            DB::raw('SUM(total) as total_value'),
            DB::raw('COUNT(*) as transaction_count'),
            DB::raw('AVG(price) as avg_price')
        )->first();

        $currentInventory = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0)
            ->select(
                DB::raw('SUM((remaining_qty/unit_amount) * purchase_price) as total_value'),
                DB::raw('SUM(remaining_qty) as total_quantity'),
                DB::raw('COUNT(DISTINCT product_id) as product_count')
            )->first();

        return [
            'income' => [
                'total_quantity' => $incomeSummary->total_quantity ?? 0,
                'total_value' => $incomeSummary->total_value ?? 0,
                'transaction_count' => $incomeSummary->transaction_count ?? 0,
                'avg_price' => $incomeSummary->avg_price ?? 0,
            ],
            'outcome' => [
                'total_quantity' => $outcomeSummary->total_quantity ?? 0,
                'total_value' => $outcomeSummary->total_value ?? 0,
                'transaction_count' => $outcomeSummary->transaction_count ?? 0,
                'avg_price' => $outcomeSummary->avg_price ?? 0,
            ],
            'current_inventory' => [
                'total_value' => $currentInventory->total_value ?? 0,
                'total_quantity' => $currentInventory->total_quantity ?? 0,
                'product_count' => $currentInventory->product_count ?? 0,
            ],
            'net_movement' => [
                'quantity' => ($incomeSummary->total_quantity ?? 0) - ($outcomeSummary->total_quantity ?? 0),
                'value' => ($incomeSummary->total_value ?? 0) - ($outcomeSummary->total_value ?? 0),
            ]
        ];
    }

    /**
     * Get top products by various metrics
     */
    private function getTopProducts($customerId, $dateFrom, $dateTo)
    {
        $topByQuantity = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0)
            ->select('product_name', DB::raw('SUM(remaining_qty/unit_amount) as total_quantity'))
            ->groupBy('product_name')
            ->orderBy('total_quantity', 'desc')
            ->limit(5)
            ->get();

        $topByValue = DB::table('customer_inventory')
            ->where('customer_id', $customerId)
            ->where('remaining_qty', '>', 0)
            ->select('product_name', DB::raw('SUM((remaining_qty/unit_amount) * purchase_price) as total_value'))
            ->groupBy('product_name')
            ->orderBy('total_value', 'desc')
            ->limit(5)
            ->get();

        return [
            'by_quantity' => $topByQuantity,
            'by_value' => $topByValue,
        ];
    }

    /**
     * Get date format for Chart.js
     */
    private function getDateFormat($chartType)
    {
        switch ($chartType) {
            case 'daily':
                return '%Y-%m-%d';
            case 'weekly':
                return '%Y-%u';
            case 'monthly':
            default:
                return '%Y-%m';
        }
    }

    /**
     * Get authentication data
     */
    private function getAuthData()
    {
        $user = auth('customer_user')->user();
        return [
            'user' => $user ? [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'email_verified_at' => $user->email_verified_at,
                'created_at' => $user->created_at,
                'updated_at' => $user->updated_at,
                'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
            ] : null,
        ];
    }

    /**
     * Search for products by name or barcode
     */
    public function searchProducts(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'search' => 'required|string|min:2|max:100',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid search query',
                    'errors' => $validator->errors(),
                ], 422);
            }

            $search = $request->input('search');
            $user = Auth::guard('customer_user')->user();
            
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $customer = $user->customer;

            $products = DB::table('customer_inventory')
                ->where('customer_id', $customer->id)
                ->where('remaining_qty', '>', 0)
                ->where(function($query) use ($search) {
                    $query->where('product_name', 'like', "%{$search}%")
                        ->orWhere('product_barcode', 'like', "%{$search}%")
                        ->orWhere('batch_reference', 'like', "%{$search}%");
                })
                ->select(
                    'product_id',
                    'product_name',
                    'product_barcode',
                    'batch_id',
                    'batch_reference',
                    'remaining_qty',
                    'unit_name',
                    'price',
                    'expiry_status',
                    'days_to_expiry'
                )
                ->limit(10)
                ->get();

            return response()->json($products);
        } catch (\Exception $e) {
            Log::error('Error in product search', [
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while processing your search.',
            ], 500);
        }
    }
}