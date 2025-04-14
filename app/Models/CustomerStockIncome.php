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
        'status'
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'product_id' => 'integer',
        'model_id' => 'integer',
        'quantity' => 'integer',
        'price' => 'decimal:2',
        'total' => 'decimal:2',
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

    public function model()
    {
        return $this->morphTo();
    }
}
