<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use App\Observers\UnitObserver;
use Illuminate\Database\Eloquent\Attributes\ObservedBy;

#[ObservedBy([UnitObserver::class])]
class Unit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime',
    ];
}
