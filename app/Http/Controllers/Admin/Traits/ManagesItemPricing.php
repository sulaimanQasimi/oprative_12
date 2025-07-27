<?php

namespace App\Http\Controllers\Admin\Traits;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\Batch;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

trait ManagesItemPricing
{
    /**
     * Show the form for managing pricing for a purchase item.
     */
    public function manageItemPricing(Purchase $purchase, PurchaseItem $item)
    {
        // $this->authorize('updateItems', $purchase);

        // Load item with relationships
        $item->load(['product.unit', 'batch']);

        $permissions = [
            'can_update_items' => Auth::user()->can('updateItems', $purchase),
        ];

        return Inertia::render('Admin/Purchase/ManageItemPricing', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'item' => [
                'id' => $item->id,
                'product_id' => $item->product_id,
                'quantity' => $item->quantity,
                'price' => $item->price,
                'total_price' => $item->total_price,
                'unit_amount' => $item->unit_amount,
                'is_wholesale' => $item->is_wholesale,
                'unit_type' => $item->unit_type,
                'product' => $item->product,
                'batch' => $item->batch ? [
                    'id' => $item->batch->id,
                    'issue_date' => $item->batch->issue_date,
                    'expire_date' => $item->batch->expire_date,
                    'wholesale_price' => $item->batch->wholesale_price,
                    'retail_price' => $item->batch->retail_price,
                    'purchase_price' => $item->batch->purchase_price,
                    'notes' => $item->batch->notes,
                ] : null,
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update pricing for a purchase item.
     */
    public function updateItemPricing(Request $request, Purchase $purchase, PurchaseItem $item)
    {
        // $this->authorize('updateItems', $purchase);

        try {
            $validated = $request->validate([
                'wholesale_price' => 'nullable|numeric|min:0',
                'retail_price' => 'nullable|numeric|min:0',
                'purchase_price' => 'nullable|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Load item with batch
            $item->load('batch');

            if ($item->batch) {
                // Update existing batch pricing
                $item->batch->update([
                    'wholesale_price' => $validated['wholesale_price'],
                    'retail_price' => $validated['retail_price'],
                    'purchase_price' => $validated['purchase_price'],
                    'notes' => $validated['notes'],
                ]);
            } else {
                // Create new batch if it doesn't exist
                Batch::create([
                    'product_id' => $item->product_id,
                    'purchase_id' => $purchase->id,
                    'purchase_item_id' => $item->id,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'wholesale_price' => $validated['wholesale_price'],
                    'retail_price' => $validated['retail_price'],
                    'purchase_price' => $validated['purchase_price'],
                    'total' => $item->total_price,
                    'unit_type' => $item->unit_type,
                    'is_wholesale' => $item->is_wholesale,
                    'unit_id' => $item->product->unit_id,
                    'unit_amount' => $item->unit_amount,
                    'unit_name' => $item->product->unit->name,
                    'notes' => $validated['notes'],
                ]);
            }

            DB::commit();

            return redirect()->back()
                ->with('success', 'Item pricing updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating item pricing: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating pricing: ' . $e->getMessage()]);
        }
    }
} 