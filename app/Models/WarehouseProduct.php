<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseProduct extends Model
{
    use SoftDeletes;

    protected $table = 'warehouse_products';

    protected $fillable = [
        'warehouse_id',
        'product_id',
        'quantity',
        'minimum_quantity',
        'maximum_quantity',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'quantity' => 'integer',
        'minimum_quantity' => 'integer',
        'maximum_quantity' => 'integer'
    ];

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }
}