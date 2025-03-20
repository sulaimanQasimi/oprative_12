<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerStockOutcome extends Model
{
    protected $fillable = [
        'reference_number',
        'customer_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'model_type',
        'model_id'
    ];

    public function marketOrder()
    {
        return $this->belongsTo(MarketOrder::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
