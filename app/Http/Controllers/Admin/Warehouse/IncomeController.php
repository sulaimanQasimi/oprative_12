<?php
namespace App\Http\Controllers\Admin\Warehouse;

use App\Models\{Warehouse, Product, Unit, WarehouseIncome, Batch};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Inertia\Inertia;

trait IncomeController
{
    public function income(Warehouse $warehouse)
    {
        try {
            // Load warehouse incomes with their relationships
            $incomes = WarehouseIncome::where('warehouse_id', $warehouse->id)
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
                        'unit_id' => $product->unit_id,
                        'unit' => $product->unit ? [
                            'id' => $product->unit->id,
                            'name' => $product->unit->name,
                            'code' => $product->unit->code,
                        ] : null,
                    ];
                });

            $units = Unit::all();

            return Inertia::render('Admin/Warehouse/CreateIncome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'products' => $products,
                'units' => $units,
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
                'income_items.*.issue_date' => 'required|date',
                'income_items.*.expire_date' => 'nullable|date|after:issue_date',
                'income_items.*.unit_amount' => 'required|numeric|min:0',
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

                // Generate reference number for the income transaction
                $batchReferenceNumber = 'B-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

                // Get the product with unit information
                $product = Product::with(['unit'])->findOrFail($item['product_id']);

                // Create new batch
                $batch = Batch::create([
                    'product_id' => $item['product_id'],
                    'reference_number' => $batchReferenceNumber,
                    'issue_date' => $item['issue_date'],
                    'expire_date' => $item['expire_date'] ?? null,
                    'notes' => $item['batch_notes'] ?? null,
                    'wholesale_price' => $item['wholesale_price'] ?? null,
                    'retail_price' => $item['retail_price'] ?? null,
                    'purchase_price' => $item['unit_price'],
                    'unit_type' => $item['unit_type'],
                    'unit_name' => $product->unit ? $product->unit->name : ($item['unit_type'] === 'wholesale' ? 'Wholesale' : 'Retail'),
                    'unit_amount' => $item['unit_amount'] ?? 1, // Default unit amount
                    'quantity' => $item['quantity'],
                    'total' => $item['total_price'],
                ]);

                // Create the income record
                WarehouseIncome::create([
                    'reference_number' => $referenceNumber,
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $item['product_id'],
                    'batch_id' => $batch->id,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'unit_type' => $item['unit_type'],
                    'is_wholesale' => false, // For batch-based, we don't use wholesale/retail distinction
                    'unit_id' => $product->unit_id,
                    'unit_amount' => $item['unit_amount'],
                    'unit_name' => $product->unit ? $product->unit->name : 'Unit',
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
            $income = WarehouseIncome::with([
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