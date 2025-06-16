<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseHasAddionalCosts extends Model
{
    protected $table = 'purchase_has_addional_costs';
    
    public $timestamps = false;
    protected $fillable = [
        'purchase_id',
        'name',
        'amount',
    ];

    /**
     * Get the purchase that owns the additional cost.
     */
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }
}