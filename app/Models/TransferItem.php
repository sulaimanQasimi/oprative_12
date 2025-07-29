<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class TransferItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'warehouse_transfer_id',
        'product_id',
        'batch_id',
        'quantity',
        'unit_price',
        'total_price',
        'unit_type',
        'unit_id',
        'unit_amount',
        'unit_name',
        'notes'
    ];

    protected $casts = [
        'quantity' => 'decimal:2',
        'unit_price' => 'decimal:2',
        'total_price' => 'decimal:2',
        'unit_amount' => 'decimal:2',
    ];

    public function warehouseTransfer(): BelongsTo
    {
        return $this->belongsTo(WarehouseTransfer::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function batch(): BelongsTo
    {
        return $this->belongsTo(Batch::class);
    }

    public function unit(): BelongsTo
    {
        return $this->belongsTo(Unit::class);
    }

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id', 'id')
            ->through('warehouseTransfer');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id', 'id')
            ->through('warehouseTransfer');
    }

    protected static function booted()
    {
        static::creating(function ($item) {
            if (empty($item->total_price) && $item->quantity && $item->unit_price) {
                $item->total_price = $item->quantity * $item->unit_price;
            }
        });

        static::updating(function ($item) {
            if ($item->isDirty(['quantity', 'unit_price'])) {
                $item->total_price = $item->quantity * $item->unit_price;
            }
        });
    }
} 