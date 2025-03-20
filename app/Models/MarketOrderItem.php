<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketOrderItem extends Model
{
    protected $fillable = [
        'market_order_id',
        'product_id',
        'quantity',
        'unit_price',
        'subtotal',
        'discount_amount',
        'notes'
    ];

    public function order()
    {
        return $this->belongsTo(MarketOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
