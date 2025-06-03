<?php

namespace App\Models;

use App\Filament\Resources\ProductResource;
use App\Models\Contracts\HasResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    protected $fillable = [
        'type',
        'name',
        'barcode',
        'purchase_price',
        'wholesale_price',
        'retail_price',
        'purchase_profit',
        'wholesale_profit',
        'retail_profit',
        'is_activated',
        'is_in_stock',
        'is_shipped',
        'is_trend',
        'wholesale_unit_id',
        'retail_unit_id',
        'whole_sale_unit_amount',
        'retails_sale_unit_amount',
    ];

    protected $casts = [
        'purchase_price' => 'double',
        'wholesale_price' => 'double',
        'retail_price' => 'double',
        'purchase_profit' => 'double',
        'wholesale_profit' => 'double',
        'retail_profit' => 'double',
        'whole_sale_unit_amount' => 'double',
        'retails_sale_unit_amount' => 'double',
        'is_activated' => 'boolean',
        'is_in_stock' => 'boolean',
        'is_shipped' => 'boolean',
        'is_trend' => 'boolean',
    ];

    public function wholesaleUnit()
    {
        return $this->belongsTo(Unit::class, 'wholesale_unit_id');
    }

    public function retailUnit()
    {
        return $this->belongsTo(Unit::class, 'retail_unit_id');
    }

    public function purchaseItems()
    {
        return $this->hasMany(PurchaseItem::class);
    }

    public function saleItems()
    {
        return $this->hasMany(SaleItem::class);
    }

    public function warehouseProducts(){
        return $this->hasMany(WarehouseProduct::class,'product_id');
    }

    public function customerStockIncomes()
    {
        return $this->hasMany(CustomerStockIncome::class);
    }

    public function customerStockOutcomes()
    {
        return $this->hasMany(CustomerStockOutcome::class);
    }
}
