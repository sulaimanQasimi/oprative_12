<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class WareHouseUser extends Model
{
    protected $fillable = [
        'warehouse_id',
        'is_active',
        'role'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    /**
     * Get the warehouse that the user is assigned to.
     */
    public function warehouse(): BelongsTo
    {
        return $this->belongsTo(Warehouse::class);
    }
}
