<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerStockOutcome extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'product_id',
        'reference_number',
        'description',
        'quantity',
        'reason',
        'total',
        'price',
        'status',
        'unit_type',
        'is_wholesale',
        'unit_id',
        'unit_amount',
        'unit_name',
        'batch_id',
        'batch_reference',
        'batch_number',
        'notes'
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'product_id' => 'integer',
        'is_wholesale' => 'boolean',
        'quantity' => 'float',
        'total' => 'float',
        'price' => 'float',
        'unit_amount' => 'float',
        'batch_id' => 'integer',
    ];

    // Relationships
    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    public function batch()
    {
        return $this->belongsTo(Batch::class);
    }

    public function marketOrderItems()
    {
        return $this->hasMany(MarketOrderItem::class, 'outcome_id');
    }
}
