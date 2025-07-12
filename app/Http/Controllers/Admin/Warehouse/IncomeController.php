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
use App\Models\Batch;
use App\Models\Unit;
use PhpOffice\PhpSpreadsheet\Calculation\Financial\Securities\Price;

trait IncomeController
{
    public function income(Warehouse $warehouse, Request $request)
    {
        try {
            // Get query parameters
            $search = $request->get('search', '');
            $dateFilter = $request->get('date_filter', '');
            $batchFilter = $request->get('batch_filter', '');
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $perPage = $request->get('per_page', 15);

            // Build query
            $query = WarehouseIncome::with(['product', 'batch'])
                ->where('warehouse_id', $warehouse->id);

            // Apply search filter
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                      ->orWhereHas('product', function ($productQuery) use ($search) {
                          $productQuery->where('name', 'like', "%{$search}%")
                                      ->orWhere('barcode', 'like', "%{$search}%")
                                      ->orWhere('type', 'like', "%{$search}%");
                      })
                      ->orWhereHas('batch', function ($batchQuery) use ($search) {
                          $batchQuery->where('reference_number', 'like', "%{$search}%");
                      });
                });
            }

            // Apply date filter
            if ($dateFilter) {
                $query->whereDate('created_at', $dateFilter);
            }

            // Apply batch filter
            if ($batchFilter) {
                switch ($batchFilter) {
                    case 'with_batch':
                        $query->whereNotNull('batch_id');
                        break;
                    case 'without_batch':
                        $query->whereNull('batch_id');
                        break;
                    case 'expired':
                        $query->whereHas('batch', function ($q) {
                            $q->where('expire_date', '<', now());
                        });
                        break;
                    case 'expiring_soon':
                        $query->whereHas('batch', function ($q) {
                            $q->where('expire_date', '<=', now()->addDays(30))
                              ->where('expire_date', '>=', now());
                        });
                        break;
                    case 'valid':
                        $query->whereHas('batch', function ($q) {
                            $q->where('expire_date', '>', now());
                        });
                        break;
                }
            }

            // Apply sorting
            $allowedSorts = ['created_at', 'reference_number', 'quantity', 'total', 'price'];
            if (in_array($sortBy, $allowedSorts)) {
                $query->orderBy($sortBy, $sortOrder);
            } elseif ($sortBy === 'product.name') {
                $query->join('products', 'warehouse_incomes.product_id', '=', 'products.id')
                      ->orderBy('products.name', $sortOrder)
                      ->select('warehouse_incomes.*');
            } elseif ($sortBy === 'batch.reference_number') {
                $query->leftJoin('batches', 'warehouse_incomes.batch_id', '=', 'batches.id')
                      ->orderBy('batches.reference_number', $sortOrder)
                      ->select('warehouse_incomes.*');
            } else {
                $query->orderBy('created_at', 'desc');
            }

            // Get paginated results
            $incomes = $query->paginate($perPage)->withQueryString();

            // Transform the data
            $incomes->getCollection()->transform(function ($income) {
                return [
                    'id' => $income->id,
                    'reference_number' => $income->reference_number,
                    'product' => [
                        'id' => $income->product->id,
                        'name' => $income->product->name,
                        'barcode' => $income->product->barcode,
                        'type' => $income->product->type,
                    ],
                    'batch' => $income->batch ? [
                        'id' => $income->batch->id,
                        'reference_number' => $income->batch->reference_number,
                        'issue_date' => $income->batch->issue_date,
                        'expire_date' => $income->batch->expire_date,
                        'notes' => $income->batch->notes,
                        'wholesale_price' => $income->batch->wholesale_price,
                        'retail_price' => $income->batch->retail_price,
                        'purchase_price' => $income->batch->purchase_price,
                        'unit_type' => $income->batch->unit_type,
                        'unit_name' => $income->batch->unit_name,
                        'unit_amount' => $income->batch->unit_amount,
                        'quantity' => $income->batch->quantity,
                        'total' => $income->batch->total,
                        'expiry_status' => $this->getExpiryStatus($income->batch->expire_date),
                        'days_to_expiry' => $this->getDaysToExpiry($income->batch->expire_date),
                    ] : null,
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
                'filters' => [
                    'search' => $search,
                    'date_filter' => $dateFilter,
                    'batch_filter' => $batchFilter,
                    'sort_by' => $sortBy,
                    'sort_order' => $sortOrder,
                    'per_page' => $perPage,
                ],
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
                $batch = Batch::where('reference_number', $item['batch_reference'])
                    ->where('product_id', $item['product_id'])
                    ->first();

                if (!$batch) {
                    // Create new batch
                    $batch = Batch::create([
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

    /**
     * Get expiry status for a batch
     */
    private function getExpiryStatus($expireDate)
    {
        if (!$expireDate) {
            return 'no_expiry';
        }

        $expireDate = new \DateTime($expireDate);
        $now = new \DateTime();
        $thirtyDaysFromNow = (new \DateTime())->modify('+30 days');

        if ($expireDate < $now) {
            return 'expired';
        } elseif ($expireDate <= $thirtyDaysFromNow) {
            return 'expiring_soon';
        } else {
            return 'valid';
        }
    }

    /**
     * Get days to expiry for a batch
     */
    private function getDaysToExpiry($expireDate)
    {
        if (!$expireDate) {
            return null;
        }

        $expireDate = new \DateTime($expireDate);
        $now = new \DateTime();
        $diff = $now->diff($expireDate);
        
        return $diff->invert ? -$diff->days : $diff->days;
    }
}