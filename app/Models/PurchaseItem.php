<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Observers\PurchaseItemObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

/**
 * Summary of PurchaseItem
 * @property int $id
 * @property int $purchase_id
 * @property int $product_id
 * @property float $quantity
 * @property float $price
 * @property float $total_price
 * @property string $unit_type
 * @property float $unit_amount
 * @property bool $is_wholesale
 */
#[ObservedBy([PurchaseItemObserver::class])]
class PurchaseItem extends Model
{
    /**
     * Summary of use SoftDeletes
     * @var bool
     */
    use SoftDeletes;

    /**
     * Summary of timestamps
     * @var bool
     */
    public $timestamps = true;

    /**
     * Summary of fillable
     * @var array<string>
     */
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

    /**
     * Summary of purchase
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Purchase, PurchaseItem>
     */
    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    /**
     * Summary of product
     * @return \Illuminate\Database\Eloquent\Relations\BelongsTo<Product, PurchaseItem>
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Summary of batch
     * @return \Illuminate\Database\Eloquent\Relations\HasOne<Batch, PurchaseItem>
     */
    public function batch()  {
        return $this->hasOne(Batch::class);
    }

    /**
     * Summary of additionalCosts
     * @return \Illuminate\Database\Eloquent\Relations\HasMany<PurchaseHasAddionalCosts, PurchaseItem>
     */
    public function additionalCosts()
    {
        return $this->hasMany(PurchaseHasAddionalCosts::class);
    }

    /**
     * Summary of getActualAmountAttribute
     * @return float|int
     */
    public function getActualAmountAttribute()
    {
        return $this->total_price + $this->additionalCosts->sum('amount');
    }
}
