<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class MarketOrder extends Model
{
    protected $fillable = [
        'order_number',
        'total_amount',
        'status',
        'customer_id',
        'subtotal',
        'tax_amount',
        'discount_amount',
        'payment_method',
        'payment_status',
        'order_status',
        'notes'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($order) {
            $order->order_number = static::generateOrderNumber();
        });
    }

    protected static function generateOrderNumber()
    {
        $prefix = 'ORD';
        $year = date('Y');
        $month = date('m');

        $latestOrder = static::where('order_number', 'like', "{$prefix}{$year}{$month}%")
            ->orderBy('order_number', 'desc')
            ->first();

        if ($latestOrder) {
            $sequence = intval(substr($latestOrder->order_number, -4)) + 1;
        } else {
            $sequence = 1;
        }

        return sprintf("%s%s%s%04d", $prefix, $year, $month, $sequence);
    }

    public function items()
    {
        return $this->hasMany(MarketOrderItem::class);
    }

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }
}
