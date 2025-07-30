<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class CustomerStockProduct extends Model
{
    protected $table = "customer_inventory";

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
