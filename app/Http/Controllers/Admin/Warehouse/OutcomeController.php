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

            // Initialize variables
            $isWholesale = $validated['unit_type'] === 'wholesale';
            $unitId = null;
            $unitAmount = 1;
            $unitName = null;

            // Calculate actual quantity and available units based on unit type
            $requestedQuantity = $validated['quantity'];
            $actualQuantity = $requestedQuantity;
            $unitPrice = $validated['price'];
            $availableUnits = $availableStock;

            if ($isWholesale && $product->wholesaleUnit) {
                // If wholesale unit is selected, multiply by unit amount for actual quantity
                $actualQuantity = $requestedQuantity * $product->whole_sale_unit_amount;
                // For validation, check how many wholesale units are available
                $availableUnits = floor($availableStock / $product->whole_sale_unit_amount);
                $unitId = $product->wholesaleUnit->id;
                $unitAmount = $product->whole_sale_unit_amount;
                $unitName = $product->wholesaleUnit->name;
 
            } elseif (!$isWholesale && $product->retailUnit) {
                // For retail unit
                $unitId = $product->retailUnit->id;
                $unitAmount = $product->retails_sale_unit_amount ?? 1;
                $unitName = $product->retailUnit->name;
            }

            // Check if requested quantity exceeds available units for the selected unit type
            if ($requestedQuantity > $availableUnits) {
                $unitTypeName = $validated['unit_type'] === 'wholesale' ? 'wholesale units' : 'retail units';
                return redirect()->back()
                    ->with('error', "Insufficient stock. Available: {$availableUnits} {$unitTypeName}")
                    ->withInput()
                    ->withErrors(['quantity' => "Requested quantity ({$requestedQuantity}) cannot exceed available stock of {$availableUnits} {$unitTypeName}"]);
            }

            $total = $validated['quantity'] * $unitPrice;

            // Generate reference number
            $referenceNumber = 'OUT-' . $warehouse->code . '-' . date('YmdHis') . '-' . rand(100, 999);

            DB::beginTransaction();

            // Create the outcome record with all the new columns
            $outcome = WarehouseOutcome::create([
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