<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerStockIncome extends Model
{
    protected $fillable = [
        'reference_number',
        'customer_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'model_type',
        'model_id'
    ];

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
