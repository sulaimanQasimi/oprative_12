<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Currency extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'code',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'exchange_rate' => 'float',
        'is_default' => 'boolean',
        'is_active' => 'boolean',
    ];

    /**
     * Get the default currency
     *
     * @return Currency|null
     */
    public static function getDefault()
    {
        return self::where('is_default', true)->first();
    }

    /**
     * Get all active currencies
     *
     * @return \Illuminate\Database\Eloquent\Collection
     */
    public static function getActive()
    {
        return self::where('is_active', true)->orderBy('is_default', 'desc')->orderBy('name')->get();
    }
}
