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
            // Get all products with their units, pricing information, and batches
            $products = Product::with(['wholesaleUnit', 'retailUnit', 'batches'])
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
                        'batches' => $product->batches->map(function ($batch) {
                            return [
                                'id' => $batch->id,
                                'reference_number' => $batch->reference_number,
                                'issue_date' => $batch->issue_date,
                                'expire_date' => $batch->expire_date,
                                'notes' => $batch->notes,
                                'wholesale_price' => $batch->wholesale_price,
                                'retail_price' => $batch->retail_price,
                                'purchase_price' => $batch->purchase_price,
                                'unit_type' => $batch->unit_type,
                                'unit_name' => $batch->unit_name,
                            ];
                        }),
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
                'batch_id' => 'nullable|exists:batches,id',
                'unit_type' => 'required|in:wholesale,retail',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Get the product with unit information
            $product = Product::with(['wholesaleUnit', 'retailUnit'])->findOrFail($validated['product_id']);

            // If batch_id is provided, validate it belongs to the selected product
            if (!empty($validated['batch_id'])) {
                $batch = \App\Models\Batch::where('id', $validated['batch_id'])
                    ->where('product_id', $validated['product_id'])
                    ->first();

                if (!$batch) {
                    return redirect()->back()
                        ->with('error', 'Selected batch does not belong to the selected product.')
                        ->withInput()
                        ->withErrors(['batch_id' => 'Selected batch does not belong to the selected product.']);
                }
            }

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
                'batch_id' => $validated['batch_id'] ?? null,
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