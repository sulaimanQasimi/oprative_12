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
     * Display the customer dashboard with stats and charts
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        try {
            // Validate date filter inputs
            $validator = Validator::make($request->all(), [
                'date_from' => 'nullable|date|before_or_equal:today',
                'date_to' => 'nullable|date|after_or_equal:date_from|before_or_equal:today',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Customer/Dashboard', [
                    'auth' => [
                        'user' => auth('customer_user')->user() ? [
                            'id' => auth('customer_user')->user()->id,
                            'name' => auth('customer_user')->user()->name,
                            'email' => auth('customer_user')->user()->email,
                            'email_verified_at' => auth('customer_user')->user()->email_verified_at,
                            'created_at' => auth('customer_user')->user()->created_at,
                            'updated_at' => auth('customer_user')->user()->updated_at,
                            'permissions' => auth('customer_user')->user()->getAllPermissions()->pluck('name')->toArray(),
                        ] : null,
                    ],
                    'errors' => $validator->errors(),
                    'stats' => [],
                ]);
            }

            // Get the authenticated customer user
            $user = auth('customer_user')->user();
            if (!$user || !$user->customer) {
                Log::warning('Dashboard access attempted without valid customer association', [
                    'user_id' => $user ? $user->id : null,
                    'ip' => $request->ip()
                ]);
                return redirect()->route('customer.login');
            }

            $customer = $user->customer;

            // Apply sanitized date filters
            $dateFrom = $request->input('date_from');
            $dateTo = $request->input('date_to');

            // Apply date filters to queries using prepared statements for security
            $incomeQuery = $this->buildIncomeQuery($customer->id, $dateFrom, $dateTo);
            $outcomeQuery = $this->buildOutcomeQuery($customer->id, $dateFrom, $dateTo);

            // Get top products by stock movement with security measures
            $topProducts = $this->getTopProducts($customer->id, $dateFrom, $dateTo);

            // Get monthly stock data for the current year
            $year = date('Y');
            $monthlyStockData = $this->getMonthlyStockData($year, $incomeQuery, $outcomeQuery);

            // Get stock distribution data for pie chart
            $stockDistribution = $this->getStockDistribution($customer->id);

            // Get recent stock movements with proper data sanitization
            $recentMovements = $this->getRecentMovements($customer->id);

            // Calculate totals with date filters
            $totals = $this->calculateTotals($incomeQuery, $outcomeQuery);

            // Prepare the data for the view
            $data = [
                'auth' => [
                    'user' => auth('customer_user')->user() ? [
                        'id' => auth('customer_user')->user()->id,
                        'name' => auth('customer_user')->user()->name,
                        'email' => auth('customer_user')->user()->email,
                        'email_verified_at' => auth('customer_user')->user()->email_verified_at,
                        'created_at' => auth('customer_user')->user()->created_at,
                        'updated_at' => auth('customer_user')->user()->updated_at,
                        'permissions' => auth('customer_user')->user()->getAllPermissions()->pluck('name')->toArray(),
                    ] : null,
                ],
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'customer_id' => $customer->id,
                    'customer_name' => $customer->name,
                ],
                'stats' => [
                    'top_products' => $topProducts,
                    'monthly_stock_data' => $monthlyStockData,
                    'stock_distribution' => $stockDistribution,
                    'recent_movements' => $recentMovements,
                    'total_income' => $totals['income'],
                    'total_outcome' => $totals['outcome'],
                    'total_income_quantity' => $totals['income_quantity'],
                    'total_outcome_quantity' => $totals['outcome_quantity'],
                    'net_quantity' => $totals['net_quantity'],
                    'net_value' => $totals['net_value'],
                    'filters' => [
                        'date_from' => $dateFrom,
                        'date_to' => $dateTo
                    ]
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
                'auth' => [
                    'user' => auth('customer_user')->user() ? [
                        'id' => auth('customer_user')->user()->id,
                        'name' => auth('customer_user')->user()->name,
                        'email' => auth('customer_user')->user()->email,
                        'email_verified_at' => auth('customer_user')->user()->email_verified_at,
                        'created_at' => auth('customer_user')->user()->created_at,
                        'updated_at' => auth('customer_user')->user()->updated_at,
                        'permissions' => auth('customer_user')->user()->getAllPermissions()->pluck('name')->toArray(),
                    ] : null,
                ],
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
                'auth' => [
                    'user' => auth('customer_user')->user() ? [
                        'id' => auth('customer_user')->user()->id,
                        'name' => auth('customer_user')->user()->name,
                        'email' => auth('customer_user')->user()->email,
                        'email_verified_at' => auth('customer_user')->user()->email_verified_at,
                        'created_at' => auth('customer_user')->user()->created_at,
                        'updated_at' => auth('customer_user')->user()->updated_at,
                        'permissions' => auth('customer_user')->user()->getAllPermissions()->pluck('name')->toArray(),
                    ] : null,
                ],
                'errors' => ['general' => 'An error occurred while loading the dashboard.'],
                'stats' => [],
            ]);
        }
    }

    /**
     * Search for products by name or barcode
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchProducts(Request $request)
    {
        try {
            // Validate the search input
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

            // Get the authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $customer = $user->customer;

            // First check products that the customer already has in stock
            $customerProducts = DB::table('customer_stock_product_movements')
                ->where('customer_id', $customer->id)
                ->where('net_quantity', '>', 0)
                ->pluck('product_id')
                ->toArray();

            // Use parameterized query for security
            $products = Product::select('id', 'name', 'barcode', 'purchase_price', 'retail_price', 'image')
                ->where('is_activated', true)
                ->where(function($query) use ($search) {
                    $query->where('name', 'like', "%".addslashes($search)."%")
                        ->orWhere('barcode', 'like', "%".addslashes($search)."%");
                })
                ->when(!empty($customerProducts), function($query) use ($customerProducts) {
                    // Safely build the query when products array is not empty
                    if (count($customerProducts) > 0) {
                        return $query->orderByRaw(
                            'FIELD(id, ' . implode(',', array_map('intval', $customerProducts)) . ') DESC'
                        );
                    }
                    return $query;
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
                // Only include necessary information for the frontend
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'retail_price' => $product->retail_price,
                    'image' => $product->image,
                    'current_stock' => $product->current_stock,
                ];
            });

            return response()->json($products);
        } catch (QueryException $e) {
            Log::error('Database error in product search', [
                'message' => $e->getMessage(),
                'search' => $request->input('search', ''),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'A database error occurred during the search.',
            ], 500);
        } catch (\Exception $e) {
            Log::error('Error in product search', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while processing your search.',
            ], 500);
        }
    }

    /**
     * Build the income query with date filters
     *
     * @param int $customerId
     * @param string|null $dateFrom
     * @param string|null $dateTo
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function buildIncomeQuery($customerId, $dateFrom, $dateTo)
    {
        $query = CustomerStockIncome::where('customer_id', $customerId);

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return $query;
    }

    /**
     * Build the outcome query with date filters
     *
     * @param int $customerId
     * @param string|null $dateFrom
     * @param string|null $dateTo
     * @return \Illuminate\Database\Eloquent\Builder
     */
    private function buildOutcomeQuery($customerId, $dateFrom, $dateTo)
    {
        $query = CustomerStockOutcome::where('customer_id', $customerId);

        if ($dateFrom) {
            $query->whereDate('created_at', '>=', $dateFrom);
        }

        if ($dateTo) {
            $query->whereDate('created_at', '<=', $dateTo);
        }

        return $query;
    }

    /**
     * Get top products by stock movement
     *
     * @param int $customerId
     * @param string|null $dateFrom
     * @param string|null $dateTo
     * @return \Illuminate\Support\Collection
     */
    private function getTopProducts($customerId, $dateFrom, $dateTo)
    {
        $query = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->where('customer_id', $customerId);

        if ($dateFrom || $dateTo) {
            $query = $query->where(function($q) use ($dateFrom, $dateTo) {
                if ($dateFrom) {
                    $q->where('last_movement_date', '>=', $dateFrom);
                }
                if ($dateTo) {
                    $q->where('last_movement_date', '<=', $dateTo);
                }
            });
        }

        return $query->select(
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
    }

    /**
     * Get monthly stock data for charts
     *
     * @param int $year
     * @param \Illuminate\Database\Eloquent\Builder $incomeQuery
     * @param \Illuminate\Database\Eloquent\Builder $outcomeQuery
     * @return array
     */
    private function getMonthlyStockData($year, $incomeQuery, $outcomeQuery)
    {
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

        $monthlyData = [];
        for ($month = 1; $month <= 12; $month++) {
            $monthName = date('M', mktime(0, 0, 0, $month, 1));
            $monthlyData[] = [
                'name' => $monthName,
                'income' => $monthlyIncomes->has($month) ? round($monthlyIncomes[$month]->total_quantity) : 0,
                'outcome' => $monthlyOutcomes->has($month) ? round($monthlyOutcomes[$month]->total_quantity) : 0,
                'incomeValue' => $monthlyIncomes->has($month) ? round($monthlyIncomes[$month]->total_value, 2) : 0,
                'outcomeValue' => $monthlyOutcomes->has($month) ? round($monthlyOutcomes[$month]->total_value, 2) : 0
            ];
        }

        return $monthlyData;
    }

    /**
     * Get stock distribution data for pie chart
     *
     * @param int $customerId
     * @return \Illuminate\Support\Collection
     */
    private function getStockDistribution($customerId)
    {
        return DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->where('customer_id', $customerId)
            ->where('net_quantity', '>', 0)
            ->select(
                'products.name',
                'customer_stock_product_movements.net_quantity as value'
            )
            ->orderBy('net_quantity', 'desc')
            ->limit(5)
            ->get();
    }

    /**
     * Get recent stock movements
     *
     * @param int $customerId
     * @return array
     */
    private function getRecentMovements($customerId)
    {
        $recentIncomes = CustomerStockIncome::where('customer_id', $customerId)
            ->with('product:id,name')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference' => htmlspecialchars($income->reference_number),
                    'product' => htmlspecialchars($income->product->name),
                    'quantity' => (float)$income->quantity,
                    'price' => (float)$income->price,
                    'total' => (float)$income->total,
                    'date' => $income->created_at->format('Y-m-d'),
                    'type' => 'income'
                ];
            });

        $recentOutcomes = CustomerStockOutcome::where('customer_id', $customerId)
            ->with('product:id,name')
            ->latest()
            ->limit(5)
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference' => htmlspecialchars($outcome->reference_number),
                    'product' => htmlspecialchars($outcome->product->name),
                    'quantity' => (float)$outcome->quantity,
                    'price' => (float)$outcome->price,
                    'total' => (float)$outcome->total,
                    'date' => $outcome->created_at->format('Y-m-d'),
                    'type' => 'outcome'
                ];
            });

        return $recentIncomes->concat($recentOutcomes)
            ->sortByDesc('date')
            ->take(5)
            ->values()
            ->all();
    }

    /**
     * Calculate totals for dashboard statistics
     *
     * @param \Illuminate\Database\Eloquent\Builder $incomeQuery
     * @param \Illuminate\Database\Eloquent\Builder $outcomeQuery
     * @return array
     */
    private function calculateTotals($incomeQuery, $outcomeQuery)
    {
        $totalIncome = (float)$incomeQuery->clone()->sum('total');
        $totalOutcome = (float)$outcomeQuery->clone()->sum('total');
        $totalIncomeQuantity = (float)$incomeQuery->clone()->sum('quantity');
        $totalOutcomeQuantity = (float)$outcomeQuery->clone()->sum('quantity');
        $netQuantity = $totalIncomeQuantity - $totalOutcomeQuantity;
        $netValue = $totalIncome - $totalOutcome;

        return [
            'income' => $totalIncome,
            'outcome' => $totalOutcome,
            'income_quantity' => $totalIncomeQuantity,
            'outcome_quantity' => $totalOutcomeQuantity,
            'net_quantity' => $netQuantity,
            'net_value' => $netValue
        ];
    }
}