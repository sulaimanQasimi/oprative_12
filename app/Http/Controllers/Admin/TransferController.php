<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WarehouseTransfer;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class TransferController extends Controller
{
    /**
     * Display a listing of warehouse transfer records.
     */
    public function index(Request $request)
    {
        $query = WarehouseTransfer::with(['fromWarehouse', 'toWarehouse', 'product']);

        // Filter by warehouse if specified
        if ($request->filled('from_warehouse_id')) {
            $query->where('from_warehouse_id', $request->from_warehouse_id);
        }

        if ($request->filled('to_warehouse_id')) {
            $query->where('to_warehouse_id', $request->to_warehouse_id);
        }

        // Enhanced search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhereHas('fromWarehouse', function ($warehouseQuery) use ($search) {
                      $warehouseQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('toWarehouse', function ($warehouseQuery) use ($search) {
                      $warehouseQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('product', function ($productQuery) use ($search) {
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

        // Product filter
        if ($request->filled('product_id')) {
            $query->where('product_id', $request->product_id);
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
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
        $allowedSortFields = ['id', 'reference_number', 'total', 'quantity', 'status', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $query->orderBy($sortField, $sortDirection);

        // Enhanced pagination
        $perPage = $request->get('per_page', 15);   
        $perPage = in_array($perPage, [10, 15, 25, 50, 100]) ? $perPage : 15;
        
        $transfers = $query->paginate($perPage);

        // Get warehouses for filter dropdown
        $warehouses = Warehouse::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        // Get products for filter dropdown
        $products = Product::where('is_activated', true)
            ->select('id', 'name', 'barcode')
            ->orderBy('name')
            ->limit(100)
            ->get();

        // Enhanced summary stats with date ranges
        $today = today();
        $thisWeek = Carbon::now()->startOfWeek();
        $thisMonth = Carbon::now()->startOfMonth();

        $totalTransfers = WarehouseTransfer::count();
        $totalAmount = WarehouseTransfer::sum('total');
        $totalQuantity = WarehouseTransfer::sum('quantity');
        
        $todayTransfers = WarehouseTransfer::whereDate('created_at', $today)->count();
        $todayAmount = WarehouseTransfer::whereDate('created_at', $today)->sum('total');
        
        $weekTransfers = WarehouseTransfer::where('created_at', '>=', $thisWeek)->count();
        $weekAmount = WarehouseTransfer::where('created_at', '>=', $thisWeek)->sum('total');
        
        $monthTransfers = WarehouseTransfer::where('created_at', '>=', $thisMonth)->count();
        $monthAmount = WarehouseTransfer::where('created_at', '>=', $thisMonth)->sum('total');

        // Status breakdown
        $statusStats = WarehouseTransfer::selectRaw('status, COUNT(*) as count, SUM(total) as total_amount')
            ->groupBy('status')
            ->get()
            ->keyBy('status');

        // Top products by transfer
        $topProducts = WarehouseTransfer::with('product')
            ->selectRaw('product_id, COUNT(*) as transfer_count, SUM(total) as total_amount, SUM(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product->name ?? 'Unknown',
                    'transfer_count' => $item->transfer_count,
                    'total_amount' => $item->total_amount,
                    'total_quantity' => $item->total_quantity,
                ];
            });

        return Inertia::render('Admin/Warehouse/TransferIndex', [
            'transfers' => $transfers,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => $request->only([
                'search', 'from_warehouse_id', 'to_warehouse_id', 'product_id', 'status',
                'date_from', 'date_to', 'min_amount', 'max_amount', 'per_page'
            ]),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection,
            ],
            'stats' => [
                'total_transfers' => $totalTransfers,
                'total_amount' => $totalAmount,
                'total_quantity' => $totalQuantity,
                'today_transfers' => $todayTransfers,
                'today_amount' => $todayAmount,
                'week_transfers' => $weekTransfers,
                'week_amount' => $weekAmount,
                'month_transfers' => $monthTransfers,
                'month_amount' => $monthAmount,
                'status_stats' => $statusStats,
                'top_products' => $topProducts,
            ],
            'can' => [
                'view_any_warehouse_transfer' => true, // $request->user()->can('view_any_warehouse_transfer'),
                'view_warehouse_transfer' => true, // $request->user()->can('view_warehouse_transfer'),
                'create_warehouse_transfer' => true, // $request->user()->can('create_warehouse_transfer'),
                'update_warehouse_transfer' => true, // $request->user()->can('update_warehouse_transfer'),
                'delete_warehouse_transfer' => true, // $request->user()->can('delete_warehouse_transfer'),
                'export_warehouse_transfer' => true, // $request->user()->can('export_warehouse_transfer'),
            ],
        ]);
    }
} 