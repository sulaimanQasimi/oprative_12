<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class PurchaseItem extends Model
{
    use SoftDeletes;

    public $timestamps = true;
    protected $fillable = [
        'purchase_id',
        'product_id',
        'quantity',
        'price',
        'total_price',
        'unit_type',
        'unit_amount',
        'is_wholesale'
    ];

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
    public function batch()  {
        return $this->hasOne(Batch::class);
    }
}
