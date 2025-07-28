<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Observers\PurchaseItemObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([PurchaseItemObserver::class])]
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

    public function additionalCosts()
    {
        return $this->hasMany(PurchaseHasAddionalCosts::class);
    }
    public function getActualAmountAttribute()
    {
        return $this->total_price + $this->additionalCosts->sum('amount');
    }
}
