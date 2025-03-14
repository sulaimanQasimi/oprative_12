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
        'total'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
