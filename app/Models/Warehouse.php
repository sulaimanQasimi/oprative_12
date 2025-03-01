<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Warehouse extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'branch_id',
        'name',
        'code',
        'description',
        'address',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function branch(): BelongsTo
    {
        return $this->belongsTo(Branch::class);
    }

    public function products(): BelongsToMany
    {
        return $this->belongsToMany(Product::class, 'warehouse_products')
            ->withPivot(['quantity', 'min_quantity', 'max_quantity'])
            ->withTimestamps();
    }

    public function transfersFrom(): HasMany
    {
        return $this->hasMany(WarehouseTransfer::class, 'from_warehouse_id');
    }

    public function transfersTo(): HasMany
    {
        return $this->hasMany(WarehouseTransfer::class, 'to_warehouse_id');
    }

    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function getStock($product_id)
    {
        return $this->products()->where('product_id', $product_id)->first()?->pivot->quantity ?? 0;
    }

    public function updateStock($product_id, $quantity)
    {
        $this->products()->syncWithoutDetaching([
            $product_id => ['quantity' => $quantity]
        ]);
    }

    public function adjustStock($product_id, $adjustment)
    {
        $current = $this->getStock($product_id);
        $this->updateStock($product_id, $current + $adjustment);
    }
}