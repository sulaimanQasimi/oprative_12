<?php
namespace App\Http\Controllers\Admin\Traits;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Batch;
use App\Models\Product;
use App\Models\Unit;
use App\Models\PurchaseHasAddionalCosts;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

trait ItemManagement
{
    

    /**
     * Manage purchase items.
     */
    public function items(Purchase $purchase)
    {
        $this->authorize('viewItems', $purchase);
        
        $purchase->load(['purchaseItems.product.unit', 'supplier', 'currency']);
        $products = Product::with(['unit'])
            ->select('id', 'name', 'barcode', 'category_id', 'unit_id', 'type', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Purchase/Items', [
            'purchase' => $purchase,
            'purchaseItems' => $purchase->purchaseItems,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new purchase item.
     */
    public function createItem(Purchase $purchase)
    {
        $this->authorize('createItems', $purchase);

        $units = Unit::select('id', 'name', 'code')->orderBy('name')->get();
        $products = Product::with(['unit'])
            ->select('id', 'name', 'barcode', 'category_id', 'unit_id', 'type', 'status')
            ->orderBy('name')
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'stock_quantity' => 0, // Will be calculated from warehouse data
                    'purchase_price' => 0, // No longer stored in products table
                    'wholesale_price' => 0, // No longer stored in products table
                    'retail_price' => 0, // No longer stored in products table
                    'whole_sale_unit_amount' => 1, // Default value
                    'retails_sale_unit_amount' => 1, // Default value
                    'available_stock' => 0, // Will be calculated from warehouse data
                    'unit' => [
                        'id' => $product->unit_id,
                        'name' => $product->unit->name,
                        'code' => $product->unit->code,
                    ],
                ];
            });

        $permissions = [
            'can_create_items' => Auth::user()->can('createItems', $purchase),
        ];

        return Inertia::render('Admin/Purchase/CreateItem', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'products' => $products,
            'units' => $units,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store purchase item.
     */
    public function storeItem(Request $request, Purchase $purchase)
    {
        $this->authorize('createItems', $purchase);

        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'unit_id' => 'required|exists:units,id',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'total_price' => 'required|numeric|min:0',
                'unit_amount' => 'required|numeric|min:1',
                'is_wholesale' => 'required|boolean',
                'unit_type' => 'nullable|string|in:wholesale,retail',
                'notes' => 'nullable|string|max:1000', // Notes for purchase item (will be stored in batch)
                // Batch validation rules
                'batch.issue_date' => 'nullable|date',
                'batch.expire_date' => 'nullable|date|after_or_equal:batch.issue_date',
                'batch.notes' => 'nullable|string|max:1000',
            ]);

            // Set default unit_type if not provided
            if (!isset($validated['unit_type'])) {
                $validated['unit_type'] = 'wholesale';
            }

            DB::beginTransaction();

            // Get the product and unit information
            $product = Product::findOrFail($validated['product_id']);
            $unit = Unit::findOrFail($validated['unit_id']);

            // Calculate unit details
            $isWholesale = $validated['is_wholesale'];
            $unitId = $validated['unit_id'];
            $unitAmount = $validated['unit_amount'];
            $unitName = $unit->name;

            // Use the quantity as provided by the frontend (already calculated)
            $qty = $validated['quantity'] * $unitAmount;

            // Create the purchase item record
            $item = PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $validated['product_id'],
                'quantity' => $qty,
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
                'unit_amount' => $unitAmount,
                'is_wholesale' => $isWholesale,
            ]);



            // Create batch record if batch data is provided or notes are provided
            if ((isset($validated['batch']) && !empty(array_filter($validated['batch']))) || !empty($validated['notes'])) {
                Batch::create([
                    'product_id' => $validated['product_id'],
                    'purchase_id' => $purchase->id,
                    'purchase_item_id' => $item->id,
                    'issue_date' => $validated['batch']['issue_date'] ?? null,
                    'expire_date' => $validated['batch']['expire_date'] ?? null,
                    'quantity' => $qty,
                    'price' => $validated['price'],
                    'total' => $validated['total_price'],
                    'unit_type' => $validated['unit_type'],
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'notes' => $validated['batch']['notes'] ?? $validated['notes'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Purchase item added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding purchase item: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete purchase item.
     */
    public function destroyItem(Purchase $purchase, PurchaseItem $item)
    {
        $this->authorize('deleteItems', $purchase);

        try {
            DB::beginTransaction();
            $item->batch()->delete();
            $item->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Purchase item deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting purchase item: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing a purchase item.
     */
    public function editItem(Purchase $purchase, PurchaseItem $item)
    {
        $this->authorize('updateItems', $purchase);

        $units = Unit::select('id', 'name', 'code')->orderBy('name')->get();
        $products = Product::with(['unit'])
            ->select('id', 'name', 'barcode', 'category_id', 'unit_id', 'type', 'status')
            ->orderBy('name')
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'stock_quantity' => 0,
                    'purchase_price' => 0,
                    'wholesale_price' => 0,
                    'retail_price' => 0,
                    'whole_sale_unit_amount' => 1,
                    'retails_sale_unit_amount' => 1,
                    'available_stock' => 0,
                    'unit' => [
                        'id' => $product->unit_id,
                        'name' => $product->unit->name,
                        'code' => $product->unit->code,
                    ],
                ];
            });

        // Load item with relationships
        $item->load(['product.unit', 'batch', 'additionalCosts']);

        // Get additional costs for this item
        $additionalCosts = $item->additionalCosts->map(function ($cost) {
            return [
                'id' => $cost->id,
                'name' => $cost->name,
                'amount' => $cost->amount,
                'description' => $cost->description,
            ];
        });

        $permissions = [
            'can_update_items' => Auth::user()->can('updateItems', $purchase),
            'can_update' => Auth::user()->can('update', $purchase),
        ];

        return Inertia::render('Admin/Purchase/EditItem', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'item' => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'unit_id' => $item->batch ? $item->batch->unit_id : $item->product->unit_id, // Get unit_id from batch or fallback to product unit
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total_price' => $item->total_price,
                'unit_amount' => $item->unit_amount,
                'is_wholesale' => $item->is_wholesale,
                'unit_type' => $item->unit_type,
                'notes' => $item->batch ? $item->batch->notes : null, // Get notes from batch
                'product' => $item->product,
                'batch' => $item->batch ? [
                    'issue_date' => $item->batch->issue_date,
                    'expire_date' => $item->batch->expire_date,
                    'wholesale_price' => $item->batch->wholesale_price,
                    'retail_price' => $item->batch->retail_price,
                    'purchase_price' => $item->batch->purchase_price,
                    'notes' => $item->batch->notes,
                    'unit_id' => $item->batch->unit_id,
                    'unit_name' => $item->batch->unit_name,
                ] : null,
            ],
            'additionalCosts' => $additionalCosts,
            'products' => $products,
            'units' => $units,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update purchase item.
     */
    public function updateItem(Request $request, Purchase $purchase, PurchaseItem $item)
    {
        $this->authorize('update', $purchase);

        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'unit_id' => 'required|exists:units,id',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'total_price' => 'required|numeric|min:0',
                'unit_amount' => 'required|numeric|min:1',
                'is_wholesale' => 'required|boolean',
                'unit_type' => 'nullable|string|in:wholesale,retail',
                'notes' => 'nullable|string|max:1000',
                // Batch validation rules
                'batch.issue_date' => 'nullable|date',
                'batch.expire_date' => 'nullable|date|after_or_equal:batch.issue_date',
                'batch.notes' => 'nullable|string|max:1000',
            ]);

            // Set default unit_type if not provided
            if (!isset($validated['unit_type'])) {
                $validated['unit_type'] = 'wholesale';
            }

            DB::beginTransaction();

            // Get the product and unit information
            $product = Product::findOrFail($validated['product_id']);
            $unit = Unit::findOrFail($validated['unit_id']);

            // Calculate unit details
            $isWholesale = $validated['is_wholesale'];
            $unitId = $validated['unit_id'];
            $unitAmount = $validated['unit_amount'];
            $unitName = $unit->name;

            // Calculate the actual quantity to store in database
            $qty = $validated['quantity'] * $unitAmount;

            // Update the purchase item record
            $item->update([
                'product_id' => $validated['product_id'],
                'quantity' => $qty,
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
                'unit_amount' => $unitAmount,
                'is_wholesale' => $isWholesale,
            ]);

            // Always update or create batch record (ensure we have proper unit information)
            if ($item->batch) {
                // Update existing batch
                $item->batch->update([
                    'product_id' => $validated['product_id'],
                    'issue_date' => $validated['batch']['issue_date'] ?? $item->batch->issue_date,
                    'expire_date' => $validated['batch']['expire_date'] ?? $item->batch->expire_date,
                    'quantity' => $qty,
                    'price' => $validated['price'],
                    'total' => $validated['total_price'],
                    'unit_type' => $validated['unit_type'],
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'notes' => $validated['batch']['notes'] ?? $validated['notes'] ?? $item->batch->notes,
                ]);
            } else {
                // Create new batch to ensure we have proper unit information
                Batch::create([
                    'product_id' => $validated['product_id'],
                    'purchase_id' => $purchase->id,
                    'purchase_item_id' => $item->id,
                    'issue_date' => $validated['batch']['issue_date'] ?? null,
                    'expire_date' => $validated['batch']['expire_date'] ?? null,
                    'quantity' => $qty,
                    'price' => $validated['price'],
                    'total' => $validated['total_price'],
                    'unit_type' => $validated['unit_type'],
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'notes' => $validated['batch']['notes'] ?? $validated['notes'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.purchases.items.additional-costs', [$purchase->id, $item->id])
                ->with('success', 'Purchase item updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating purchase item: ' . $e->getMessage()]);
        }
    }

    /**
     * Show the form for creating a new additional cost.
     */
    public function createAdditionalCost(Purchase $purchase)
    {
        $this->authorize('createAdditionalCosts', $purchase);

        $permissions = [
            'can_create_additional_costs' => Auth::user()->can('createAdditionalCosts', $purchase),
        ];

        return Inertia::render('Admin/Purchase/CreateAdditionalCost', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store additional cost.
     */
    public function storeAdditionalCost(Request $request, Purchase $purchase)
    {
        $this->authorize('createAdditionalCosts', $purchase);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Create the additional cost record
            $cost = PurchaseHasAddionalCosts::create([
                'purchase_id' => $purchase->id,
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                // Note: description is not supported by the existing model
            ]);

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Additional cost added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding additional cost: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete additional cost.
     */
    public function destroyAdditionalCost(Purchase $purchase, PurchaseHasAddionalCosts $cost)
    {
        $this->authorize('deleteAdditionalCosts', $purchase);

        try {
            DB::beginTransaction();

            $cost->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Additional cost deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting additional cost: ' . $e->getMessage());
        }
    }
}