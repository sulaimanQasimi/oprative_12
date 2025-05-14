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
        return Inertia::render('Customer/Orders/Index');
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
                'dateRange' => 'nullable|string|in:all,today,week,month,year',
                'sortField' => 'nullable|string|in:id,created_at,total_amount,order_status',
                'sortDirection' => 'nullable|string|in:asc,desc',
                'page' => 'nullable|integer|min:1',
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
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode');
                }]);

            // Apply search filter for order number or total amount
            if ($request->filled('search')) {
                $search = trim($request->search);
                $query->where(function($q) use ($search) {
                    // Use id directly for numeric search (order ID)
                    if (is_numeric($search)) {
                        $q->where('id', $search);
                    } else {
                        // For other searches, sanitize the input for LIKE queries
                        $searchParam = '%' . addslashes($search) . '%';
                        $q->where('total_amount', 'like', $searchParam);
                    }
                });
            }

            // Apply status filter
            if ($request->filled('status') && $request->status !== 'all') {
                $query->where('order_status', $request->status);
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
            $perPage = 4; // Fixed page size
            $page = (int) $request->input('page', 1);

            $paginatedOrders = $query->paginate($perPage, ['*'], 'page', $page);

            // Get stats efficiently using aggregation queries instead of fetching all orders
            $stats = [
                'total_orders' => MarketOrder::where('customer_id', $customer->id)->count(),
                'total_amount' => MarketOrder::where('customer_id', $customer->id)->sum('total_amount'),
                'pending_orders' => MarketOrder::where('customer_id', $customer->id)
                    ->where('order_status', 'pending')->count(),
                'completed_orders' => MarketOrder::where('customer_id', $customer->id)
                    ->where('order_status', 'completed')->count(),
            ];

            return response()->json([
                'orders' => $paginatedOrders->items(),
                'pagination' => [
                    'total' => $paginatedOrders->total(),
                    'per_page' => $paginatedOrders->perPage(),
                    'current_page' => $paginatedOrders->currentPage(),
                    'last_page' => $paginatedOrders->lastPage(),
                    'from' => $paginatedOrders->firstItem(),
                    'to' => $paginatedOrders->lastItem(),
                ],
                'stats' => $stats
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
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode', 'stock');
                }])
                ->findOrFail($id);

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
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'stock');
                }])
                ->findOrFail($id);

            $items = $order->items->map(function($item) {
                return [
                    'id' => $item->id,
                    'quantity' => (float)$item->quantity,
                    'price' => (float)$item->unit_price,
                    'product' => [
                        'name' => htmlspecialchars($item->product->name),
                        'stock' => (int)$item->product->stock
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
                    $query->select('id', 'market_order_id', 'product_id', 'quantity', 'unit_price');
                }, 'items.product' => function($query) {
                    $query->select('id', 'name', 'barcode', 'stock');
                }])
                ->findOrFail($id);

            // Calculate values with proper type casting
            $totalAmount = (float)$order->total_amount;
            $tax = (float)($order->tax ?? 0);
            $subtotal = $totalAmount - $tax;

            return response()->json([
                'order' => $order,
                'subtotal' => number_format($subtotal, 2),
                'tax' => number_format($tax, 2),
                'total' => number_format($totalAmount, 2),
                'is_paid' => (bool)$order->is_paid,
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
                ->with(['items.product'])
                ->findOrFail($id);

            // Format order number safely
            $orderNumber = $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT);

            // Calculate values with proper type casting
            $totalAmount = (float)$order->total_amount;
            $tax = (float)($order->tax ?? 0);
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
}