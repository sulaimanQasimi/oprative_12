<?php
namespace App\Http\Controllers\Admin\Warehouse;

use App\Models\{Warehouse, Product};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

trait IncomeController
{
    public function income(Warehouse $warehouse)
    {
        try {
            // Load warehouse incomes with their relationships
            $incomes = \App\Models\WarehouseIncome::where('warehouse_id', $warehouse->id)
                ->with([
                    'product:id,name,barcode,type',
                    'batch:id,reference_number,issue_date,expire_date,notes'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($income) {
                    return [
                        'id' => $income->id,
                        'reference_number' => $income->reference_number,
                        'date' => $income->created_at->toDateString(),
                        'status' => 'completed',
                        'notes' => $income->notes,
                        'product' => $income->product ? [
                            'id' => $income->product->id,
                            'name' => $income->product->name,
                            'barcode' => $income->product->barcode,
                            'type' => $income->product->type,
                        ] : null,
                        'batch' => $income->batch ? [
                            'id' => $income->batch->id,
                            'reference_number' => $income->batch->reference_number,
                            'issue_date' => $income->batch->issue_date,
                            'expire_date' => $income->batch->expire_date,
                            'notes' => $income->batch->notes,
                        ] : null,
                        'quantity' => $income->quantity,
                        'unit_price' => $income->price,
                        'total_price' => $income->total,
                        'unit_type' => $income->unit_type,
                        'unit_name' => $income->unit_name,
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
            $products = Product::with(['unit'])
                ->where('status', true)
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
                        'unit_id' => $product->unit_id,
                        'whole_sale_unit_amount' => $product->whole_sale_unit_amount ?? 1,
                        'retails_sale_unit_amount' => $product->retails_sale_unit_amount ?? 1,
                        'unit' => $product->unit ? [
                            'id' => $product->unit->id,
                            'name' => $product->unit->name,
                            'code' => $product->unit->code,
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
                'income_items' => 'required|array|min:1',
                'income_items.*.product_id' => 'required|exists:products,id',
                'income_items.*.batch_reference' => 'required|string|max:255',
                'income_items.*.issue_date' => 'required|date',
                'income_items.*.expire_date' => 'nullable|date|after:issue_date',
                'income_items.*.quantity' => 'required|numeric|min:0.01',
                'income_items.*.unit_price' => 'required|numeric|min:0',
                'income_items.*.total_price' => 'required|numeric|min:0',
                'income_items.*.unit_type' => 'required|in:batch_unit',
                'income_items.*.batch_notes' => 'nullable|string|max:1000',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Generate reference number for the income transaction
            $referenceNumber = 'INC-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            // Process each income item
            foreach ($validated['income_items'] as $item) {
                // Get the product with unit information
                $product = Product::with(['wholesaleUnit', 'retailUnit'])->findOrFail($item['product_id']);

                // Create or find batch
                $batch = \App\Models\Batch::where('reference_number', $item['batch_reference'])
                    ->where('product_id', $item['product_id'])
                    ->first();

                if (!$batch) {
                    // Create new batch
                    $batch = \App\Models\Batch::create([
                        'product_id' => $item['product_id'],
                        'reference_number' => $item['batch_reference'],
                        'issue_date' => $item['issue_date'],
                        'expire_date' => $item['expire_date'] ?? null,
                        'notes' => $item['batch_notes'] ?? null,
                        'wholesale_price' => $item['unit_type'] === 'wholesale' ? $item['unit_price'] : null,
                        'retail_price' => $item['unit_type'] === 'retail' ? $item['unit_price'] : null,
                        'purchase_price' => $item['unit_price'],
                        'unit_type' => $item['unit_type'],
                        'unit_name' => $product->unit ? $product->unit->name : ($item['unit_type'] === 'wholesale' ? 'Wholesale' : 'Retail'),
                        'unit_amount' => 1, // Default unit amount
                        'quantity' => $item['quantity'],
                        'total' => $item['total_price'],
                    ]);
                } else {
                    // Update existing batch with new information
                    $batch->update([
                        'issue_date' => $item['issue_date'],
                        'expire_date' => $item['expire_date'] ?? $batch->expire_date,
                        'notes' => $item['batch_notes'] ?? $batch->notes,
                        'wholesale_price' => $item['unit_type'] === 'wholesale' ? $item['unit_price'] : $batch->wholesale_price,
                        'retail_price' => $item['unit_type'] === 'retail' ? $item['unit_price'] : $batch->retail_price,
                        'purchase_price' => $item['unit_price'],
                        'quantity' => $batch->quantity + $item['quantity'],
                        'total' => $batch->total + $item['total_price'],
                    ]);
                }

                // Calculate unit information for batch-based approach
                $unitId = $product->unit_id;
                $unitAmount = 1; // Default unit amount
                $unitName = $product->unit ? $product->unit->name : 'Unit';

                // Create the income record
                \App\Models\WarehouseIncome::create([
                    'reference_number' => $referenceNumber,
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $item['product_id'],
                    'batch_id' => $batch->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'unit_type' => $item['unit_type'],
                    'is_wholesale' => false, // For batch-based, we don't use wholesale/retail distinction
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'notes' => $validated['notes'] ?? null,
                ]);

                // Update warehouse inventory
                $warehouseItem = $warehouse->items()->where('product_id', $item['product_id'])->first();
                
                if ($warehouseItem) {
                    $warehouseItem->update([
                        'net_quantity' => $warehouseItem->net_quantity + $item['quantity'],
                        'total_quantity' => $warehouseItem->total_quantity + $item['quantity'],
                    ]);
                } else {
                    $warehouse->items()->create([
                        'product_id' => $item['product_id'],
                        'net_quantity' => $item['quantity'],
                        'total_quantity' => $item['quantity'],
                        'reserved_quantity' => 0,
                    ]);
                }

                // Update or create warehouse batch inventory
                $batchInventory = \App\Models\WarehouseBatchInventory::where('warehouse_id', $warehouse->id)
                    ->where('batch_id', $batch->id)
                    ->first();

                if ($batchInventory) {
                    $batchInventory->update([
                        'remaining_qty' => $batchInventory->remaining_qty + $item['quantity'],
                    ]);
                } else {
                    \App\Models\WarehouseBatchInventory::create([
                        'warehouse_id' => $warehouse->id,
                        'batch_id' => $batch->id,
                        'product_id' => $item['product_id'],
                        'batch_reference' => $batch->reference_number,
                        'issue_date' => $batch->issue_date,
                        'expire_date' => $batch->expire_date,
                        'batch_notes' => $batch->notes,
                        'remaining_qty' => $item['quantity'],
                        'unit_type' => $item['unit_type'],
                        'unit_id' => $unitId,
                        'unit_amount' => $unitAmount,
                        'unit_name' => $unitName,
                    ]);
                }
            }

            DB::commit();

            return redirect()->route('admin.warehouses.income', $warehouse->id)
                ->with('success', 'Import with ' . count($validated['income_items']) . ' items created successfully.');
        } catch (\Illuminate\Validation\ValidationException $e) {
            DB::rollback();
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating income record: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating income record: ' . $e->getMessage()]);
        }
    }

    public function showIncome(Warehouse $warehouse, $incomeId)
    {
        try {
            $income = \App\Models\WarehouseIncome::with([
                'product:id,name,barcode',
                'batch:id,reference_number,issue_date,expire_date,notes'
            ])
                ->where('warehouse_id', $warehouse->id)
                ->findOrFail($incomeId);

            return Inertia::render('Admin/Warehouse/ShowIncome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'income' => $income,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading income details: ' . $e->getMessage());

            return redirect()->route('admin.warehouses.income', $warehouse->id)
                ->with('error', 'Income not found or error loading income details.');
        }
    }
}