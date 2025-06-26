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

trait OutcomeController
{
    public function outcome(Warehouse $warehouse)
    {
        try {
            // Load warehouse with outcome records and related data
            $warehouse = Warehouse::with([
                'warehouseOutcome.product'
            ])->findOrFail($warehouse->id);

            // Get warehouse outcome records
            $outcomes = $warehouse->warehouseOutcome->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
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
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse outcome: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse outcome: ' . $e->getMessage());
        }
    }

    public function createOutcome(Warehouse $warehouse)
    {
        try {
            // Get all products with their units and pricing information that have stock in warehouse
            $products = Product::with(['wholesaleUnit', 'retailUnit'])
                ->where('is_activated', true)
                ->get()
                ->filter(function ($product) use ($warehouse) {
                    // Only include products that have stock in this warehouse
                    $warehouseProduct = $warehouse->items()->where('product_id', $product->id)->first();
                    return $warehouseProduct && ($warehouseProduct->net_quantity ?? 0) > 0;
                })
                ->map(function ($product) use ($warehouse) {
                    $warehouseProduct = $warehouse->items()
                        ->where('product_id', $product->id)->first();
                    return [
                        'id' => $product->id,
                        'name' => $product->name,
                        'barcode' => $product->barcode,
                        'type' => $product->type,
                        'purchase_price' => $product->purchase_price,
                        'wholesale_price' => $product->wholesale_price,
                        'retail_price' => $product->retail_price,
                        'whole_sale_unit_amount' => $product->whole_sale_unit_amount,
                        'retails_sale_unit_amount' => $product->retails_sale_unit_amount,
                        'available_stock' => $warehouseProduct ? $warehouseProduct->net_quantity : 0,
                        'wholesaleUnit' => $product->wholesaleUnit ? [
                            'id' => $product->wholesaleUnit->id,
                            'name' => $product->wholesaleUnit->name,
                            'code' => $product->wholesaleUnit->code,
                            'symbol' => $product->wholesaleUnit->symbol,
                        ] : null,
                        'retailUnit' => $product->retailUnit ? [
                            'id' => $product->retailUnit->id,
                            'name' => $product->retailUnit->name,
                            'code' => $product->retailUnit->code,
                            'symbol' => $product->retailUnit->symbol,
                        ] : null,
                    ];
                })->values();

            return Inertia::render('Admin/Warehouse/CreateOutcome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'products' => $products,
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
                'unit_type' => 'required|in:wholesale,retail',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Get the product with unit information
            $product = Product::with(['wholesaleUnit', 'retailUnit'])->findOrFail($validated['product_id']);

            // Get warehouse product to check stock
            $warehouseProduct = $warehouse->items()->where('product_id', $validated['product_id'])->first();

            if (!$warehouseProduct) {
                return redirect()->back()
                    ->with('error', 'Product not found in warehouse')
                    ->withInput()
                    ->withErrors(['product_id' => 'Product not found in warehouse']);
            }

            $availableStock = $warehouseProduct->net_quantity ?? 0;

            // Calculate actual quantity and available units based on unit type
            $requestedQuantity = $validated['quantity'];
            $actualQuantity = $requestedQuantity;
            $unitPrice = $validated['price'];
            $availableUnits = $availableStock;

            if ($validated['unit_type'] === 'wholesale' && $product->whole_sale_unit_amount) {
                // If wholesale unit is selected, multiply by unit amount for actual quantity
                $actualQuantity = $requestedQuantity * $product->whole_sale_unit_amount;
                // For validation, check how many wholesale units are available
                $availableUnits = floor($availableStock / $product->whole_sale_unit_amount);
            }

            // Check if requested quantity exceeds available units for the selected unit type
            if ($requestedQuantity > $availableUnits) {
                $unitTypeName = $validated['unit_type'] === 'wholesale' ? 'wholesale units' : 'retail units';
                return redirect()->back()
                    ->with('error', "Insufficient stock. Available: {$availableUnits} {$unitTypeName}")
                    ->withInput()
                    ->withErrors(['quantity' => "Requested quantity ({$requestedQuantity}) cannot exceed available stock of {$availableUnits} {$unitTypeName}"]);
            }

            $total = $actualQuantity * $unitPrice;

            // Generate reference number
            $referenceNumber = 'OUT-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            DB::beginTransaction();

            // Create the outcome record
            $outcome = WarehouseOutcome::create([
                'reference_number' => $referenceNumber,
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'quantity' => $actualQuantity,
                'price' => $unitPrice,
                'total' => $total,
                'model_type' => 'manual_export',
                'model_id' => null,
            ]);

            // Update warehouse product quantity
            // $warehouseProduct->decrement('net_quantity', $actualQuantity);

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