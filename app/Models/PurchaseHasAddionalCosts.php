<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PurchaseHasAddionalCosts extends Model
{
    protected $table = 'purchase_has_addional_costs';
    
    public $timestamps = true;
    protected $fillable = [
        'purchase_id',
        'purchase_item_id',
        'name',
        'amount',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
    ];

    /**
     * Get the purchase that owns the additional cost.
     */
    public function purchase(): BelongsTo
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * Get the purchase item that owns this additional cost.
     */
    public function purchaseItem(): BelongsTo
    {
        return $this->belongsTo(PurchaseItem::class);
    }
}