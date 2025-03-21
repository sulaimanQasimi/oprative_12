<?php

namespace App\Livewire\Customer;

use App\Models\CustomerStockProduct;
use Livewire\Component;
use Livewire\WithPagination;

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
        $stockProducts = CustomerStockProduct::query()
            ->when($this->search, function ($query) {
                $query->whereHas('product', function ($q) {
                    $q->where('name', 'like', '%' . $this->search . '%');
                });
            })
            ->with(['product', 'customer'])
            ->latest()
            ->paginate($this->perPage);

        return view('livewire.customer.customer-stock-products', [
            'stockProducts' => $stockProducts
        ]);
    }
}
