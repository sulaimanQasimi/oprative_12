<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WarehouseOutcome extends Model
{
    protected $fillable = [
        'reference_number',
        'warehouse_id',
        'product_id',
        'quantity',
        'price',
        'total'
    ];

    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product()
    {
        return $this->belongsTo(Product::class);
    }
}
