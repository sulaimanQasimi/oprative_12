<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseProduct extends Model
{
    // use SoftDeletes;
    protected $table = 'warehouse_product_movements';

    /**
     * The attributes that are mass assignable.
     *
     * @var array
     */
    protected $fillable = [
        'id',
        'warehouse_id',
        'product_id',
        'quantity',
        'net_quantity',
        'price',
        'total_price'
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function warehouseIncome(): HasMany
    {
        return $this->hasMany(WarehouseIncome::class, 'product_id', 'product_id')
            ->where('warehouse_id', $this->warehouse_id);
    }

    public function warehouseOutcome(): HasMany
    {
        return $this->hasMany(WarehouseOutcome::class, 'product_id', 'product_id')
            ->where('warehouse_id', $this->warehouse_id);
    }
}
