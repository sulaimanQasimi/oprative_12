<?php

namespace App\Http\Controllers\Admin\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\Product;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use App\Models\WarehouseIncome;
use PhpOffice\PhpSpreadsheet\Calculation\Financial\Securities\Price;

trait IncomeController
{
    public function income(Warehouse $warehouse)
    {
        try {
            // Load warehouse with income records and related data
            $warehouse = Warehouse::with([
                'warehouseIncome.product'
            ])->findOrFail($warehouse->id);

                        // Get warehouse income records
            $incomes = $warehouse->warehouseIncome->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference_number' => $income->reference_number,
                    'product' => [
                        'id' => $income->product->id,
                        'name' => $income->product->name,
                        'barcode' => $income->product->barcode,
                        'type' => $income->product->type,
                    ],
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'unit_type' => $income->unit_type ?? 'retail',
                    'is_wholesale' => $income->is_wholesale ?? false,
                    'unit_id' => $income->unit_id,
                    'unit_amount' => $income->unit_amount ?? 1,
                    'unit_name' => $income->unit_name,
                    'model_type' => $income->model_type,
                    'model_id' => $income->model_id,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ];
            });

            return Inertia::render('Admin/Warehouse/Income', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'incomes' => $incomes,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse income: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse income: ' . $e->getMessage());
        }
    }

    public function createIncome(Warehouse $warehouse)
    {
        try {
            // Get all products with their units and pricing information
            $products = Product::with(['wholesaleUnit', 'retailUnit'])
                ->where('is_activated', true)
                ->get()
                ->map(function ($product) {
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
                });

            return Inertia::render('Admin/Warehouse/CreateIncome', [
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
            Log::error('Error loading create income page: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.income', $warehouse->id)
                ->with('error', 'Error loading create income page: ' . $e->getMessage());
        }
    }

    public function storeIncome(Request $request, Warehouse $warehouse)
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

            // Calculate actual quantity and total based on unit type
            $actualQuantity = $validated['quantity'];
            $unitPrice = $validated['price'];
            $isWholesale = $validated['unit_type'] === 'wholesale';
            $unitId = null;
            $unitAmount = 1;
            $unitName = null;

            if ($isWholesale && $product->wholesaleUnit) {
                // If wholesale unit is selected, multiply by unit amount
                
                $actualQuantity = $validated['quantity'] * $product->whole_sale_unit_amount;
                $unitId = $product->wholesaleUnit->id;
                $unitAmount = $product->whole_sale_unit_amount;
                $unitName = $product->wholesaleUnit->name;

                $total = $validated['quantity'] * $unitPrice;
            } elseif (!$isWholesale && $product->retailUnit) {
                // For retail unit
                $unitId = $product->retailUnit->id;
                $unitAmount = $product->retails_sale_unit_amount ?? 1;
                $unitName = $product->retailUnit->name;

                $total = $actualQuantity * $unitPrice;
            }

            // Generate reference number
            $referenceNumber = 'INC-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            // Create the income record with all the new columns
            $income = WarehouseIncome::create([
                'reference_number' => $referenceNumber,
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'quantity' => $actualQuantity,
                'price' => $unitPrice,
                'total' => $total,
                'unit_type' => $validated['unit_type'],
                'is_wholesale' => $isWholesale,
                'unit_id' => $unitId,
                'unit_amount' => $unitAmount,
                'unit_name' => $unitName,
            ]);

            return redirect()->route('admin.warehouses.income', $warehouse->id)
                ->with('success', 'Income record created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating income record: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating income record: ' . $e->getMessage()]);
        }
    }

}