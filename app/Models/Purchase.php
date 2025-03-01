<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Purchase extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'user_id',
        'supplier_id',
        'currency_id',
        'invoice_number',
        'invoice_date',
        'currency_rate',
        'status',
        'warehouse_id',
        'is_moved_to_warehouse',

    ];

    protected $casts = [
        'invoice_date' => 'date'
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function supplier(): BelongsTo
    {
        return $this->belongsTo(Supplier::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(PurchasePayment::class);
    }

    public function getTotalPaidAttribute(): float
    {
        return $this->payments()->sum('amount');
    }
    public function purchasePayments()
    {
        return $this->hasMany(PurchasePayment::class);
    }
    public function warehouse()
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function getRemainingBalanceAttribute(): float
    {
        $total = $this->items()->sum('total');
        return $total - $this->total_paid;
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function getTotalAmountAttribute(){
        return $this->purchaseItems()->sum('total_price');
    }
}
