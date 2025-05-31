<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Unit extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'code',
    ];

    public function wholesaleProducts()
    {
        return $this->hasMany(Product::class, 'wholesale_unit_id');
    }

    public function retailProducts()
    {
        return $this->hasMany(Product::class, 'retail_unit_id');
    }
}
