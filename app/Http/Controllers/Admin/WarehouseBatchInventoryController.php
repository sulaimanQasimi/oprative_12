<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\WarehouseBatchInventory;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;

class WarehouseBatchInventoryController extends Controller
{
    /**
     * Display warehouse batch inventory.
     */
    public function index(Request $request)
    {
        $query = WarehouseBatchInventory::with(['product', 'warehouse', 'batch']);

        // Filter by warehouse
        if ($request->filled('warehouse_id')) {
            $query->forWarehouse($request->warehouse_id);
        }

        // Filter by product
        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        // Filter by expiry status
        if ($request->filled('expiry_status')) {
            switch ($request->expiry_status) {
                case 'expired':
                    $query->expired();
                    break;
                case 'expiring_soon':
                    $query->expiringSoon();
                    break;
                case 'valid':
                    $query->valid();
                    break;
            }
        }

        // Filter by stock status
        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'with_stock') {
                $query->withStock();
            } elseif ($request->stock_status === 'no_stock') {
                $query->where('remaining_qty', '<=', 0);
            }
        }

        // Search by batch reference or product name
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('batch_reference', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('product_barcode', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'expire_date');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        $allowedSorts = ['expire_date', 'batch_reference', 'product_name', 'warehouse_name', 'remaining_qty', 'days_to_expiry'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $inventory = $query->paginate(50)->withQueryString();

        // Get filter options
        $warehouses = Warehouse::select('id', 'name')->orderBy('name')->get();
        $products = Product::select('id', 'name')->orderBy('name')->get();

        // Get summary statistics
        $stats = $this->getInventoryStats($request);

        return Inertia::render('Admin/WarehouseBatchInventory/Index', [
            'inventory' => $inventory,
            'warehouses' => $warehouses,
            'products' => $products,
            'stats' => $stats,
            'filters' => $request->only(['warehouse_id', 'product_id', 'expiry_status', 'stock_status', 'search', 'sort_by', 'sort_direction'])
        ]);
    }

    /**
     * Display warehouse-specific batch inventory.
     */
    public function warehouse(Request $request, Warehouse $warehouse)
    {
        $query = WarehouseBatchInventory::with(['product', 'batch'])
            ->forWarehouse($warehouse->id);

        // Apply same filters as index
        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        if ($request->filled('expiry_status')) {
            switch ($request->expiry_status) {
                case 'expired':
                    $query->expired();
                    break;
                case 'expiring_soon':
                    $query->expiringSoon();
                    break;
                case 'valid':
                    $query->valid();
                    break;
            }
        }

        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'with_stock') {
                $query->withStock();
            } elseif ($request->stock_status === 'no_stock') {
                $query->where('remaining_qty', '<=', 0);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('batch_reference', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('product_barcode', 'like', "%{$search}%");
            });
        }

        // Sort
        $sortBy = $request->get('sort_by', 'expire_date');
        $sortDirection = $request->get('sort_direction', 'asc');
        
        $allowedSorts = ['expire_date', 'batch_reference', 'product_name', 'remaining_qty', 'days_to_expiry'];
        if (in_array($sortBy, $allowedSorts)) {
            $query->orderBy($sortBy, $sortDirection);
        }

        $inventory = $query->paginate(50)->withQueryString();

        // Get products for this warehouse
        $products = Product::select('id', 'name')
            ->whereHas('batches.warehouseIncomes', function ($q) use ($warehouse) {
                $q->where('warehouse_id', $warehouse->id);
            })
            ->orderBy('name')
            ->get();

        // Get warehouse-specific stats
        $stats = $this->getWarehouseStats($warehouse->id, $request);

        return Inertia::render('Admin/WarehouseBatchInventory/Warehouse', [
            'warehouse' => $warehouse,
            'inventory' => $inventory,
            'products' => $products,
            'stats' => $stats,
            'filters' => $request->only(['product_id', 'expiry_status', 'stock_status', 'search', 'sort_by', 'sort_direction'])
        ]);
    }

    /**
     * Get inventory statistics.
     */
    protected function getInventoryStats(Request $request)
    {
        $query = WarehouseBatchInventory::query();

        // Apply same filters
        if ($request->filled('warehouse_id')) {
            $query->forWarehouse($request->warehouse_id);
        }

        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('batch_reference', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('product_barcode', 'like', "%{$search}%");
            });
        }

        return [
            'total_batches' => $query->count(),
            'batches_with_stock' => $query->clone()->withStock()->count(),
            'expired_batches' => $query->clone()->expired()->count(),
            'expiring_soon_batches' => $query->clone()->expiringSoon()->count(),
            'total_remaining_qty' => $query->sum('remaining_qty'),
            'total_income_value' => $query->sum('total_income_value'),
            'total_outcome_value' => $query->sum('total_outcome_value'),
        ];
    }

    /**
     * Get warehouse-specific statistics.
     */
    protected function getWarehouseStats($warehouseId, Request $request)
    {
        $query = WarehouseBatchInventory::forWarehouse($warehouseId);

        // Apply filters
        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('batch_reference', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('product_barcode', 'like', "%{$search}%");
            });
        }

        return [
            'total_batches' => $query->count(),
            'batches_with_stock' => $query->clone()->withStock()->count(),
            'expired_batches' => $query->clone()->expired()->count(),
            'expiring_soon_batches' => $query->clone()->expiringSoon()->count(),
            'total_remaining_qty' => $query->sum('remaining_qty'),
            'total_income_value' => $query->sum('total_income_value'),
            'total_outcome_value' => $query->sum('total_outcome_value'),
        ];
    }

    /**
     * Export inventory data.
     */
    public function export(Request $request)
    {
        $query = WarehouseBatchInventory::with(['product', 'warehouse', 'batch']);

        // Apply filters (same as index)
        if ($request->filled('warehouse_id')) {
            $query->forWarehouse($request->warehouse_id);
        }

        if ($request->filled('product_id')) {
            $query->forProduct($request->product_id);
        }

        if ($request->filled('expiry_status')) {
            switch ($request->expiry_status) {
                case 'expired':
                    $query->expired();
                    break;
                case 'expiring_soon':
                    $query->expiringSoon();
                    break;
                case 'valid':
                    $query->valid();
                    break;
            }
        }

        if ($request->filled('stock_status')) {
            if ($request->stock_status === 'with_stock') {
                $query->withStock();
            } elseif ($request->stock_status === 'no_stock') {
                $query->where('remaining_qty', '<=', 0);
            }
        }

        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('batch_reference', 'like', "%{$search}%")
                  ->orWhere('product_name', 'like', "%{$search}%")
                  ->orWhere('product_barcode', 'like', "%{$search}%");
            });
        }

        $inventory = $query->orderBy('expire_date', 'asc')->get();

        $csvData = "Batch Reference,Product Name,Product Barcode,Warehouse,Issue Date,Expire Date,Expiry Status,Days to Expiry,Income Qty,Outcome Qty,Remaining Qty,Income Value,Outcome Value\n";

        foreach ($inventory as $item) {
            $csvData .= "\"{$item->batch_reference}\",";
            $csvData .= "\"{$item->product_name}\",";
            $csvData .= "\"{$item->product_barcode}\",";
            $csvData .= "\"{$item->warehouse_name}\",";
            $csvData .= "\"{$item->issue_date}\",";
            $csvData .= "\"{$item->expire_date}\",";
            $csvData .= "\"{$item->formatted_expiry_status}\",";
            $csvData .= "\"{$item->days_to_expiry}\",";
            $csvData .= "\"{$item->income_qty}\",";
            $csvData .= "\"{$item->outcome_qty}\",";
            $csvData .= "\"{$item->remaining_qty}\",";
            $csvData .= "\"{$item->total_income_value}\",";
            $csvData .= "\"{$item->total_outcome_value}\"\n";
        }

        $filename = 'warehouse_batch_inventory_' . now()->format('Y-m-d_H-i-s') . '.csv';

        return response($csvData)
            ->header('Content-Type', 'text/csv')
            ->header('Content-Disposition', 'attachment; filename="' . $filename . '"');
    }
} 