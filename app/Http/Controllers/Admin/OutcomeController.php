<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WarehouseOutcome;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class OutcomeController extends Controller
{
    /**
     * Display a listing of warehouse outcome records.
     */
    public function index(Request $request)
    {
        $query = WarehouseOutcome::with(['warehouse', 'product']);

        // Filter by warehouse if specified
        if ($request->filled('warehouse_id')) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Enhanced search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhereHas('warehouse', function ($warehouseQuery) use ($search) {
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
        $allowedSortFields = ['id', 'reference_number', 'total', 'quantity', 'price', 'created_at'];
        if (!in_array($sortField, $allowedSortFields)) {
            $sortField = 'created_at';
        }
        
        $query->orderBy($sortField, $sortDirection);

        // Enhanced pagination
        $perPage = $request->get('per_page', 15);   
        $perPage = in_array($perPage, [10, 15, 25, 50, 100]) ? $perPage : 15;
        
        $outcomes = $query->paginate($perPage);

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

        $totalOutcomes = WarehouseOutcome::count();
        $totalAmount = WarehouseOutcome::sum('total');
        $totalQuantity = WarehouseOutcome::sum('quantity');
        
        $todayOutcomes = WarehouseOutcome::whereDate('created_at', $today)->count();
        $todayAmount = WarehouseOutcome::whereDate('created_at', $today)->sum('total');
        
        $weekOutcomes = WarehouseOutcome::where('created_at', '>=', $thisWeek)->count();
        $weekAmount = WarehouseOutcome::where('created_at', '>=', $thisWeek)->sum('total');
        
        $monthOutcomes = WarehouseOutcome::where('created_at', '>=', $thisMonth)->count();
        $monthAmount = WarehouseOutcome::where('created_at', '>=', $thisMonth)->sum('total');

        // Top products by outcome
        $topProducts = WarehouseOutcome::with('product')
            ->selectRaw('product_id, COUNT(*) as outcome_count, SUM(total) as total_amount, SUM(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product->name ?? 'Unknown',
                    'outcome_count' => $item->outcome_count,
                    'total_amount' => $item->total_amount,
                    'total_quantity' => $item->total_quantity,
                ];
            });

        return Inertia::render('Admin/Warehouse/OutcomeIndex', [
            'outcomes' => $outcomes,
            'warehouses' => $warehouses,
            'products' => $products,
            'filters' => $request->only([
                'search', 'warehouse_id', 'product_id', 'date_from', 'date_to', 
                'min_amount', 'max_amount', 'per_page'
            ]),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection,
            ],
            'stats' => [
                'total_outcomes' => $totalOutcomes,
                'total_amount' => $totalAmount,
                'total_quantity' => $totalQuantity,
                'today_outcomes' => $todayOutcomes,
                'today_amount' => $todayAmount,
                'week_outcomes' => $weekOutcomes,
                'week_amount' => $weekAmount,
                'month_outcomes' => $monthOutcomes,
                'month_amount' => $monthAmount,
                'top_products' => $topProducts,
            ],
            'can' => [
                'view_any_warehouse_outcome' => true, // $request->user()->can('view_any_warehouse_outcome'),
                'view_warehouse_outcome' => true, // $request->user()->can('view_warehouse_outcome'),
                'create_warehouse_outcome' => true, // $request->user()->can('create_warehouse_outcome'),
                'update_warehouse_outcome' => true, // $request->user()->can('update_warehouse_outcome'),
                'delete_warehouse_outcome' => true, // $request->user()->can('delete_warehouse_outcome'),
                'export_warehouse_outcome' => true, // $request->user()->can('export_warehouse_outcome'),
            ],
        ]);
    }
} 