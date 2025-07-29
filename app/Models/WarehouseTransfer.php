<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class WarehouseTransfer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference_number',
        'from_warehouse_id',
        'to_warehouse_id',
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

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function transferItems(): HasMany
    {
        return $this->hasMany(TransferItem::class);
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

        \DB::beginTransaction();
        try {
            foreach ($this->transferItems as $item) {
                // Create outcome record for source warehouse
                WarehouseOutcome::create([
                    'reference_number' => $this->reference_number,
                    'warehouse_id' => $this->from_warehouse_id,
                    'product_id' => $item->product_id,
                    'batch_id' => $item->batch_id,
                    'quantity' => $item->quantity,
                    'price' => $item->unit_price,
                    'total' => $item->total_price,
                    'model_type' => 'App\\Models\\WarehouseTransfer',
                    'model_id' => $this->id,
                    'unit_type' => $item->unit_type,
                    'unit_id' => $item->unit_id,
                    'unit_amount' => $item->unit_amount,
                    'unit_name' => $item->unit_name,
                    'notes' => "Transfer to {$this->toWarehouse->name}"
                ]);

                // Create income record for destination warehouse
                WarehouseIncome::create([
                    'reference_number' => $this->reference_number,
                    'warehouse_id' => $this->to_warehouse_id,
                    'product_id' => $item->product_id,
                    'batch_id' => $item->batch_id,
                    'quantity' => $item->quantity,
                    'price' => $item->unit_price,
                    'total' => $item->total_price,
                    'model_type' => 'App\\Models\\WarehouseTransfer',
                    'model_id' => $this->id,
                    'unit_type' => $item->unit_type,
                    'unit_id' => $item->unit_id,
                    'unit_amount' => $item->unit_amount,
                    'unit_name' => $item->unit_name,
                    'notes' => "Transfer from {$this->fromWarehouse->name}"
                ]);
            }

            $this->status = 'completed';
            $this->completed_at = now();
            $this->save();

            \DB::commit();
            return true;
        } catch (\Exception $e) {
            \DB::rollback();
            throw $e;
        }
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
                $transfer->reference_number = 'TRF-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);
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