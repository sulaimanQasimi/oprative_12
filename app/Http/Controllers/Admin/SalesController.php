<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Warehouse;
use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class SalesController extends Controller
{
    /**
     * Display a listing of sales.
     */
    public function index(Request $request)
    {
        $this->authorize('view_any_sale');

        $query = Sale::with(['customer', 'warehouse', 'saleItems.product']);

        // Filter by warehouse if specified
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Enhanced search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%")
                                   ->orWhere('email', 'like', "%{$search}%")
                                   ->orWhere('phone', 'like', "%{$search}%");
                  })
                  ->orWhereHas('saleItems.product', function ($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('barcode', 'like', "%{$search}%");
                  });
            });
        }

        // Enhanced date filtering
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Customer filter
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Amount range filter
        if ($request->filled('min_amount')) {
            $query->where('total', '>=', $request->min_amount);
        }

        if ($request->filled('max_amount')) {
            $query->where('total', '<=', $request->max_amount);
        }

        // Enhanced sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        
        // Validate sort fields
        $allowedSortFields = ['id', 'reference', 'total', 'status', 'created_at', 'date'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $query->orderBy($sortField, $sortDirection);

        // Enhanced pagination
        $perPage = $request->get('per_page', 15);   
        $perPage = in_array($perPage, [10, 15, 25, 50, 100]) ? $perPage : 15;
        
        $sales = $query->paginate($perPage)->withQueryString()->through(function ($sale) {
            return [
                'id' => $sale->id,
                'reference' => $sale->reference,
                'total' => $sale->total,
                'status' => $sale->status,
                'date' => $sale->date ? $sale->date->format('Y-m-d') : $sale->created_at->format('Y-m-d'),
                'created_at' => $sale->created_at->format('Y-m-d H:i:s'),
                'warehouse_id' => $sale->warehouse_id,
                'customer' => $sale->customer ? [
                    'id' => $sale->customer->id,
                    'name' => $sale->customer->name,
                    'email' => $sale->customer->email,
                    'phone' => $sale->customer->phone,
                ] : null,
                'warehouse' => $sale->warehouse ? [
                    'id' => $sale->warehouse->id,
                    'name' => $sale->warehouse->name,
                    'code' => $sale->warehouse->code,
                ] : null,
                'items_count' => $sale->saleItems->count(),
                'items' => $sale->saleItems->map(function ($item) {
                    return [
                        'id' => $item->id,
                        'quantity' => $item->quantity,
                        'unit_price' => $item->unit_price,
                        'total' => $item->total,
                        'product' => $item->product ? [
                            'id' => $item->product->id,
                            'name' => $item->product->name,
                            'barcode' => $item->product->barcode,
                        ] : null,
                    ];
                }),
            ];
        });

        // Get warehouses for filter dropdown
        $warehouses = Warehouse::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        // Get customers for filter dropdown
        $customers = Customer::select('id', 'name', 'email')
            ->orderBy('name')
            ->limit(100)
            ->get();

        // Enhanced summary stats with date ranges
        $today = today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        $totalSales = Sale::count();
        $totalAmount = Sale::sum('total');
        
        $todaySales = Sale::whereDate('created_at', $today)->count();
        $todayAmount = Sale::whereDate('created_at', $today)->sum('total');
        
        $weekSales = Sale::where('created_at', '>=', $thisWeek)->count();
        $weekAmount = Sale::where('created_at', '>=', $thisWeek)->sum('total');
        
        $monthSales = Sale::where('created_at', '>=', $thisMonth)->count();
        $monthAmount = Sale::where('created_at', '>=', $thisMonth)->sum('total');

        // Status breakdown
        $statusStats = Sale::selectRaw('status, COUNT(*) as count, SUM(total) as amount')
            ->groupBy('status')
            ->get()
            ->pluck(['count', 'amount'], 'status');

        return Inertia::render('Admin/Warehouse/SalesIndex', [
            'sales' => $sales,
            'warehouses' => $warehouses,
            'customers' => $customers,
            'filters' => $request->only([
                'search', 'warehouse_id', 'customer_id', 'date_from', 'date_to', 
                'status', 'min_amount', 'max_amount', 'per_page'
            ]),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection,
            ],
            'stats' => [
                'total_sales' => $totalSales,
                'total_amount' => $totalAmount,
                'today_sales' => $todaySales,
                'today_amount' => $todayAmount,
                'week_sales' => $weekSales,
                'week_amount' => $weekAmount,
                'month_sales' => $monthSales,
                'month_amount' => $monthAmount,
                'status_stats' => $statusStats,
            ],
            'can' => [
                'view_any_sale' => $request->user()->can('view_any_sale'),
                'view_sale' => $request->user()->can('view_sale'),
                'create_sale' => $request->user()->can('create_sale'),
                'update_sale' => $request->user()->can('update_sale'),
                'delete_sale' => $request->user()->can('delete_sale'),
                'export_sale' => $request->user()->can('export_sale'),
            ],
        ]);
    }
} 