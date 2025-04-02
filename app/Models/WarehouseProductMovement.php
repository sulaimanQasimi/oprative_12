<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseProductMovement extends Model
{
    protected $table = 'warehouse_product_movements';

    // This is a database view, so we don't need timestamps
    public $timestamps = false;

    // Make all attributes accessible
    protected $guarded = [];

    // Primary keys for the view
    protected $primaryKey = null;
    public $incrementing = false;

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }
}
