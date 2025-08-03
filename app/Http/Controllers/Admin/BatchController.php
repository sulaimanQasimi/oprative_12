<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, Product, Batch, WarehouseTransfer, TransferItem, WarehouseIncome, WarehouseOutcome};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

class BatchController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = Batch::with(['product']);

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%")
                        ->orWhere('barcode', 'like', "%{$search}%")
                        ->orWhereHas('product', function ($productQuery) use ($search) {
                            $productQuery->where('name', 'like', "%{$search}%")
                                ->orWhere('barcode', 'like', "%{$search}%");
                        })
                        ;
                });
            }

            // Apply date filters
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Apply product filter
            if ($request->filled('product_id')) {
                $query->where('product_id', $request->product_id);
            }

            // Apply supplier filter
            if ($request->filled('supplier_id')) {
                $query->whereHas('purchase', function ($q) use ($request) {
                    $q->where('supplier_id', $request->supplier_id);
                });
            }


            // Apply sorting
            $sortBy = $request->get('sort', 'created_at');
            $direction = $request->get('direction', 'desc');
            $allowedSorts = ['created_at', 'reference_number', 'expire_date', 'quantity', 'unit_amount', 'id'];
            if (!in_array($sortBy, $allowedSorts)) {
                $sortBy = 'created_at';
            }
            if (!in_array($direction, ['asc', 'desc'])) {
                $direction = 'desc';
            }
            $query->orderBy($sortBy, $direction);

            // Get per page value
            $perPage = $request->get('per_page', 15);
            if (!in_array($perPage, [10, 15, 25, 50, 100])) {
                $perPage = 15;
            }

            // Paginate results
            $batchRecords = $query->paginate($perPage);

            // Transform the data
            $batches = $batchRecords->map(function ($batchRecord) {
                return [
                    'id' => $batchRecord->id,
                    'reference_number' => $batchRecord->reference_number,
                    'product' => [
                        'id' => $batchRecord->product->id,
                        'name' => $batchRecord->product->name,
                        'barcode' => $batchRecord->product->barcode,
                        'type' => $batchRecord->product->type,
                    ],
                    'remaining_warehouse' => $batchRecord->warehouseProducts->sum('remaining_qty'),
                    'remaining_customer' => $batchRecord->customerStockProducts->sum('remaining_qty'),
                    'quantity' => $batchRecord->quantity,
                    'unit_type' => $batchRecord->unit_type,
                    'unit_name' => $batchRecord->unit_name,
                    'unit_amount' => $batchRecord->unit_amount,
                    'expire_date' => $batchRecord->expire_date,
                    'manufacture_date' => $batchRecord->issue_date,
                    'is_active' => $batchRecord->expire_date ? ($batchRecord->expire_date > now()) : true,
                    'notes' => $batchRecord->notes,
                    'created_at' => $batchRecord->created_at,
                    'updated_at' => $batchRecord->updated_at,
                ];
            });

            // Get available warehouses for filter
            $availableWarehouses = Warehouse::where('is_active', true)
                ->get(['id', 'name']);

            // Get available products for filter
            $availableProducts = Product::select('id', 'name', 'barcode', 'type')->get();

            // Get available suppliers for filter
            $availableSuppliers = \App\Models\Supplier::select('id', 'name')->get();

            // Calculate statistics
            $stats = [
                'total_batches' => $batchRecords->total(),
                'total_quantity' => $batchRecords->sum('quantity'),
                'active_batches' => $batchRecords->where(function ($q) {
                    $q->whereNull('expire_date')->orWhere('expire_date', '>', now());
                })->count(),
                'expired_batches' => $batchRecords->where('expire_date', '<=', now())->count(),
                'expiring_soon' => $batchRecords->where('expire_date', '>', now())
                    ->where('expire_date', '<=', now()->addDays(30))->count(),
            ];

            return Inertia::render('Admin/Warehouse/BatchIndex', [
                'batches' => $batches,
                'pagination' => [
                    'current_page' => $batchRecords->currentPage(),
                    'last_page' => $batchRecords->lastPage(),
                    'per_page' => $batchRecords->perPage(),
                    'total' => $batchRecords->total(),
                    'from' => $batchRecords->firstItem(),
                    'to' => $batchRecords->lastItem(),
                ],
                'filters' => [
                    'search' => $request->search,
                    'date_from' => $request->date_from,
                    'date_to' => $request->date_to,
                    'warehouse_id' => $request->warehouse_id,
                    'product_id' => $request->product_id,
                    'supplier_id' => $request->supplier_id,
                    'status' => $request->status,
                    'sort' => $sortBy,
                    'direction' => $direction,
                    'per_page' => $perPage,
                ],
                'availableWarehouses' => $availableWarehouses,
                'availableProducts' => $availableProducts,
                'availableSuppliers' => $availableSuppliers,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading batches: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading batches');
        }
    }

    public function showBatch(Batch $batch)
    {
        try {
            $batch->load([
                'product',
                'purchase.supplier',
                'purchase.warehouse',
                'warehouseIncomes.warehouse',
                'warehouseOutcomes.warehouse',
                'warehouseProducts.warehouse',
                'customerStockProducts.customer'
            ]);

            // Get warehouse batch inventory data
            $warehouseInventory = $batch->warehouseProducts->map(function ($item) {
                return [
                    'warehouse_id' => $item->warehouse->id,
                        'warehouse_name' => $item->warehouse->name,
                        'income_qty' => $item->income_qty,
                        'outcome_qty' => $item->outcome_qty,
                        'remaining_qty' => $item->remaining_qty,
                        'total_income_value' => $item->total_income_value,
                        'total_outcome_value' => $item->total_outcome_value,
                        'expiry_status' => $item->expiry_status,
                        'days_to_expiry' => $item->days_to_expiry,
                    ];
                });

            // Get customer inventory data
            $customerInventory =$batch->customerStockProducts->map(function ($item) {
                return [
                    'id' => $item->id,
                    'customer_id' => $item->customer_id,
                    'customer_name' => $item->customer->name,
                    'customer_code' => $item->customer->code,
                    'quantity' => $item->quantity,
                    'remaining_quantity' => $item->remaining_qty,
                    'price' => $item->price,
                    'total' => $item->total,
                    'created_at' => $item->created_at,
                ];
            });
            // Calculate summary statistics
            $totalWarehouseRemaining = $warehouseInventory->sum('remaining_qty');
            $totalCustomerRemaining = $customerInventory->sum('remaining_quantity');
            $totalWarehouseValue = $warehouseInventory->sum('total_income_value') - $warehouseInventory->sum('total_outcome_value');
            $totalCustomerValue = $customerInventory->sum('total');

            return Inertia::render('Admin/Warehouse/ShowBatch', [
                'batch' => [
                    'id' => $batch->id,
                    'reference_number' => $batch->reference_number,
                    'product' => [
                        'id' => $batch->product->id,
                        'name' => $batch->product->name,
                        'barcode' => $batch->product->barcode,
                        'type' => $batch->product->type,
                    ],
                    'warehouse' => $batch->purchase && $batch->purchase->warehouse ? [
                        'id' => $batch->purchase->warehouse->id,
                        'name' => $batch->purchase->warehouse->name,
                        'code' => $batch->purchase->warehouse->code,
                    ] : null,
                    'supplier' => $batch->purchase && $batch->purchase->supplier ? [
                        'id' => $batch->purchase->supplier->id,
                        'name' => $batch->purchase->supplier->name,
                        'code' => $batch->purchase->supplier->code,
                    ] : null,
                    'quantity' => $batch->quantity,
                    'unit_type' => $batch->unit_type,
                    'unit_name' => $batch->unit_name,
                    'unit_amount' => $batch->unit_amount,
                    'expire_date' => $batch->expire_date,
                    'manufacture_date' => $batch->issue_date,
                    'is_active' => $batch->expire_date ? ($batch->expire_date > now()) : true,
                    'notes' => $batch->notes,
                    'purchase_price' => $batch->purchase_price,
                    'wholesale_price' => $batch->wholesale_price,
                    'retail_price' => $batch->retail_price,
                    'total' => $batch->total,
                    'incomes' => $batch->warehouseIncomes->map(function ($income) {
                        return [
                            'id' => $income->id,
                            'reference_number' => $income->reference_number,
                            'warehouse' => [
                                'id' => $income->warehouse->id,
                                'name' => $income->warehouse->name,
                                'code' => $income->warehouse->code,
                            ],
                            'quantity' => $income->quantity,
                            'price' => $income->price,
                            'total' => $income->total,
                            'created_at' => $income->created_at,
                        ];
                    }),
                    'outcomes' => $batch->warehouseOutcomes->map(function ($outcome) {
                        return [
                            'id' => $outcome->id,
                            'reference_number' => $outcome->reference_number,
                            'warehouse' => [
                                'id' => $outcome->warehouse->id,
                                'name' => $outcome->warehouse->name,
                                'code' => $outcome->warehouse->code,
                            ],
                            'quantity' => $outcome->quantity,
                            'price' => $outcome->price,
                            'total' => $outcome->total,
                            'created_at' => $outcome->created_at,
                        ];
                    }),
                    'warehouse_inventory' => $warehouseInventory,
                    'customer_inventory' => $customerInventory,
                    'summary' => [
                        'total_warehouse_remaining' => $totalWarehouseRemaining,
                        'total_customer_remaining' => $totalCustomerRemaining,
                        'total_warehouse_value' => $totalWarehouseValue,
                        'total_customer_value' => $totalCustomerValue,
                        'total_warehouses' => $warehouseInventory->count(),
                        'total_customers' => $customerInventory->count(),
                    ],
                    'created_at' => $batch->created_at,
                    'updated_at' => $batch->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading batch details: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading batch details');
        }
    }

    public function printBatchDocument(Batch $batch)
    {
        try {
            $batch->load([
                'product',
                'purchase.supplier',
                'purchase.warehouse'
            ]);

            return view('warehouse.batch-document', [
                'batch' => $batch,
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating batch document: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error generating batch document');
        }
    }
}