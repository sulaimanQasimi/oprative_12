<?php
namespace App\Http\Controllers\Admin\Warehouse;

use App\Models\{Warehouse,Sale,CustomerStockIncome};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

use Inertia\Inertia;

trait SaleController{
    public function sales(Warehouse $warehouse)
    {
        try {
            // Load warehouse sales with their relationships
            $sales = Sale::where('warehouse_id', $warehouse->id)
                ->with([
                    'customer:id,name,email,phone',
                    'saleItems.product:id,name,barcode,type',
                    'currency:id,name,code'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'reference' => $sale->reference,
                        'date' => $sale->date,
                        'status' => $sale->status,
                        'notes' => $sale->notes,
                        'customer' => $sale->customer ? [
                            'id' => $sale->customer->id,
                            'name' => $sale->customer->name,
                            'email' => $sale->customer->email,
                            'phone' => $sale->customer->phone,
                        ] : null,
                        'currency' => $sale->currency ? [
                            'id' => $sale->currency->id,
                            'name' => $sale->currency->name,
                            'code' => $sale->currency->code,
                        ] : null,
                        'sale_items' => $sale->saleItems->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'product_id' => $item->product_id,
                                'product' => $item->product ? [
                                    'id' => $item->product->id,
                                    'name' => $item->product->name,
                                    'barcode' => $item->product->barcode,
                                    'type' => $item->product->type,
                                ] : null,
                                'quantity' => $item->quantity,
                                'unit_price' => $item->unit_price,
                                'total_price' => $item->total_price,
                                'discount_amount' => $item->discount_amount ?? 0,
                                'tax_amount' => $item->tax_amount ?? 0,
                            ];
                        }),
                        'total_amount' => $sale->total_amount ?? $sale->saleItems->sum('total_price'),
                        'tax_amount' => $sale->tax_amount ?? 0,
                        'discount_amount' => $sale->discount_amount ?? 0,
                        'paid_amount' => $sale->paid_amount ?? 0,
                        'due_amount' => $sale->due_amount ?? 0,
                        'confirmed_by_warehouse' => $sale->confirmed_by_warehouse,
                        'confirmed_by_shop' => $sale->confirmed_by_shop,
                        'created_at' => $sale->created_at,
                        'updated_at' => $sale->updated_at,
                    ];
                });

            return Inertia::render('Admin/Warehouse/Sales', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'sales' => $sales,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse sales: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse sales: ' . $e->getMessage());
        }
    }

    public function createSale(Warehouse $warehouse)
    {
        
        try {
            // Get customers
            $customers = \App\Models\Customer::select('id', 'name', 'email', 'phone')->get();

            // Get warehouse products directly from WarehouseBatchInventory
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

            return Inertia::render('Admin/Warehouse/CreateSale', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'customers' => $customers,
                'warehouseProducts' => $warehouseProducts,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create store movement page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading create store movement page');
        }
    }

    public function storeSale(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'sale_items' => 'required|array|min:1',
                'sale_items.*.product_id' => 'required|exists:products,id',
                'sale_items.*.batch_id' => 'nullable|exists:batches,id',
                'sale_items.*.quantity' => 'required|numeric|min:1',
                'sale_items.*.unit_price' => 'required|numeric|min:0',
                'sale_items.*.total_price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Validate stock for all items
            foreach ($validated['sale_items'] as $index => $item) {
                $warehouseProduct = $warehouse->items()->where('product_id', $item['product_id'])->first();

                if (!$warehouseProduct) {
                    return redirect()->back()
                        ->with('error', "Product ID {$item['product_id']} not found in this warehouse")
                        ->withInput()
                        ->withErrors(["sale_items.{$index}.product_id" => 'Product not found in this warehouse']);
                }

                // Validate batch if provided
                if (!empty($item['batch_id'])) {
                    $batchInventory = \App\Models\WarehouseBatchInventory::where('batch_id', $item['batch_id'])
                        ->where('warehouse_id', $warehouse->id)
                        ->first();
                    
                    if (!$batchInventory) {
                        return redirect()->back()
                            ->with('error', "Batch ID {$item['batch_id']} not found in this warehouse")
                            ->withInput()
                            ->withErrors(["sale_items.{$index}.batch_id" => 'Batch not found in this warehouse']);
                    }

                    if ($batchInventory->product_id != $item['product_id']) {
                        return redirect()->back()
                            ->with('error', "Batch does not belong to the selected product")
                            ->withInput()
                            ->withErrors(["sale_items.{$index}.batch_id" => 'Batch does not belong to the selected product']);
                    }

                    $availableStock = $batchInventory->remaining_qty;
                    
                    if ($item['quantity'] > $availableStock) {
                        return redirect()->back()
                            ->with('error', "Insufficient stock in batch {$batchInventory->batch_reference}. Available: {$availableStock} units")
                            ->withInput()
                            ->withErrors(["sale_items.{$index}.quantity" => "Quantity cannot exceed available stock of {$availableStock} units in this batch"]);
                    }
                } else {
                    // Fallback to general product stock if no batch specified
                    $availableStock = $warehouseProduct->net_quantity ?? 0;

                    if ($item['quantity'] > $availableStock) {
                        return redirect()->back()
                            ->with('error', "Insufficient stock for product ID {$item['product_id']}. Available: {$availableStock} units")
                            ->withInput()
                            ->withErrors(["sale_items.{$index}.quantity" => "Quantity cannot exceed available stock of {$availableStock} units"]);
                    }
                }

                if ($item['quantity'] <= 0) {
                    return redirect()->back()
                        ->with('error', 'Quantity must be greater than 0')
                        ->withInput()
                        ->withErrors(["sale_items.{$index}.quantity" => 'Quantity must be greater than 0']);
                }
            }

            DB::beginTransaction();

            // Generate reference number
            $referenceNumber = 'SALE-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Calculate total sale amount
            $totalSaleAmount = collect($validated['sale_items'])->sum('total_price');

            // Create Sale record
            $sale = Sale::create([
                'warehouse_id' => $warehouse->id,
                'customer_id' => $validated['customer_id'],
                'currency_id' => 1, // Default currency
                'reference' => $referenceNumber,
                'status' => 'pending',
                'date' => now()->toDateString(),
                'confirmed_by_warehouse' => false,
                'confirmed_by_shop' => false,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create SaleItem records and tracking records for each item
            foreach ($validated['sale_items'] as $item) {
                // Create SaleItem record
                \App\Models\SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'batch_id' => $item['batch_id'] ?? null,
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                ]);

                // Create warehouse outcome record for inventory tracking
                \App\Models\WarehouseOutcome::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $item['product_id'],
                    'batch_id' => $item['batch_id'] ?? null,
                    'reference_number' => $referenceNumber,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'model_type' => 'customer_sale',
                    'model_id' => $validated['customer_id'],
                ]);

                // Create customer income record for customer tracking
                CustomerStockIncome::create([
                    'customer_id' => $validated['customer_id'],
                    'product_id' => $item['product_id'],
                    'reference_number' => $referenceNumber,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'model_id' => $warehouse->id,
                ]);
            }
            $sale->update([
                'total' => $sale->saleItems->sum('total'),
            ]);

            DB::commit();

            return redirect()->route('admin.warehouses.sales', $warehouse->id)
                ->with('success', 'Sale with ' . count($validated['sale_items']) . ' items created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating sale: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error creating sale: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function showSale(Warehouse $warehouse, $saleId)
    {
        try {
            $sale = \App\Models\Sale::with([
                'customer:id,name,email,phone',
                'currency:id,name,code',
                'saleItems.product:id,name,barcode'
            ])
            ->where('warehouse_id', $warehouse->id)
            ->findOrFail($saleId);

            return Inertia::render('Admin/Warehouse/ShowSale', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'sale' => $sale,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading sale details: ' . $e->getMessage());
            
            return redirect()->route('admin.warehouses.sales', $warehouse->id)
                ->with('error', 'Sale not found or error loading sale details.');
        }
    }
}