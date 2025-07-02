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
        static::saved(function ($batch) {
            if (empty($batch->reference_number)) {
                $date = $batch->issue_date ? $batch->issue_date->format('Ymd') : now()->format('Ymd');
                $batch->reference_number = $date . '-' . $batch->id;
                $batch->saveQuietly();
            }
        });
    }
} 