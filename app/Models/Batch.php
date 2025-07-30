<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Batch extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'issue_date',
        'expire_date',
        'reference_number',
        'product_id',
        'purchase_id',
        'purchase_item_id',
        'quantity',
        'price',
        'wholesale_price',
        'retail_price',
        'purchase_price',
        'total',
        'unit_type',
        'is_wholesale',
        'unit_id',
        'unit_amount',
        'unit_name',
        'notes',
    ];

    protected $casts = [
        'issue_date' => 'date',
        'expire_date' => 'date',
        'is_wholesale' => 'boolean',
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'wholesale_price' => 'decimal:2',
        'retail_price' => 'decimal:2',
        'purchase_price' => 'decimal:2',
        'total' => 'decimal:2',
        'unit_amount' => 'decimal:2',
    ];

    public function product() {
        return $this->belongsTo(Product::class);
    }

    public function unit() {
        return $this->belongsTo(Unit::class);
    }

    public function purchase()
    {
        return $this->belongsTo(Purchase::class);
    }

    public function purchaseItem()
    {
        return $this->belongsTo(PurchaseItem::class);
    }

    protected static function booted()
    {
        static::creating(function ($batch) {
            if (empty($batch->reference_number)) {
                $date = $batch->issue_date ? $batch->issue_date->format('Ymd') : now()->format('Ymd');
                $batch->reference_number = 'B-' . $date . '-' . uniqid();
            }
        });
    }

    /**
     * Scope to get remaining quantity of this batch in a specific warehouse.
     *
     * @param \Illuminate\Database\Eloquent\Builder $query
     * @param int $warehouseId
     * @return \Illuminate\Database\Eloquent\Builder
     */
    public function scopeWithRemainingForWarehouse($query, $warehouseId)
    {
        return $query->withCount(['warehouseIncomes as warehouse_income_sum' => function ($q) use ($warehouseId) {
            $q->where('warehouse_id', $warehouseId);
        }, 'warehouseOutcomes as warehouse_outcome_sum' => function ($q) use ($warehouseId) {
            $q->where('warehouse_id', $warehouseId);
        }]);
    }

    /**
     * Get remaining quantity of this batch in a specific warehouse.
     *
     * @param int $warehouseId
     * @return float
     */
    public function remainingQuantityInWarehouse($warehouseId)
    {
        $income = $this->warehouseIncomes()->where('warehouse_id', $warehouseId)->sum('quantity');
        $outcome = $this->warehouseOutcomes()->where('warehouse_id', $warehouseId)->sum('quantity');
        return $income - $outcome;
    }

    public function warehouseIncomes()
    {
        return $this->hasMany(WarehouseIncome::class, 'batch_id');
    }

    public function warehouseOutcomes()
    {
        return $this->hasMany(WarehouseOutcome::class, 'batch_id');
    }

    public function transferItems()
    {
        return $this->hasMany(TransferItem::class, 'batch_id');
    }
} 