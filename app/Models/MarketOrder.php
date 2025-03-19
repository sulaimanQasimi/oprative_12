<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class MarketOrder extends Model
{
    protected $fillable = [
        'total_amount',
        'status'
    ];

    public function items()
    {
        return $this->hasMany(MarketOrderItem::class);
    }
}
