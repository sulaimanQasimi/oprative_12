<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Models\Warehouse;
use Illuminate\Http\Request;
use Inertia\Inertia;

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
        if ($request->has('warehouse_id') && $request->warehouse_id) {
            $query->where('warehouse_id', $request->warehouse_id);
        }

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->whereHas('customer', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            })->orWhereHas('saleItems.product', function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('barcode', 'like', "%{$search}%");
            });
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Sorting
        $sortField = $request->get('sort_field', 'created_at');
        $sortDirection = $request->get('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        $sales = $query->paginate(15)->appends($request->query());

        // Get warehouses for filter dropdown
        $warehouses = Warehouse::where('is_active', true)
            ->orderBy('name')
            ->get(['id', 'name', 'code']);

        // Calculate summary stats
        $totalSales = Sale::count();
        $totalAmount = Sale::sum('total');
        $todaySales = Sale::whereDate('created_at', today())->count();
        $todayAmount = Sale::whereDate('created_at', today())->sum('total');

        return Inertia::render('Admin/Warehouse/SalesIndex', [
            'sales' => $sales,
            'warehouses' => $warehouses,
            'filters' => $request->only(['search', 'warehouse_id', 'date_from', 'date_to', 'status']),
            'sort' => [
                'field' => $sortField,
                'direction' => $sortDirection,
            ],
            'stats' => [
                'total_sales' => $totalSales,
                'total_amount' => $totalAmount,
                'today_sales' => $todaySales,
                'today_amount' => $todayAmount,
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