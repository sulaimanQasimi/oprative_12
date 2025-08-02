<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class CustomerTransferItem extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'customer_transfer_id',
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

    public function customerTransfer(): BelongsTo
    {
        return $this->belongsTo(CustomerTransfer::class);
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