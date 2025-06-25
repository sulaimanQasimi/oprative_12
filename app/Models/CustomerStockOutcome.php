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
        'status'
    ];

    protected $casts = [
        'customer_id' => 'integer',
        'product_id' => 'integer',
        'quantity' => 'integer',
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
}
