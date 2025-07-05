<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseBatchInventory extends Model
{
    /**
     * The table associated with the model.
     *
     * @var string
     */
    protected $table = 'warehouse_batch_inventory';

    /**
     * Indicates if the model should be timestamped.
     *
     * @var bool
     */
    public $timestamps = false;

    /**
     * The primary key for the model.
     *
     * @var string
     */
    protected $primaryKey = 'batch_id';

    /**
     * The attributes that should be cast.
     *
     * @var array
     */
    protected $casts = [
        'issue_date' => 'date',
        'expire_date' => 'date',
        'income_qty' => 'decimal:2',
        'outcome_qty' => 'decimal:2',
        'remaining_qty' => 'decimal:2',
        'total_income_value' => 'decimal:2',
        'total_outcome_value' => 'decimal:2',
        'days_to_expiry' => 'integer',
    ];

    /**
     * Get the product that owns the batch.
     */
    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Get the warehouse for this inventory record.
     */
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    /**
     * Get the batch for this inventory record.
     */
    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    /**
     * Scope for expired batches.
     */
    public function scopeExpired($query)
    {
        return $query->where('expiry_status', 'expired');
    }

    /**
     * Scope for expiring soon batches.
     */
    public function scopeExpiringSoon($query)
    {
        return $query->where('expiry_status', 'expiring_soon');
    }

    /**
     * Scope for valid batches.
     */
    public function scopeValid($query)
    {
        return $query->where('expiry_status', 'valid');
    }

    /**
     * Scope for batches with remaining quantity.
     */
    public function scopeWithStock($query)
    {
        return $query->where('remaining_qty', '>', 0);
    }

    /**
     * Scope for specific warehouse.
     */
    public function scopeForWarehouse($query, $warehouseId)
    {
        return $query->where('warehouse_id', $warehouseId);
    }

    /**
     * Scope for specific product.
     */
    public function scopeForProduct($query, $productId)
    {
        return $query->where('product_id', $productId);
    }

    /**
     * Get the expiry status badge color.
     */
    public function getExpiryStatusColorAttribute()
    {
        return match ($this->expiry_status) {
            'expired' => 'red',
            'expiring_soon' => 'orange',
            'valid' => 'green',
            default => 'gray'
        };
    }

    /**
     * Get formatted expiry status.
     */
    public function getFormattedExpiryStatusAttribute()
    {
        return match ($this->expiry_status) {
            'expired' => 'Expired',
            'expiring_soon' => 'Expiring Soon',
            'valid' => 'Valid',
            default => 'Unknown'
        };
    }

    /**
     * Check if batch is expired.
     */
    public function isExpired()
    {
        return $this->expiry_status === 'expired';
    }

    /**
     * Check if batch is expiring soon.
     */
    public function isExpiringSoon()
    {
        return $this->expiry_status === 'expiring_soon';
    }

    /**
     * Check if batch has stock.
     */
    public function hasStock()
    {
        return $this->remaining_qty > 0;
    }
} 