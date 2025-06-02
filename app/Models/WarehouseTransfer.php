<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WarehouseTransfer extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'reference_number',
        'from_warehouse_id',
        'to_warehouse_id',
        'product_id',
        'quantity',
        'price',
        'total',
        'status',
        'notes',
        'created_by',
        'transfer_date'
    ];

    protected $casts = [
        'transfer_date' => 'datetime'
    ];

    public function fromWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'from_warehouse_id');
    }

    public function toWarehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class, 'to_warehouse_id');
    }

    public function product(): BelongsTo
    {
        return $this->belongsTo(Product::class);
    }

    public function creator(): BelongsTo
    {
        return $this->belongsTo(User::class, 'created_by');
    }

    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeCompleted($query)
    {
        return $query->where('status', 'completed');
    }

    public function complete()
    {
        if ($this->status !== 'pending') {
            return false;
        }

        $this->fromWarehouse->adjustStock($this->product_id, -$this->quantity);
        $this->toWarehouse->adjustStock($this->product_id, $this->quantity);

        $this->status = 'completed';
        $this->save();

        return true;
    }
}