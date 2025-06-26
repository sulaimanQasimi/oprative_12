<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Interfaces\Wallet;

class Warehouse extends Model implements Wallet
{
    use SoftDeletes;
    use HasWallet       ;

    protected $fillable = [
        'name',
        'code',
        'description',
        'address',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function products()
    {
        return $this->hasMany(WarehouseProduct::class);
    }

    public function productMovements()
    {
        return $this->hasMany(WarehouseProductMovement::class);
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

    public function items(): HasMany
    {
        return $this->hasMany(WarehouseProduct::class);
    }

    public function warehouseIncome(): HasMany
    {
        return $this->hasMany(WarehouseIncome::class);
    }

    public function warehouseOutcome(): HasMany
    {
        return $this->hasMany(WarehouseOutcome::class);
    }

    public function warehouseTransfers(): HasMany
    {
        return $this->hasMany(WarehouseTransfer::class, 'from_warehouse_id');
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    /**
     * Get the warehouse user relationships for this warehouse.
     */
    public function warehouseUsers(): HasMany
    {
        return $this->hasMany(WareHouseUser::class);
    }

    /**
     * Get the users assigned to this warehouse.
     */
    public function users(): HasMany
    {
        return $this->hasMany(WareHouseUser::class);
    }

    /**
     * Get the wallet for this warehouse.
     */
    public function wallet()
    {
        return $this->hasOne(\Bavix\Wallet\Models\Wallet::class, 'holder_id')
            ->where('holder_type', self::class);
    }
}
