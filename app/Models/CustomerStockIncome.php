<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class CustomerStockIncome extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'product_id',
        'model_id',
        'reference_number',
        'description',
        'quantity',
        'price',
        'total',
        'unit_type',
        'is_wholesale',
        'unit_id',
        'unit_amount',
        'unit_name',
        'notes',
        'status'
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'product_id' => 'integer',
        'model_id' => 'integer',
        'unit_id' => 'integer',
        'quantity' => 'decimal:2',
        'price' => 'decimal:2',
        'total' => 'decimal:2',
        'unit_amount' => 'decimal:2',
        'is_wholesale' => 'boolean',
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

    public function model()
    {
        return $this->morphTo();
    }
}
