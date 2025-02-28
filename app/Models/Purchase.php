<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

    protected $casts = [
        'invoice_date' => 'date',
    ];

    protected $fillable = [
        'user_id',
        'supplier_id',
        'currency_id',
        'invoice_number',
        'invoice_date',
        'currency_rate',
        'total_amount',
        'status',
    ];

    public function currency()
    {
        return $this->belongsTo(Currency::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function supplier()
    {
        return $this->belongsTo(Supplier::class);
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }
}
