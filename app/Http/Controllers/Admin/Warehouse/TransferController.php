<?php

namespace App\Http\Controllers\Admin\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, Product, Batch, WarehouseTransfer, TransferItem, WarehouseIncome, WarehouseOutcome};
use App\Models\WarehouseProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

trait TransferController
{
    public function transfers(Warehouse $warehouse, Request $request)
    {
        try {
            $warehouse->load([
                'transfersFrom.transferItems.product',
                'transfersFrom.transferItems.batch',
                'transfersFrom.fromWarehouse',
                'transfersFrom.toWarehouse',
                'transfersFrom.creator',
                'transfersTo.transferItems.product',
                'transfersTo.transferItems.batch',
                'transfersTo.fromWarehouse',
                'transfersTo.toWarehouse',
                'transfersTo.creator'
            ]);

            // Get available warehouses (excluding current warehouse)
            $availableWarehouses = Warehouse::where('id', '!=', $warehouse->id)
                ->where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get all products
            $products = Product::select('id', 'name', 'barcode', 'type')->get();

            // Combine transfers from and to this warehouse
            $allTransfers = collect();

            // Add transfers from this warehouse
            $allTransfers = $allTransfers->merge($warehouse->transfersFrom->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                    'from_warehouse' => [
                        'id' => $transfer->fromWarehouse->id,
                        'name' => $transfer->fromWarehouse->name,
                        'code' => $transfer->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transfer->toWarehouse->id,
                        'name' => $transfer->toWarehouse->name,
                        'code' => $transfer->toWarehouse->code,
                    ],
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                    'created_by' => $transfer->creator ? [
                        'id' => $transfer->creator->id,
                        'name' => $transfer->creator->name,
                    ] : null,
                    'transfer_date' => $transfer->transfer_date,
                    'completed_at' => $transfer->completed_at,
                    'created_at' => $transfer->created_at,
                    'updated_at' => $transfer->updated_at,
                    'total_amount' => $transfer->total_amount,
                    'total_quantity' => $transfer->total_quantity,
                    'items_count' => $transfer->transferItems->count(),
                    'transfer_items' => $transfer->transferItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'barcode' => $item->product->barcode,
                                'type' => $item->product->type,
                            ],
                            'batch' => $item->batch ? [
                                'id' => $item->batch->id,
                                'reference_number' => $item->batch->reference_number,
                                'expire_date' => $item->batch->expire_date,
                            ] : null,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'unit_type' => $item->unit_type,
                            'unit_name' => $item->unit_name,
                            'unit_amount' => $item->unit_amount,
                        ];
                    }),
                    'direction' => 'outgoing'
                ];
            }));

            // Add transfers to this warehouse
            $allTransfers = $allTransfers->merge($warehouse->transfersTo->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                    'from_warehouse' => [
                        'id' => $transfer->fromWarehouse->id,
                        'name' => $transfer->fromWarehouse->name,
                        'code' => $transfer->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transfer->toWarehouse->id,
                        'name' => $transfer->toWarehouse->name,
                        'code' => $transfer->toWarehouse->code,
                    ],
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                    'created_by' => $transfer->creator ? [
                        'id' => $transfer->creator->id,
                        'name' => $transfer->creator->name,
                    ] : null,
                    'transfer_date' => $transfer->transfer_date,
                    'completed_at' => $transfer->completed_at,
                    'created_at' => $transfer->created_at,
                    'updated_at' => $transfer->updated_at,
                    'total_amount' => $transfer->total_amount,
                    'total_quantity' => $transfer->total_quantity,
                    'items_count' => $transfer->transferItems->count(),
                    'transfer_items' => $transfer->transferItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'barcode' => $item->product->barcode,
                                'type' => $item->product->type,
                            ],
                            'batch' => $item->batch ? [
                                'id' => $item->batch->id,
                                'reference_number' => $item->batch->reference_number,
                                'expire_date' => $item->batch->expire_date,
                            ] : null,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'unit_type' => $item->unit_type,
                            'unit_name' => $item->unit_name,
                            'unit_amount' => $item->unit_amount,
                        ];
                    }),
                    'direction' => 'incoming'
                ];
            }));

            // Sort by created_at descending
            $allTransfers = $allTransfers->sortByDesc('created_at')->values();

            return Inertia::render('Admin/Warehouse/Transfers', [
                'warehouse' => $warehouse,
                'transfers' => $allTransfers,
                'availableWarehouses' => $availableWarehouses,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse transfers: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading warehouse transfers');
        }
    }

    public function createTransfer(Warehouse $warehouse)
    {
        try {
            // Get available warehouses (excluding current warehouse)
            $availableWarehouses = Warehouse::where('id', '!=', $warehouse->id)
                ->where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get warehouse batch inventory with available stock
            $warehouseProducts = DB::table('warehouse_batch_inventory')
                ->where('warehouse_id', $warehouse->id)
                ->where('remaining_qty', '>', 0)
                ->orderBy('expire_date', 'asc')
                ->orderBy('batch_id', 'desc')
                ->get()
                ->map(function ($batch) {
                    // Get product details from database
                    $product = Product::with(['unit'])->find($batch->product_id);

                    return [
                        'id' => $product->id ?? $batch->product_id,
                        'name' => $product->name ?? $batch->product_name,
                        'barcode' => $product->barcode ?? $batch->product_barcode,
                        'type' => $product->type ?? 'Unknown',
                        'stock_quantity' => $batch->remaining_qty,
                        'purchase_price' => $product->purchase_price ?? 0,
                        'wholesale_price' => $product->wholesale_price ?? 0,
                        'retail_price' => $product->retail_price ?? 0,
                        'whole_sale_unit_amount' => $product->whole_sale_unit_amount ?? 1,
                        'retails_sale_unit_amount' => $product->retails_sale_unit_amount ?? 1,
                        'available_stock' => $batch->remaining_qty,
                        'unit' => $product->unit ? [
                            'id' => $product->unit->id,
                            'name' => $product->unit->name,
                            'code' => $product->unit->code,
                            'symbol' => $product->unit->symbol,
                        ] : null,
                        'available_batches' => [
                            [
                                'id' => $batch->batch_id,
                                'reference_number' => $batch->batch_reference,
                                'remaining_quantity' => $batch->remaining_qty,
                                'unit_amount' => $batch->unit_amount,
                                'unit_name' => $batch->unit_name,
                                'unit_id' => $batch->unit_id,
                                'wholesale_price' => $product->wholesale_price ?? 0,
                                'retail_price' => $product->retail_price ?? 0,
                                'expire_date' => $batch->expire_date,
                                'expiry_status' => $batch->expiry_status,
                                'days_to_expiry' => $batch->days_to_expiry,
                                'notes' => $batch->batch_notes,
                            ]
                        ]
                    ];
                })
                ->groupBy('id')
                ->map(function ($batches, $productId) {
                    $firstBatch = $batches->first();
                    $allBatches = $batches->map(function ($batch) {
                        return $batch['available_batches'][0];
                    })->values();

                    return [
                        'id' => $firstBatch['id'],
                        'name' => $firstBatch['name'],
                        'barcode' => $firstBatch['barcode'],
                        'type' => $firstBatch['type'],
                        'stock_quantity' => $batches->sum('stock_quantity'),
                        'purchase_price' => $firstBatch['purchase_price'],
                        'wholesale_price' => $firstBatch['wholesale_price'],
                        'retail_price' => $firstBatch['retail_price'],
                        'whole_sale_unit_amount' => $firstBatch['whole_sale_unit_amount'],
                        'retails_sale_unit_amount' => $firstBatch['retails_sale_unit_amount'],
                        'available_stock' => $batches->sum('available_stock'),
                        'unit' => $firstBatch['unit'],
                        'available_batches' => $allBatches,
                    ];
                })
                ->values()
                ->filter(function ($product) {
                    return $product['stock_quantity'] > 0; // Only show products with stock
                });

            return Inertia::render('Admin/Warehouse/CreateTransfer', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'warehouses' => $availableWarehouses,
                'warehouseProducts' => $warehouseProducts,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create transfer page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading create transfer page');
        }
    }

    public function storeTransfer(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
                'transfer_items' => 'required|array|min:1',
                'transfer_items.*.product_id' => 'required|exists:products,id',
                'transfer_items.*.batch_id' => 'nullable|exists:batches,id',
                'transfer_items.*.quantity' => 'required|numeric|min:0.01',
                'transfer_items.*.unit_price' => 'required|numeric|min:0',
                'transfer_items.*.unit_id' => 'nullable|exists:units,id',
                'transfer_items.*.unit_amount' => 'nullable|numeric|min:1',
                'transfer_items.*.unit_name' => 'nullable|string',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Generate reference number
            $referenceNumber = 'TRF-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Create transfer record
            $transfer = WarehouseTransfer::create(attributes: [
                'reference_number' => $referenceNumber,
                'from_warehouse_id' => $warehouse->id,
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'created_by' => Auth::id(),
                'transfer_date' => now(),
            ]);

            $totalAmount = 0;
            $totalQuantity = 0;

            // Create transfer items and validate stock
            foreach ($validated['transfer_items'] as $itemData) {
                // Check if product exists in warehouse and has sufficient stock
                $batchInventory = null;

                if ($itemData['batch_id']) {
                    $batchInventory = WarehouseProduct::with('product')
                        ->with(['product','batch'])
                        ->where('batch_id', $itemData['batch_id'])
                        ->where('warehouse_id', $warehouse->id)
                        ->where('product_id', $itemData['product_id'])
                        ->first();
                } else {
                    $batchInventory = WarehouseProduct::with('product')
                        ->with(['product','batch'])
                        ->where('warehouse_id', $warehouse->id)
                        ->where('product_id', $itemData['product_id'])
                        ->first();
                }

                if (!$batchInventory) {
                    DB::rollback();
                    return redirect()->back()
                        ->with('error', 'Product not found in this warehouse')
                        ->withInput();
                }

                $availableStock = $batchInventory->remaining_qty ?? 0;
                $requestedQuantity = $itemData['quantity'];

                if ($requestedQuantity > $availableStock) {
                    DB::rollback();
                    return redirect()->back()
                        ->with('error', "Insufficient stock for product. Available: {$availableStock} units")
                        ->withInput();
                }
                /**
                 * feat: 
                 */
                $totalPrice = ($requestedQuantity / $batchInventory->unit_amount) * $batchInventory->batch->purchase_price;
                $totalAmount += $totalPrice;
                $totalQuantity += $requestedQuantity;

                // Create transfer item
                TransferItem::create([
                    'warehouse_transfer_id' => $transfer->id,
                    'product_id' => $itemData['product_id'],
                    'batch_id' => $itemData['batch_id'],
                    'quantity' => $requestedQuantity,
                    'unit_price' => $batchInventory->batch->purchase_price,
                    'total_price' => $totalPrice,
                    'unit_type' => $batchInventory->unit_type,
                    'unit_id' => $batchInventory->unit_id,
                    'unit_amount' => $batchInventory->unit_amount,
                    'unit_name' => $batchInventory->unit_name,
                ]);
                WarehouseIncome::create([
                    'warehouse_id' => $validated['to_warehouse_id'],
                    'product_id' => $itemData['product_id'],
                    'quantity' => $requestedQuantity,
                    'price' => $batchInventory->batch->purchase_price,
                    'total' => $totalPrice,
                    'reference_number' => $referenceNumber,
                    'model_type' => 'App\Models\WarehouseTransfer',
                    'model_id' => $transfer->id,
                    'unit_id' => $batchInventory->unit_id,
                    'unit_type' => $batchInventory->unit_type,
                    'unit_amount' => $batchInventory->unit_amount,
                    'unit_name' => $batchInventory->unit_name,
                    'batch_id' => $itemData['batch_id'],
                ]);
                WarehouseOutcome::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $itemData['product_id'],
                    'quantity' => $requestedQuantity,
                    'price' => $batchInventory->batch->purchase_price,
                    'total' => $totalPrice,
                    'reference_number' => $referenceNumber,
                    'model_type' => 'App\Models\WarehouseTransfer',
                    'model_id' => $transfer->id,
                    'unit_id' => $batchInventory->unit_id,
                    'unit_type' => $batchInventory->unit_type,
                    'unit_amount' => $batchInventory->unit_amount,
                    'unit_name' => $batchInventory->unit_name,
                    'batch_id' => $itemData['batch_id'],
                ]);

            }

            // Complete the transfer (this will create income/outcome records)
            $transfer->complete();

            DB::commit();

            return redirect()->route('admin.warehouses.transfers', $warehouse->id)
                ->with('success', 'Transfer created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating warehouse transfer: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error creating transfer: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function showTransfer(Warehouse $warehouse, WarehouseTransfer $transfer)
    {
        try {
            $transfer->load([
                'transferItems.product',
                'transferItems.batch',
                'fromWarehouse',
                'toWarehouse',
                'creator'
            ]);

            return Inertia::render('Admin/Warehouse/ShowTransfer', [
                'warehouse' => $warehouse,
                'transfer' => [
                    'id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                    'from_warehouse' => [
                        'id' => $transfer->fromWarehouse->id,
                        'name' => $transfer->fromWarehouse->name,
                        'code' => $transfer->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transfer->toWarehouse->id,
                        'name' => $transfer->toWarehouse->name,
                        'code' => $transfer->toWarehouse->code,
                    ],
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                    'created_by' => $transfer->creator ? [
                        'id' => $transfer->creator->id,
                        'name' => $transfer->creator->name,
                    ] : null,
                    'transfer_date' => $transfer->transfer_date,
                    'completed_at' => $transfer->completed_at,
                    'created_at' => $transfer->created_at,
                    'updated_at' => $transfer->updated_at,
                    'total_amount' => $transfer->total_amount,
                    'total_quantity' => $transfer->total_quantity,
                    'transfer_items' => $transfer->transferItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'barcode' => $item->product->barcode,
                                'type' => $item->product->type,
                            ],
                            'batch' => $item->batch ? [
                                'id' => $item->batch->id,
                                'reference_number' => $item->batch->reference_number,
                                'expire_date' => $item->batch->expire_date,
                            ] : null,
                            'quantity' => $item->quantity/$item->unit_amount,
                            'unit_price' => $item->batch->purchase_price,
                            'total_price' => $item->total_price,
                            'unit_type' => $item->unit_type,
                            'unit_name' => $item->unit_name,
                            'unit_amount' => $item->unit_amount,
                        ];
                    }),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading transfer details: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading transfer details');
        }
    }
}