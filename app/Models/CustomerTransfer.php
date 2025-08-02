<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class CustomerTransfer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference_number',
        'from_customer_id',
        'to_customer_id',
        'status',
        'notes',
        'created_by',
        'transfer_date',
        'completed_at'
    ];

    protected $casts = [
        'transfer_date' => 'datetime',
        'completed_at' => 'datetime'
    ];

    public function fromCustomer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'from_customer_id');
    }

    public function toCustomer(): BelongsTo
    {
        return $this->belongsTo(Customer::class, 'to_customer_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function transferItems(): HasMany
    {
        return $this->hasMany(CustomerTransferItem::class);
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function scopeCancelled($query)
    {
        return $query->where('status', 'cancelled');
    }

    public function getTotalAmountAttribute()
    {
        return $this->transferItems->sum('total_price');
    }

    public function getTotalQuantityAttribute()
    {
        return $this->transferItems->sum('quantity');
    }

    public function complete()
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'completed';
        $this->completed_at = now();
        $this->save();

        return true;
    }

    public function cancel()
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->status = 'cancelled';
        $this->save();

        return true;
    }

    protected static function booted()
    {
        static::creating(function ($transfer) {
            if (empty($transfer->reference_number)) {
                $transfer->reference_number = 'CTRF-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
            }
            if (empty($transfer->transfer_date)) {
                $transfer->transfer_date = now();
            }
            if (empty($transfer->status)) {
                $transfer->status = 'pending';
            }
        });
    }
} 