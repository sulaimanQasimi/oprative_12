<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PurchaseHasAddionalCosts extends Model
{
    public $timestamps = false;
    protected $fillable = [
        'purchase_id',
        'name',
        'amount',
    ];
}