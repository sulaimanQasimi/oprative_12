<?php

namespace App\Http\Controllers\Admin\Traits;

use App\Models\Purchase;
use App\Models\PurchaseHasAddionalCosts;
use App\Models\PurchaseItem;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

trait ManagesItemAdditionalCosts
{
    /**
     * Show the form for managing additional costs for a purchase item.
     */
    public function manageItemAdditionalCosts(Purchase $purchase,PurchaseItem $item)
    {
        $this->authorize('manageItemAdditionalCosts', $purchase);

        // Load item with relationships
        $item->load(['product.unit', 'additionalCosts']);

        // Get additional costs for this item
        $additionalCosts = $item->additionalCosts->map(function ($cost) {
            return [
                'id' => $cost->id,
                'name' => $cost->name,
                'amount' => $cost->amount,
                'description' => $cost->description,
                'created_at' => $cost->created_at,
                'updated_at' => $cost->updated_at,
            ];
        });

        $permissions = [
            'can_update_items' => Auth::user()->can('updateItems', $purchase),
            'can_manage_additional_costs' => Auth::user()->can('manageItemAdditionalCosts', $purchase),
            'can_create_additional_costs' => Auth::user()->can('createItemAdditionalCosts', $purchase),
            'can_update_additional_costs' => Auth::user()->can('updateItemAdditionalCosts', $purchase),
            'can_delete_additional_costs' => Auth::user()->can('deleteItemAdditionalCosts', $purchase),
        ];

        return Inertia::render('Admin/Purchase/ManageItemAdditionalCosts', [
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
            ],
            'additionalCosts' => $additionalCosts,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store additional cost for a purchase item.
     */
    public function storeItemAdditionalCost(Request $request, Purchase $purchase, PurchaseItem $item)
    {
        $this->authorize('createItemAdditionalCosts', $purchase);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'description' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Create the additional cost record
            $cost = PurchaseHasAddionalCosts::create([
                'purchase_id' => $purchase->id,
                'purchase_item_id' => $item->id,
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                'description' => $validated['description'] ?? null,
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Additional cost added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding item additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding additional cost: ' . $e->getMessage()]);
        }
    }

    /**
     * Update additional cost for a purchase item.
     */
    public function updateItemAdditionalCost(Request $request, Purchase $purchase, PurchaseItem $item, PurchaseHasAddionalCosts $cost)
    {
        $this->authorize('updateItemAdditionalCosts', $purchase);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
                'description' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Update the additional cost record
            $cost->update([
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                'description' => $validated['description'] ?? null,
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Additional cost updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating item additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating additional cost: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete additional cost for a purchase item.
     */
    public function destroyItemAdditionalCost(Purchase $purchase, PurchaseItem $item, PurchaseHasAddionalCosts $cost)
    {   
        $this->authorize('deleteItemAdditionalCosts', $purchase);

        try {
            DB::beginTransaction();

            $cost->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Additional cost deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting item additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting additional cost: ' . $e->getMessage());
        }
    }
} 