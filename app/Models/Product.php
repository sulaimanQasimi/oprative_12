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
        'barcode',
        'category_id',
        'unit_id',
        'status',
    ];

    protected $casts = [
        'status' => 'boolean',
    ];

    // Category relationship
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

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

    public function getCodeAttribute()
    {
        return $this->barcode ?? 'PRD-' . $this->id;
    }
}