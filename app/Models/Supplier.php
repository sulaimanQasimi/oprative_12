<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Supplier extends Model
{
    use SoftDeletes;
    use HasFactory;

    protected $fillable = [
        'name',
        'contact_name',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'image',
        'id_number',
    ];

    protected $appends = ['invoice_total'];

    public function purchases()
    {
        return $this->hasMany(Purchase::class);
    }

    public function getInvoiceTotalAttribute()
    {
        return $this->purchases()
            ->join('purchase_items', 'purchases.id', '=', 'purchase_items.purchase_id')
            ->sum('purchase_items.total_price');
    }
}
