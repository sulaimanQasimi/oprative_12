<?php

namespace App\Http\Controllers\Admin\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\WarehouseOutcome;
use Carbon\Carbon;

trait OutcomeController
{
    public function outcome(Warehouse $warehouse, Request $request)
    {
        try {
            // Start with base query
            $query = WarehouseOutcome::where('warehouse_id', $warehouse->id)
                ->with(['product', 'batch']);

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                      ->orWhereHas('product', function($productQuery) use ($search) {
                          $productQuery->where('name', 'like', "%{$search}%")
                                      ->orWhere('barcode', 'like', "%{$search}%");
                      })
                      ->orWhereHas('batch', function($batchQuery) use ($search) {
                          $batchQuery->where('reference_number', 'like', "%{$search}%");
                      });
                });
            }

            // Apply date filter
            if ($request->filled('date')) {
                $query->whereDate('created_at', $request->date);
            }

            // Apply sorting
            $sortBy = $request->get('sort', 'created_at');
            $direction = $request->get('direction', 'desc');
            
            // Validate sort column
            $allowedSorts = ['created_at', 'reference_number', 'total', 'quantity', 'price'];
            if (!in_array($sortBy, $allowedSorts)) {
                $sortBy = 'created_at';
            }

            // Validate direction
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
            $outcomes = $query->paginate($perPage)->withQueryString();

            // Transform the data to include batch information
            $outcomes->getCollection()->transform(function ($outcome) {
                $batchData = null;
                if ($outcome->batch) {
                    $batchData = [
                        'id' => $outcome->batch->id,
                        'reference_number' => $outcome->batch->reference_number,
                        'issue_date' => $outcome->batch->issue_date,
                        'expire_date' => $outcome->batch->expire_date,
                        'notes' => $outcome->batch->notes,
                        'wholesale_price' => $outcome->batch->wholesale_price,
                        'retail_price' => $outcome->batch->retail_price,
                        'purchase_price' => $outcome->batch->purchase_price,
                        'unit_type' => $outcome->batch->unit_type,
                        'unit_id' => $outcome->batch->unit_id,
                        'unit_amount' => $outcome->batch->unit_amount,
                        'unit_name' => $outcome->batch->unit_name,
                        'expiry_status' => $this->calculateExpiryStatus($outcome->batch->expire_date),
                        'days_to_expiry' => $this->calculateDaysToExpiry($outcome->batch->expire_date),
                    ];
                }

                return [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'batch' => $batchData,
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'unit_type' => $outcome->unit_type ?? 'retail',
                    'is_wholesale' => $outcome->is_wholesale ?? false,
                    'unit_id' => $outcome->unit_id,
                    'unit_amount' => $outcome->unit_amount ?? 1,
                    'unit_name' => $outcome->unit_name,
                    'model_type' => $outcome->model_type,
                    'model_id' => $outcome->model_id,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
                ];
            });

            return Inertia::render('Admin/Warehouse/Outcome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'outcomes' => $outcomes,
                'filters' => $request->only(['search', 'date', 'sort', 'direction']),
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse outcome: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse outcome: ' . $e->getMessage());
        }
    }

    private function calculateExpiryStatus($expireDate)
    {
        if (!$expireDate) return 'valid';
        
        $today = Carbon::now()->startOfDay();
        $expiryDate = Carbon::parse($expireDate)->startOfDay();
        $daysDiff = $today->diffInDays($expiryDate, false);
        
        if ($daysDiff < 0) return 'expired';
        if ($daysDiff <= 30) return 'expiring_soon';
        return 'valid';
    }

    private function calculateDaysToExpiry($expireDate)
    {
        if (!$expireDate) return null;
        
        $today = Carbon::now()->startOfDay();
        $expiryDate = Carbon::parse($expireDate)->startOfDay();
        return $today->diffInDays($expiryDate, false);
    }

    public function createOutcome(Warehouse $warehouse)
    {
        try {
            // Get warehouse products directly from WarehouseBatchInventory like SaleController
            $warehouseBatchInventory = \App\Models\WarehouseBatchInventory::forWarehouse($warehouse->id)
                ->withStock()
                ->get()
                ->groupBy('product_id');

            $warehouseProducts = $warehouseBatchInventory->map(function ($productBatches, $productId) {
                // Get the first batch inventory item to access product data
                $firstBatch = $productBatches->first();
                $product = $firstBatch->product;

                // Calculate total stock quantity for this product in this warehouse
                $totalStockQuantity = $productBatches->sum('remaining_qty');

                // Map batches data
                $batches = $productBatches->map(function ($batchInventory) {
                    return [
                        'id' => $batchInventory->batch_id,
                        'reference_number' => $batchInventory->batch_reference,
                        'issue_date' => $batchInventory->issue_date,
                        'expire_date' => $batchInventory->expire_date,
                        'wholesale_price' => $batchInventory->batch ? $batchInventory->batch->wholesale_price : null,
                        'retail_price' => $batchInventory->batch ? $batchInventory->batch->retail_price : null,
                        'purchase_price' => $batchInventory->batch ? $batchInventory->batch->purchase_price : null,
                        'notes' => $batchInventory->batch_notes,
                        'remaining_quantity' => $batchInventory->remaining_qty,
                        'expiry_status' => $batchInventory->expiry_status,
                        'days_to_expiry' => $batchInventory->days_to_expiry,
                        'unit_type' => $batchInventory->unit_type,
                        'unit_id' => $batchInventory->unit_id,
                        'unit_amount' => $batchInventory->unit_amount,
                        'unit_name' => $batchInventory->unit_name,
                    ];
                })->values();

                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'stock_quantity' => $totalStockQuantity,
                    'purchase_price' => $product->purchase_price,
                    'wholesale_price' => $product->wholesale_price,
                    'retail_price' => $product->retail_price,
                    'unit_id' => $product->unit_id,
                    'whole_sale_unit_amount' => $product->whole_sale_unit_amount ?? 1,
                    'retails_sale_unit_amount' => $product->retails_sale_unit_amount ?? 1,
                    'unit_type' => $firstBatch->unit_type,
                    'unit_id' => $firstBatch->unit_id,
                    'unit_amount' => $firstBatch->unit_amount,
                    'unit_name' => $firstBatch->unit_name,
                    'available_batches' => $batches,
                ];
            })->filter(function ($product) {
                return $product['stock_quantity'] > 0 && count($product['available_batches']) > 0;
            })->values();

            return Inertia::render('Admin/Warehouse/CreateOutcome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'products' => $warehouseProducts,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create outcome page: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.outcome', $warehouse->id)
                ->with('error', 'Error loading create outcome page: ' . $e->getMessage());
        }
    }

    public function storeOutcome(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'batch_id' => 'required|exists:batches,id',
                'unit_type' => 'required|in:batch_unit',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Get the batch inventory to check stock
            $batchInventory = \App\Models\WarehouseBatchInventory::where('batch_id', $validated['batch_id'])
                ->where('warehouse_id', $warehouse->id)
                ->first();

            if (!$batchInventory) {
                return redirect()->back()
                    ->with('error', 'Batch not found in warehouse')
                    ->withInput()
                    ->withErrors(['batch_id' => 'Batch not found in warehouse']);
            }

            if ($batchInventory->product_id != $validated['product_id']) {
                return redirect()->back()
                    ->with('error', 'Batch does not belong to the selected product')
                    ->withInput()
                    ->withErrors(['batch_id' => 'Batch does not belong to the selected product']);
            }

            $availableStock = $batchInventory->remaining_qty;
            $requestedQuantity = $validated['quantity'];
            $actualQuantity = $requestedQuantity * $batchInventory->unit_amount;
            $unitPrice = $validated['price'];

            // Check if requested quantity exceeds available stock
            if ($actualQuantity > $availableStock) {
                return redirect()->back()
                    ->with('error', "Insufficient stock in batch {$batchInventory->batch_reference}. Available: {$availableStock} units")
                    ->withInput()
                    ->withErrors(['quantity' => "Quantity cannot exceed available stock of {$availableStock} units in this batch"]);
            }

            $total = $requestedQuantity * $unitPrice;

            // Generate reference number
            $referenceNumber = 'OUT-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            DB::beginTransaction();

            // Create the outcome record
            $outcome = WarehouseOutcome::create([
                'reference_number' => $referenceNumber,
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'batch_id' => $validated['batch_id'],
                'quantity' => $actualQuantity,
                'price' => $unitPrice,
                'total' => $total,
                'unit_type' => $validated['unit_type'],
                'is_wholesale' => false, // For batch-based, we don't use wholesale/retail distinction
                'unit_id' => $batchInventory->unit_id,
                'unit_amount' => $batchInventory->unit_amount,
                'unit_name' => $batchInventory->unit_name,
                'model_type' => 'manual_export',
                'model_id' => null,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Update batch inventory
            $batchInventory->decrement('remaining_qty', $actualQuantity);

            // Update warehouse product quantity
            $warehouseProduct = $warehouse->items()->where('product_id', $validated['product_id'])->first();
            if ($warehouseProduct) {
                $warehouseProduct->decrement('net_quantity', $actualQuantity);
            }

            DB::commit();

            return redirect()->route('admin.warehouses.outcome', $warehouse->id)
                ->with('success', 'Export record created successfully.');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating outcome record: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating outcome record: ' . $e->getMessage()]);
        }
    }

}