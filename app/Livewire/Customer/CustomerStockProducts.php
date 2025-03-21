<?php

namespace App\Livewire\Customer;

use App\Models\CustomerStockProduct;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\DB;

class CustomerStockProducts extends Component
{
    use WithPagination;

    public $search = '';
    public $perPage = 10;

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function render()
    {
        $stockProducts = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->select([
                'customer_stock_product_movements.product_id',
                'customer_stock_product_movements.customer_id',
                'customer_stock_product_movements.income_quantity',
                'customer_stock_product_movements.income_price',
                'customer_stock_product_movements.income_total',
                'customer_stock_product_movements.outcome_quantity',
                'customer_stock_product_movements.outcome_price',
                'customer_stock_product_movements.outcome_total',
                'customer_stock_product_movements.net_quantity',
                'customer_stock_product_movements.net_total',
                'customer_stock_product_movements.profit',
                'products.name as product_name',
                'products.barcode'
            ])
            ->when($this->search, function ($query) {
                $query->where(function($q) {
                    $q->where('products.name', 'like', '%' . $this->search . '%')
                      ->orWhere('products.barcode', 'like', '%' . $this->search . '%');
                });
            })
            ->where('customer_stock_product_movements.customer_id', auth()->guard('customer')->id())
            ->paginate($this->perPage);

        return view('livewire.customer.customer-stock-products', [
            'stockProducts' => $stockProducts
        ]);
    }
}
