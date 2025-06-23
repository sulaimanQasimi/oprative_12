<?php

namespace App\Models;

use App\Filament\Resources\ProductResource;
use App\Models\Contracts\HasResource;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class Product extends Model
{
    // use SoftDeletes;

    protected $fillable = [
        'type',
        'name',
        'code',
        'description',
        'barcode',
        'image',
        'purchase_price',
        'wholesale_price',
        'retail_price',
        'cost',
        'price',
        'purchase_profit',
        'wholesale_profit',
        'retail_profit',
        'quantity',
        'min_quantity',
        'tax_rate',
        'status',
        'is_activated',
        'is_in_stock',
        'is_shipped',
        'is_trend',
        'unit_id',
        'wholesale_unit_id',
        'retail_unit_id',
        'whole_sale_unit_amount',
        'retails_sale_unit_amount',
    ];

    protected $casts = [
        'purchase_price' => 'double',
        'wholesale_price' => 'double',
        'retail_price' => 'double',
        'cost' => 'double',
        'price' => 'double',
        'purchase_profit' => 'double',
        'wholesale_profit' => 'double',
        'retail_profit' => 'double',
        'quantity' => 'integer',
        'min_quantity' => 'integer',
        'tax_rate' => 'double',
        'whole_sale_unit_amount' => 'double',
        'retails_sale_unit_amount' => 'double',
        'is_activated' => 'boolean',
        'is_in_stock' => 'boolean',
        'is_shipped' => 'boolean',
        'is_trend' => 'boolean',
        'status' => 'boolean',
    ];

    // Main unit relationship
    public function unit()
    {
        return $this->belongsTo(Unit::class);
    }

    // Warehouse relationships
    public function warehouses()
    {
        return $this->belongsToMany(Warehouse::class, 'warehouse_products')
            ->withPivot('quantity', 'reserved_quantity')
            ->withTimestamps();
    }

    // Supplier relationships
    public function suppliers()
    {
        return $this->belongsToMany(Supplier::class, 'product_suppliers')
            ->withPivot('supplier_code', 'cost_price', 'is_primary')
            ->withTimestamps();
    }

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

    public function warehouseProducts()
    {
        return $this->hasMany(WarehouseProduct::class, 'product_id');
    }

    public function customerStockIncomes()
    {
        return $this->hasMany(CustomerStockIncome::class);
    }

    public function customerStockOutcomes()
    {
        return $this->hasMany(CustomerStockOutcome::class);
    }

    // Accessors for API compatibility
    public function getCostAttribute()
    {
        return $this->purchase_price ?? 0;
    }

    public function getPriceAttribute()
    {
        return $this->retail_price ?? 0;
    }

    public function getCodeAttribute()
    {
        return $this->barcode ?? 'PRD-' . $this->id;
    }
}