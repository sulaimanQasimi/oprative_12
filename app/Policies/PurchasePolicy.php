<?php

namespace App\Policies;

use App\Models\Purchase;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class PurchasePolicy
{
    /**
     * Determine whether the user can view any purchases.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_purchase');
    }

    /**
     * Determine whether the user can view the purchase.
     */
    public function view(User $user, Purchase $purchase): bool
    {
        return $user->can('view_purchase');
    }

    /**
     * Determine whether the user can create purchases.
     */
    public function create(User $user): bool
    {
        return $user->can('create_purchase');
    }

    /**
     * Determine whether the user can update the purchase.
     */
    public function update(User $user, Purchase $purchase): bool
    {
        // Cannot update if already moved to warehouse
        if ($purchase->status === 'warehouse_moved') {
            return false;
        }
        
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can delete the purchase.
     */
    public function delete(User $user, Purchase $purchase): bool
    {
        // Cannot delete if has items or payments
        if ($purchase->purchaseItems()->count() > 0 || $purchase->payments()->count() > 0) {
            return false;
        }
        
        return $user->can('delete_purchase');
    }

    /**
     * Determine whether the user can restore the purchase.
     */
    public function restore(User $user, Purchase $purchase): bool
    {
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can permanently delete the purchase.
     */
    public function forceDelete(User $user, Purchase $purchase): bool
    {
        return $user->can('delete_purchase');
    }

    /**
     * Determine whether the user can manage purchase items.
     */
    public function manageItems(User $user, Purchase $purchase): bool
    {
        // Cannot manage items if already moved to warehouse
        if ($purchase->status === 'warehouse_moved') {
            return false;
        }
        
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can add purchase items.
     */
    public function createItems(User $user, Purchase $purchase): bool
    {
        return $this->manageItems($user, $purchase);
    }

    /**
     * Determine whether the user can delete purchase items.
     */
    public function deleteItems(User $user, Purchase $purchase): bool
    {
        return $this->manageItems($user, $purchase);
    }

    /**
     * Determine whether the user can update purchase items.
     */
    public function updateItems(User $user, Purchase $purchase): bool
    {
        // Cannot update items if already moved to warehouse
        if ($purchase->status === 'warehouse_moved') {
            return false;
        }
        
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can view purchase items.
     */
    public function viewItems(User $user, Purchase $purchase): bool
    {
        return $user->can('view_purchase');
    }

    /**
     * Determine whether the user can manage item-specific additional costs.
     */
    public function manageItemAdditionalCosts(User $user, Purchase $purchase): bool
    {
        // Cannot manage item costs if already moved to warehouse
        if ($purchase->status === 'warehouse_moved') {
            return false;
        }
        
        return $user->can('manage_item_additional_costs');
    }

    /**
     * Determine whether the user can create item-specific additional costs.
     */
    public function createItemAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $this->manageItemAdditionalCosts($user, $purchase);
    }

    /**
     * Determine whether the user can update item-specific additional costs.
     */
    public function updateItemAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $this->manageItemAdditionalCosts($user, $purchase);
    }

    /**
     * Determine whether the user can delete item-specific additional costs.
     */
    public function deleteItemAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $this->manageItemAdditionalCosts($user, $purchase);
    }

    /**
     * Determine whether the user can manage item pricing.
     */
    public function manageItemPricing(User $user, Purchase $purchase): bool
    {
        // Cannot manage pricing if already moved to warehouse
        if ($purchase->status === 'warehouse_moved') {
            return false;
        }
        
        return $user->can('manage_item_pricing');
    }

    /**
     * Determine whether the user can update item pricing.
     */
    public function updateItemPricing(User $user, Purchase $purchase): bool
    {
        return $this->manageItemPricing($user, $purchase);
    }

    /**
     * Determine whether the user can manage purchase payments.
     */
    public function managePayments(User $user, Purchase $purchase): bool
    {
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can add purchase payments.
     */
    public function createPayments(User $user, Purchase $purchase): bool
    {
        return $this->managePayments($user, $purchase);
    }

    /**
     * Determine whether the user can delete purchase payments.
     */
    public function deletePayments(User $user, Purchase $purchase): bool
    {
        return $this->managePayments($user, $purchase);
    }

    /**
     * Determine whether the user can manage additional costs.
     */
    public function manageAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can add additional costs.
     */
    public function createAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $this->manageAdditionalCosts($user, $purchase);
    }

    /**
     * Determine whether the user can delete additional costs.
     */
    public function deleteAdditionalCosts(User $user, Purchase $purchase): bool
    {
        return $this->manageAdditionalCosts($user, $purchase);
    }

    /**
     * Determine whether the user can transfer to warehouse.
     */
    public function warehouseTransfer(User $user, Purchase $purchase): bool
    {
        // Only allow warehouse transfer for arrived purchases that haven't been moved yet
        if ($purchase->status !== 'arrived' || $purchase->is_moved_to_warehouse) {
            return false;
        }
        
        return $user->can('update_purchase');
    }

    /**
     * Determine whether the user can print purchases.
     */
    public function print(User $user, Purchase $purchase): bool
    {
        return $user->can('view_purchase');
    }

    /**
     * Determine whether the user can export purchases.
     */
    public function export(User $user): bool
    {
        return $user->can('view_purchase');
    }

    /**
     * Determine whether the user can store warehouse transfers.
     */
    public function storeWarehouseTransfer(User $user, Purchase $purchase): bool
    {
        return $this->warehouseTransfer($user, $purchase);
    }
}
