<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MarketOrder;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Carbon\Carbon;
use Inertia\Inertia;

class CustomerOrderController extends Controller
{
    public function view(Request $request){
        return Inertia::render('Customer/Orders/Index');
    }
    
    public function index(Request $request)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $query = MarketOrder::where('customer_id', $customer->id)
            ->with(['items.product']);

        // Apply search filter for order number
        if ($request->has('search')) {
            $query->where(function($q) use ($request) {
                $q->where('id', 'like', '%' . $request->search . '%')
                  ->orWhere('total_amount', 'like', '%' . $request->search . '%');
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->status !== 'all') {
            $query->where('order_status', $request->status);
        }

        // Apply date range filter
        if ($request->has('dateRange') && $request->dateRange !== 'all') {
            switch ($request->dateRange) {
                case 'today':
                    $query->whereDate('created_at', Carbon::today());
                    break;
                case 'week':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfWeek(),
                        Carbon::now()->endOfWeek()
                    ]);
                    break;
                case 'month':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfMonth(),
                        Carbon::now()->endOfMonth()
                    ]);
                    break;
                case 'year':
                    $query->whereBetween('created_at', [
                        Carbon::now()->startOfYear(),
                        Carbon::now()->endOfYear()
                    ]);
                    break;
            }
        }

        // Apply sorting
        $sortField = $request->input('sortField', 'created_at');
        $sortDirection = $request->input('sortDirection', 'desc');

        if ($sortField === 'total_amount') {
            $query->orderByRaw('CAST(total_amount AS DECIMAL(10,2)) ' . $sortDirection);
        } else {
            $query->orderBy($sortField, $sortDirection);
        }

        // Pagination - 4 items per page
        $perPage = 4;
        $page = $request->input('page', 1);
        $paginatedOrders = $query->paginate($perPage, ['*'], 'page', $page);

        // Get all orders (without pagination) for stats calculation
        $allOrders = MarketOrder::where('customer_id', $customer->id)->get();
        
        // Calculate stats
        $stats = [
            'total_orders' => $allOrders->count(),
            'total_amount' => $allOrders->sum('total_amount'),
            'pending_orders' => $allOrders->where('order_status', 'pending')->count(),
            'completed_orders' => $allOrders->where('order_status', 'completed')->count(),
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
    }

    public function show($id)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $order = MarketOrder::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->findOrFail($id);

        return response()->json($order);
    }

    public function getOrderStatus($id)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $order = MarketOrder::where('customer_id', $customer->id)->findOrFail($id);
        
        return response()->json([
            'status' => $order->order_status
        ]);
    }

    public function getOrderItems($id)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $order = MarketOrder::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->findOrFail($id);
        
        $items = $order->items->map(function($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->unit_price,
                'product' => [
                    'name' => $item->product->name,
                    'stock' => $item->product->stock
                ]
            ];
        });

        return response()->json($items);
    }

    public function getOrderDetails($id)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $order = MarketOrder::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->findOrFail($id);
        
        return response()->json([
            'order' => $order,
            'subtotal' => number_format($order->total_amount - ($order->tax ?? 0), 2),
            'tax' => number_format($order->tax ?? 0, 2),
            'total' => number_format($order->total_amount, 2),
            'is_paid' => $order->is_paid,
            'order_number' => $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT)
        ]);
    }
    
    public function thermalPrint($id)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $order = MarketOrder::where('customer_id', $customer->id)
            ->with(['items.product'])
            ->findOrFail($id);
            
        $orderNumber = $order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT);
        
        return view('customer.orders.thermal-print', [
            'order' => $order,
            'orderNumber' => $orderNumber,
            'subtotal' => number_format($order->total_amount - ($order->tax ?? 0), 2),
            'tax' => number_format($order->tax ?? 0, 2),
            'total' => number_format($order->total_amount, 2)
        ]);
    }
} 