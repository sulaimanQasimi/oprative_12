<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

class Gate extends Model
{
    use SoftDeletes;
    protected $fillable = [
        'name',
        'user_id',
    ];

    /**
     * Get the user that owns the gate
     */
    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    /**
     * Get the employees assigned to this gate
     */
    public function employees(): HasMany
    {
        return $this->hasMany(Employee::class);
    }
}
