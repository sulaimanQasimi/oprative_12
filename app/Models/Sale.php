<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Sale extends Model
{
    use HasFactory;

    protected $fillable = [
        'customer_id',
        'warehouse_id',
        'currency_id',
        'date',
        'reference',
        'status',
        'notes',
        'confirmed_by_warehouse',
        'confirmed_by_shop',
        'total'
    ];

    protected $casts = [
        'date' => 'datetime',
        'sale_date' => 'datetime',
        'tax_percentage' => 'decimal:2',
        'tax_amount' => 'decimal:2',
        'discount_percentage' => 'decimal:2',
        'discount_amount' => 'decimal:2',
        'shipping_cost' => 'decimal:2',
        'total_amount' => 'decimal:2',
        'paid_amount' => 'decimal:2',
        'due_amount' => 'decimal:2',
        'confirmed_by_warehouse' => 'boolean',
        'confirmed_by_shop' => 'boolean'
    ];

    public function customer(): BelongsTo
    {
        return $this->belongsTo(Customer::class);
    }

    public function salePayments(): HasMany
    {
        return $this->hasMany(SalePayment::class);
    }

    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }

    public function currency(): BelongsTo
    {
        return $this->belongsTo(Currency::class);
    }

    public function saleItems(): HasMany
    {
        return $this->hasMany(SaleItem::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CustomerPayment::class);
    }

    public function getStatusBadgeClass()
    {
        return match ($this->status) {
            'completed' => 'bg-green-100 text-green-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    /**
     * Get total amount (alias for total column)
     */
    public function getTotalAmountAttribute(): float
    {
        return (float) ($this->total ?? 0);
    }

    /**
     * Get paid amount from payments
     */
    public function getPaidAmountAttribute(): float
    {
        return $this->payments()->sum('amount');
    }

    /**
     * Get due amount (total - paid)
     */
    public function getDueAmountAttribute(): float
    {
        return $this->total_amount - $this->paid_amount;
    }
}
