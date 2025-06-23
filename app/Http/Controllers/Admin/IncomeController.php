<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WarehouseIncome;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Carbon\Carbon;

class IncomeController extends Controller
{
    /**
     * Display a listing of warehouse income records.
     */
    public function index(Request $request)
    {
        $query = WarehouseIncome::with(['warehouse', 'product']);

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
        
        $incomes = $query->paginate($perPage);

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

        $totalIncomes = WarehouseIncome::count();
        $totalAmount = WarehouseIncome::sum('total');
        $totalQuantity = WarehouseIncome::sum('quantity');
        
        $todayIncomes = WarehouseIncome::whereDate('created_at', $today)->count();
        $todayAmount = WarehouseIncome::whereDate('created_at', $today)->sum('total');
        
        $weekIncomes = WarehouseIncome::where('created_at', '>=', $thisWeek)->count();
        $weekAmount = WarehouseIncome::where('created_at', '>=', $thisWeek)->sum('total');
        
        $monthIncomes = WarehouseIncome::where('created_at', '>=', $thisMonth)->count();
        $monthAmount = WarehouseIncome::where('created_at', '>=', $thisMonth)->sum('total');

        // Top products by income
        $topProducts = WarehouseIncome::with('product')
            ->selectRaw('product_id, COUNT(*) as income_count, SUM(total) as total_amount, SUM(quantity) as total_quantity')
            ->groupBy('product_id')
            ->orderBy('total_amount', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($item) {
                return [
                    'product_name' => $item->product->name ?? 'Unknown',
                    'income_count' => $item->income_count,
                    'total_amount' => $item->total_amount,
                    'total_quantity' => $item->total_quantity,
                ];
            });

        return Inertia::render('Admin/Warehouse/IncomeIndex', [
            'incomes' => $incomes,
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
                'total_incomes' => $totalIncomes,
                'total_amount' => $totalAmount,
                'total_quantity' => $totalQuantity,
                'today_incomes' => $todayIncomes,
                'today_amount' => $todayAmount,
                'week_incomes' => $weekIncomes,
                'week_amount' => $weekAmount,
                'month_incomes' => $monthIncomes,
                'month_amount' => $monthAmount,
                'top_products' => $topProducts,
            ],
            'can' => [
                'view_any_warehouse_income' => true, // $request->user()->can('view_any_warehouse_income'),
                'view_warehouse_income' => true, // $request->user()->can('view_warehouse_income'),
                'create_warehouse_income' => true, // $request->user()->can('create_warehouse_income'),
                'update_warehouse_income' => true, // $request->user()->can('update_warehouse_income'),
                'delete_warehouse_income' => true, // $request->user()->can('delete_warehouse_income'),
                'export_warehouse_income' => true, // $request->user()->can('export_warehouse_income'),
            ],
        ]);
    }
} 