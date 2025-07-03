<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MarketOrder;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Carbon\Carbon;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class CustomerOrderController extends Controller
{
    /**
     * Display the orders index page
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function view(Request $request)
    {
        return Inertia::render('Customer/Orders/Index', [
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
        ]);
    }

    /**
     * Get paginated list of customer orders with filters
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Validate request parameters
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:100',
                'status' => 'nullable|string|in:all,pending,processing,completed,cancelled',
                'payment_status' => 'nullable|string|in:all,paid,partial,pending',
                'dateRange' => 'nullable|string|in:all,today,week,month,year,custom',
                'start_date' => 'nullable|date|required_if:dateRange,custom',
                'end_date' => 'nullable|date|required_if:dateRange,custom|after_or_equal:start_date',
                'sortField' => 'nullable|string|in:id,created_at,total_amount,order_status,payment_status',
                'sortDirection' => 'nullable|string|in:asc,desc',
                'page' => 'nullable|integer|min:1',
                'per_page' => 'nullable|integer|min:1|max:50',
                'min_amount' => 'nullable|numeric|min:0',
                'max_amount' => 'nullable|numeric|min:0|gte:min_amount',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid request parameters',
                    'errors' => $validator->errors()
                ], 422);
            }

            // Get the authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                Log::warning('Order access attempted without valid customer association', [
                    'user_id' => $user ? $user->id : null,
                    'ip' => $request->ip()
                ]);
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $customer = $user->customer;

            // Build the query with security measures
            $query = MarketOrder::where('customer_id', $customer->id)
                ->with(['items' => function($query) {
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price', 'subtotal', 'unit_type', 'is_wholesale', 'discount_amount', 'notes', 'unit_id', 'unit_amount', 'unit_name', 'created_at', 'updated_at');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode');
                }]);

            // Apply search filter for order number, total amount, or product names
            if ($request->filled('search')) {
                $search = trim($request->search);
                $query->where(function($q) use ($search) {
                    // Use id directly for numeric search (order ID)
                    if (is_numeric($search)) {
                        $q->where('id', $search)
                          ->orWhere('total_amount', 'like', '%' . $search . '%');
                    } else {
                        // For other searches, sanitize the input for LIKE queries
                        $searchParam = '%' . addslashes($search) . '%';
                        $q->where('total_amount', 'like', $searchParam)
                          ->orWhere('order_number', 'like', $searchParam)
                          ->orWhere('notes', 'like', $searchParam)
                          ->orWhereHas('items.product', function($subQuery) use ($searchParam) {
                              $subQuery->where('name', 'like', $searchParam)
                                      ->orWhere('barcode', 'like', $searchParam);
                          });
                    }
                });
            }

            // Apply order status filter
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('order_status', $request->status);
            }

            // Apply payment status filter
            if ($request->filled('payment_status') && $request->payment_status !== 'all') {
                $query->where('payment_status', $request->payment_status);
            }

            // Apply amount range filter
            if ($request->filled('min_amount')) {
                $query->where('total_amount', '>=', $request->min_amount);
            }

            if ($request->filled('max_amount')) {
                $query->where('total_amount', '<=', $request->max_amount);
            }

            // Apply date range filter with validation
            if ($request->filled('dateRange') && $request->dateRange !== 'all') {
                $now = Carbon::now();
                switch ($request->dateRange) {
                    case 'today':
                        $query->whereDate('created_at', $now->format('Y-m-d'));
                        break;
                    case 'week':
                        $query->whereBetween('created_at', [
                            $now->copy()->startOfWeek()->format('Y-m-d'),
                            $now->copy()->endOfWeek()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'month':
                        $query->whereBetween('created_at', [
                            $now->copy()->startOfMonth()->format('Y-m-d'),
                            $now->copy()->endOfMonth()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'year':
                        $query->whereBetween('created_at', [
                            $now->copy()->startOfYear()->format('Y-m-d'),
                            $now->copy()->endOfYear()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'custom':
                        if ($request->filled('start_date') && $request->filled('end_date')) {
                            $query->whereBetween('created_at', [
                                $request->start_date . ' 00:00:00',
                                $request->end_date . ' 23:59:59'
                            ]);
                        }
                        break;
                }
            }

            // Apply sorting with validation
            $sortField = $request->input('sortField', 'created_at');
            $sortDirection = $request->input('sortDirection', 'desc');

            if ($sortField === 'total_amount') {
                // Cast total_amount to decimal for proper numeric sorting
                $query->orderByRaw('CAST(total_amount AS DECIMAL(10,2)) ' . $sortDirection);
            } else {
                $query->orderBy($sortField, $sortDirection);
            }

            // Pagination with validation
            $perPage = min((int) $request->input('per_page', 10), 50); // Max 50 items per page
            $page = (int) $request->input('page', 1);

            $paginatedOrders = $query->paginate($perPage, ['*'], 'page', $page);

            // Get comprehensive stats based on current filters
            $statsQuery = MarketOrder::where('customer_id', $customer->id);
            
            // Apply the same filters to stats query
            if ($request->filled('dateRange') && $request->dateRange !== 'all') {
                $now = Carbon::now();
                switch ($request->dateRange) {
                    case 'today':
                        $statsQuery->whereDate('created_at', $now->format('Y-m-d'));
                        break;
                    case 'week':
                        $statsQuery->whereBetween('created_at', [
                            $now->copy()->startOfWeek()->format('Y-m-d'),
                            $now->copy()->endOfWeek()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'month':
                        $statsQuery->whereBetween('created_at', [
                            $now->copy()->startOfMonth()->format('Y-m-d'),
                            $now->copy()->endOfMonth()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'year':
                        $statsQuery->whereBetween('created_at', [
                            $now->copy()->startOfYear()->format('Y-m-d'),
                            $now->copy()->endOfYear()->format('Y-m-d 23:59:59')
                        ]);
                        break;
                    case 'custom':
                        if ($request->filled('start_date') && $request->filled('end_date')) {
                            $statsQuery->whereBetween('created_at', [
                                $request->start_date . ' 00:00:00',
                                $request->end_date . ' 23:59:59'
                            ]);
                        }
                        break;
                }
            }

            if ($request->filled('status') && $request->status !== 'all') {
                $statsQuery->where('order_status', $request->status);
            }

            if ($request->filled('payment_status') && $request->payment_status !== 'all') {
                $statsQuery->where('payment_status', $request->payment_status);
            }

            if ($request->filled('min_amount')) {
                $statsQuery->where('total_amount', '>=', $request->min_amount);
            }

            if ($request->filled('max_amount')) {
                $statsQuery->where('total_amount', '<=', $request->max_amount);
            }

            $stats = [
                'total_orders' => $statsQuery->count(),
                'total_amount' => $statsQuery->sum('total_amount'),
                'average_amount' => $statsQuery->count() > 0 ? $statsQuery->avg('total_amount') : 0,
                'pending_orders' => (clone $statsQuery)->where('order_status', 'pending')->count(),
                'processing_orders' => (clone $statsQuery)->where('order_status', 'processing')->count(),
                'completed_orders' => (clone $statsQuery)->where('order_status', 'completed')->count(),
                'cancelled_orders' => (clone $statsQuery)->where('order_status', 'cancelled')->count(),
                'paid_orders' => (clone $statsQuery)->where('payment_status', 'paid')->count(),
                'partial_orders' => (clone $statsQuery)->where('payment_status', 'partial')->count(),
                'pending_payment_orders' => (clone $statsQuery)->where('payment_status', 'pending')->count(),
            ];

            // Add filter summary
            $activeFilters = [];
            if ($request->filled('search')) $activeFilters['search'] = $request->search;
            if ($request->filled('status') && $request->status !== 'all') $activeFilters['status'] = $request->status;
            if ($request->filled('payment_status') && $request->payment_status !== 'all') $activeFilters['payment_status'] = $request->payment_status;
            if ($request->filled('dateRange') && $request->dateRange !== 'all') $activeFilters['date_range'] = $request->dateRange;
            if ($request->filled('min_amount')) $activeFilters['min_amount'] = $request->min_amount;
            if ($request->filled('max_amount')) $activeFilters['max_amount'] = $request->max_amount;

            return response()->json([
                'orders' => $paginatedOrders->items(),
                'pagination' => [
                    'total' => $paginatedOrders->total(),
                    'per_page' => $paginatedOrders->perPage(),
                    'current_page' => $paginatedOrders->currentPage(),
                    'last_page' => $paginatedOrders->lastPage(),
                    'from' => $paginatedOrders->firstItem(),
                    'to' => $paginatedOrders->lastItem(),
                    'has_more_pages' => $paginatedOrders->hasMorePages(),
                    'has_previous_pages' => $paginatedOrders->previousPageUrl() !== null,
                ],
                'stats' => $stats,
                'filters' => [
                    'active' => $activeFilters,
                    'applied' => count($activeFilters) > 0,
                    'total_applied' => count($activeFilters)
                ],
                'meta' => [
                    'sort_field' => $sortField,
                    'sort_direction' => $sortDirection,
                    'per_page' => $perPage,
                    'current_page' => $page
                ]
            ]);
        } catch (ValidationException $e) {
            return response()->json([
                'message' => 'Validation error',
                'errors' => $e->errors()
            ], 422);
        } catch (\Exception $e) {
            Log::error('Error retrieving customer orders', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::guard('customer_user')->id(),
                'customer_id' => Auth::guard('customer_user')->user()->customer_id ?? null,
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving your orders. Please try again later.'
            ], 500);
        }
    }

    /**
     * Get single order details
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function show(Request $request, $id)
    {
        try {
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                return response()->json(['message' => 'Invalid order ID'], 422);
            }

            // Get authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            $customer = $user->customer;

            // Find order with security check for customer ownership
            $order = MarketOrder::where('customer_id', $customer->id)
                ->with(['items' => function($query) {
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price', 'subtotal', 'unit_type', 'is_wholesale', 'discount_amount', 'notes', 'unit_id', 'unit_amount', 'unit_name', 'created_at', 'updated_at');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode');
                }])
                ->findOrFail($id);

            // Get stock information from customer_stock_product_movements
            $order->items->each(function($item) use ($customer) {
                $stockInfo = DB::table('customer_stock_product_movements')
                    ->where('customer_id', $customer->id)
                    ->where('product_id', $item->product_id)
                    ->first();
                
                $item->product->current_stock = $stockInfo ? $stockInfo->net_quantity : 0;
            });

            return response()->json($order);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving order details', [
                'order_id' => $id,
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving the order details.'
            ], 500);
        }
    }

    /**
     * Get order status
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderStatus(Request $request, $id)
    {
        try {
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                return response()->json(['message' => 'Invalid order ID'], 422);
            }

            // Get authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            $customer = $user->customer;

            $order = MarketOrder::where('customer_id', $customer->id)
                ->select('id', 'order_status')
                ->findOrFail($id);

            return response()->json([
                'status' => $order->order_status
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving order status', [
                'order_id' => $id,
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving the order status.'
            ], 500);
        }
    }

    /**
     * Get order items
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderItems(Request $request, $id)
    {
        try {
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                return response()->json(['message' => 'Invalid order ID'], 422);
            }

            // Get authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            $customer = $user->customer;

            $order = MarketOrder::where('customer_id', $customer->id)
                ->with(['items' => function($query) {
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price', 'subtotal', 'unit_type', 'is_wholesale', 'discount_amount', 'notes', 'unit_id', 'unit_amount', 'unit_name', 'created_at', 'updated_at');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name');
                }])
                ->findOrFail($id);

            $items = $order->items->map(function($item) use ($customer) {
                // Get stock information from customer_stock_product_movements
                $stockInfo = DB::table('customer_stock_product_movements')
                    ->where('customer_id', $customer->id)
                    ->where('product_id', $item->product_id)
                    ->first();

                return [
                    'id' => $item->id,
                    'market_order_id' => $item->market_order_id,
                    'product_id' => $item->product_id,
                    'quantity' => (float)$item->quantity,
                    'unit_price' => (float)$item->unit_price,
                    'subtotal' => (float)$item->subtotal,
                    'unit_type' => $item->unit_type,
                    'is_wholesale' => (bool)$item->is_wholesale,
                    'discount_amount' => (float)($item->discount_amount ?? 0),
                    'notes' => $item->notes,
                    'unit_id' => $item->unit_id,
                    'unit_amount' => (float)($item->unit_amount ?? 1),
                    'unit_name' => $item->unit_name,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
                    'product' => [
                        'name' => htmlspecialchars($item->product->name),
                        'current_stock' => $stockInfo ? (int)$stockInfo->net_quantity : 0
                    ]
                ];
            });

            return response()->json($items);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving order items', [
                'order_id' => $id,
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving the order items.'
            ], 500);
        }
    }

    /**
     * Get detailed order information
     *
     * @param int $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getOrderDetails(Request $request, $id)
    {
        try {
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                return response()->json(['message' => 'Invalid order ID'], 422);
            }

            // Get authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
            $customer = $user->customer;

            $order = MarketOrder::where('customer_id', $customer->id)
                ->with(['items' => function($query) {
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price', 'subtotal', 'unit_type', 'is_wholesale', 'discount_amount', 'notes', 'unit_id', 'unit_amount', 'unit_name', 'created_at', 'updated_at');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode');
                }])
                ->findOrFail($id);

            // Get stock information from customer_stock_product_movements
            $order->items->each(function($item) use ($customer) {
                $stockInfo = DB::table('customer_stock_product_movements')
                    ->where('customer_id', $customer->id)
                    ->where('product_id', $item->product_id)
                    ->first();
                
                $item->product->current_stock = $stockInfo ? $stockInfo->net_quantity : 0;
            });

            // Calculate values with proper type casting
            $totalAmount = (float)$order->total_amount;
            $tax = (float)($order->tax_amount ?? 0);
            $subtotal = $totalAmount - $tax;

            return response()->json([
                'order' => $order,
                'subtotal' => number_format($subtotal, 2),
                'tax' => number_format($tax, 2),
                'total' => number_format($totalAmount, 2),
                'is_paid' => (bool)($order->payment_status === 'paid'),
                'order_number' => $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT)
            ]);
        } catch (ModelNotFoundException $e) {
            return response()->json(['message' => 'Order not found'], 404);
        } catch (\Exception $e) {
            Log::error('Error retrieving order details', [
                'order_id' => $id,
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving the order details.'
            ], 500);
        }
    }

    /**
     * Generate thermal print view for an order
     *
     * @param int $id
     * @return \Illuminate\View\View
     */
    public function thermalPrint(Request $request, $id)
    {
        try {
            // Validate ID parameter
            if (!is_numeric($id) || $id <= 0) {
                abort(404);
            }

            // Get authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                abort(403);
            }
            $customer = $user->customer;

            $order = MarketOrder::where('customer_id', $customer->id)
                ->with(['items' => function($query) {
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price', 'subtotal', 'unit_type', 'is_wholesale', 'discount_amount', 'notes', 'unit_id', 'unit_amount', 'unit_name', 'created_at', 'updated_at');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode');
                }])
                ->findOrFail($id);

            // Format order number safely
            $orderNumber = $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT);

            // Calculate values with proper type casting
            $totalAmount = (float)$order->total_amount;
            $tax = (float)($order->tax_amount ?? 0);
            $subtotal = $totalAmount - $tax;

            return view('customer.orders.thermal-print', [
                'order' => $order,
                'orderNumber' => $orderNumber,
                'subtotal' => number_format($subtotal, 2),
                'tax' => number_format($tax, 2),
                'total' => number_format($totalAmount, 2)
            ]);
        } catch (ModelNotFoundException $e) {
            abort(404);
        } catch (\Exception $e) {
            Log::error('Error generating thermal print', [
                'order_id' => $id,
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            abort(500);
        }
    }

    /**
     * Get filter options for orders
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getFilterOptions(Request $request)
    {
        try {
            // Get the authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $customer = $user->customer;

            // Get available order statuses
            $orderStatuses = MarketOrder::where('customer_id', $customer->id)
                ->distinct()
                ->pluck('order_status')
                ->filter()
                ->values();

            // Get available payment statuses
            $paymentStatuses = MarketOrder::where('customer_id', $customer->id)
                ->distinct()
                ->pluck('payment_status')
                ->filter()
                ->values();

            // Get amount range
            $amountRange = MarketOrder::where('customer_id', $customer->id)
                ->selectRaw('MIN(total_amount) as min_amount, MAX(total_amount) as max_amount')
                ->first();

            // Get date range
            $dateRange = MarketOrder::where('customer_id', $customer->id)
                ->selectRaw('MIN(created_at) as earliest_date, MAX(created_at) as latest_date')
                ->first();

            // Get popular products (top 10)
            $popularProducts = MarketOrder::where('customer_id', $customer->id)
                ->with(['items.product:id,name,barcode'])
                ->get()
                ->flatMap(function($order) {
                    return $order->items->map(function($item) {
                        return [
                            'id' => $item->product->id ?? null,
                            'name' => $item->product->name ?? 'Unknown Product',
                            'barcode' => $item->product->barcode ?? null
                        ];
                    });
                })
                ->groupBy('id')
                ->map(function($group) {
                    return [
                        'id' => $group->first()['id'],
                        'name' => $group->first()['name'],
                        'barcode' => $group->first()['barcode'],
                        'order_count' => $group->count()
                    ];
                })
                ->sortByDesc('order_count')
                ->take(10)
                ->values();

            return response()->json([
                'order_statuses' => $orderStatuses,
                'payment_statuses' => $paymentStatuses,
                'amount_range' => [
                    'min' => $amountRange->min_amount ?? 0,
                    'max' => $amountRange->max_amount ?? 0
                ],
                'date_range' => [
                    'earliest' => $dateRange->earliest_date ?? null,
                    'latest' => $dateRange->latest_date ?? null
                ],
                'popular_products' => $popularProducts,
                'sort_options' => [
                    ['value' => 'id', 'label' => 'Order ID'],
                    ['value' => 'created_at', 'label' => 'Date Created'],
                    ['value' => 'total_amount', 'label' => 'Total Amount'],
                    ['value' => 'order_status', 'label' => 'Order Status'],
                    ['value' => 'payment_status', 'label' => 'Payment Status']
                ],
                'per_page_options' => [5, 10, 15, 20, 25, 50]
            ]);
        } catch (\Exception $e) {
            Log::error('Error retrieving filter options', [
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while retrieving filter options.'
            ], 500);
        }
    }

    /**
     * Clear all filters and reset to default state
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function clearFilters(Request $request)
    {
        try {
            // Get the authenticated customer
            $user = Auth::guard('customer_user')->user();
            if (!$user || !$user->customer) {
                return response()->json(['message' => 'Unauthorized'], 401);
            }

            $customer = $user->customer;

            // Get default stats (no filters)
            $stats = [
                'total_orders' => MarketOrder::where('customer_id', $customer->id)->count(),
                'total_amount' => MarketOrder::where('customer_id', $customer->id)->sum('total_amount'),
                'average_amount' => MarketOrder::where('customer_id', $customer->id)->avg('total_amount') ?? 0,
                'pending_orders' => MarketOrder::where('customer_id', $customer->id)->where('order_status', 'pending')->count(),
                'processing_orders' => MarketOrder::where('customer_id', $customer->id)->where('order_status', 'processing')->count(),
                'completed_orders' => MarketOrder::where('customer_id', $customer->id)->where('order_status', 'completed')->count(),
                'cancelled_orders' => MarketOrder::where('customer_id', $customer->id)->where('order_status', 'cancelled')->count(),
                'paid_orders' => MarketOrder::where('customer_id', $customer->id)->where('payment_status', 'paid')->count(),
                'partial_orders' => MarketOrder::where('customer_id', $customer->id)->where('payment_status', 'partial')->count(),
                'pending_payment_orders' => MarketOrder::where('customer_id', $customer->id)->where('payment_status', 'pending')->count(),
            ];

            return response()->json([
                'message' => 'Filters cleared successfully',
                'stats' => $stats,
                'filters' => [
                    'active' => [],
                    'applied' => false,
                    'total_applied' => 0
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error clearing filters', [
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'ip' => $request->ip(),
            ]);

            return response()->json([
                'message' => 'An error occurred while clearing filters.'
            ], 500);
        }
    }
}