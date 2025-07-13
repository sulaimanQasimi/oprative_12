<?php
namespace App\Http\Controllers\Admin\Warehouse;

use App\Models\{Warehouse, Product, Unit, WarehouseIncome, Batch};
use Illuminate\Http\Request;
use Illuminate\Support\Facades\{DB, Log};
use Inertia\Inertia;

trait IncomeController
{
    public function income(Warehouse $warehouse, Request $request)
    {
        try {
            // Get query parameters for filtering and pagination
            $search = $request->get('search');
            $dateFilter = $request->get('date_filter');
            $batchFilter = $request->get('batch_filter');
            $sortBy = $request->get('sort_by', 'created_at');
            $sortOrder = $request->get('sort_order', 'desc');
            $perPage = $request->get('per_page', 15);

            // Build the query
            $query = WarehouseIncome::where('warehouse_id', $warehouse->id)
                ->with([
                    'product:id,name,barcode,type',
                    'batch:id,reference_number,issue_date,expire_date,notes,unit_name,unit_amount,purchase_price,wholesale_price,retail_price,quantity,total,unit_type'
                ]);

            // Apply search filter
            if ($search) {
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                      ->orWhereHas('product', function ($pq) use ($search) {
                          $pq->where('name', 'like', "%{$search}%")
                             ->orWhere('barcode', 'like', "%{$search}%")
                             ->orWhere('type', 'like', "%{$search}%");
                      })
                      ->orWhereHas('batch', function ($bq) use ($search) {
                          $bq->where('reference_number', 'like', "%{$search}%");
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
                              ->where('expire_date', '>', now());
                        });
                        break;
                    case 'valid':
                        $query->whereHas('batch', function ($q) {
                            $q->where('expire_date', '>', now()->addDays(30))
                              ->orWhereNull('expire_date');
                        });
                        break;
                }
            }

            // Apply sorting
            if ($sortBy === 'product.name') {
                $query->join('products', 'warehouse_incomes.product_id', '=', 'products.id')
                      ->orderBy('products.name', $sortOrder)
                      ->select('warehouse_incomes.*');
            } elseif ($sortBy === 'batch.reference_number') {
                $query->join('batches', 'warehouse_incomes.batch_id', '=', 'batches.id')
                      ->orderBy('batches.reference_number', $sortOrder)
                      ->select('warehouse_incomes.*');
            } else {
                $query->orderBy($sortBy, $sortOrder);
            }

            // Get paginated results
            $incomes = $query->paginate($perPage);

            // Transform the data to match the expected format
            $transformedIncomes = $incomes->getCollection()->map(function ($income) {
                // Calculate days to expiry for batch
                $daysToExpiry = null;
                $expiryStatus = null;
                
                if ($income->batch && $income->batch->expire_date) {
                    $daysToExpiry = now()->diffInDays($income->batch->expire_date, false);
                    
                    if ($daysToExpiry < 0) {
                        $expiryStatus = 'expired';
                    } elseif ($daysToExpiry <= 30) {
                        $expiryStatus = 'expiring_soon';
                    } else {
                        $expiryStatus = 'valid';
                    }
                } elseif ($income->batch) {
                    $expiryStatus = 'no_expiry';
                }

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
                        'unit_name' => $income->batch->unit_name,
                        'unit_amount' => $income->batch->unit_amount,
                        'purchase_price' => $income->batch->purchase_price,
                        'wholesale_price' => $income->batch->wholesale_price,
                        'retail_price' => $income->batch->retail_price,
                        'quantity' => $income->batch->quantity,
                        'total' => $income->batch->total,
                        'days_to_expiry' => $daysToExpiry,
                        'expiry_status' => $expiryStatus,
                    ] : null,
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'unit_type' => $income->unit_type,
                    'unit_name' => $income->unit_name,
                    'is_wholesale' => $income->is_wholesale,
                    'unit_amount' => $income->unit_amount,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ];
            });

            // Replace the collection with transformed data
            $incomes->setCollection($transformedIncomes);

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
                'product_id' => 'required|exists:products,id',
                'unit_id' => 'required|exists:units,id',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'total_price' => 'required|numeric|min:0',
                'unit_type' => 'required|in:wholesale,retail',
                'unit_amount' => 'required|numeric|min:1',
                'is_wholesale' => 'required|boolean',
                'notes' => 'nullable|string|max:1000',
                'batch' => 'required|array',
                'batch.issue_date' => 'required|date',
                'batch.expire_date' => 'nullable|date|after:batch.issue_date',
                'batch.purchase_price' => 'nullable|numeric|min:0',
                'batch.wholesale_price' => 'nullable|numeric|min:0',
                'batch.retail_price' => 'nullable|numeric|min:0',
                'batch.notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Generate reference number for the income transaction
            $referenceNumber = 'INC-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            // Get the product with unit information
            $product = Product::with(['unit'])->findOrFail($validated['product_id']);
            $unit = Unit::findOrFail($validated['unit_id']);

            // Create new batch
            $batch = Batch::create([
                'product_id' => $validated['product_id'],
                'issue_date' => $validated['batch']['issue_date'],
                'expire_date' => $validated['batch']['expire_date'] ?? null,
                'notes' => $validated['batch']['notes'] ?? null,
                'wholesale_price' => $validated['batch']['wholesale_price'] ?? null,
                'retail_price' => $validated['batch']['retail_price'] ?? null,
                'purchase_price' => $validated['batch']['purchase_price'] ?? $validated['price'],
                'unit_type' => $validated['unit_type'],
                'unit_name' => $unit->name,
                'unit_amount' => $validated['unit_amount'],
                'quantity' => $validated['quantity'],
                'total' => $validated['total_price'],
            ]);

            // Create the income record
            WarehouseIncome::create([
                'reference_number' => $referenceNumber,
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'batch_id' => $batch->id,
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $validated['total_price'],
                'unit_type' => $validated['unit_type'],
                'is_wholesale' => $validated['is_wholesale'],
                'unit_id' => $validated['unit_id'],
                'unit_amount' => $validated['unit_amount'],
                'unit_name' => $unit->name,
            ]);


            DB::commit();

            return redirect()->route('admin.warehouses.income', $warehouse->id)
                ->with('success', 'Income record created successfully.');
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