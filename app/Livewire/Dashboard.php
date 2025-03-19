<?php

namespace App\Livewire;

use App\Models\CustomerStockProduct;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class Dashboard extends Component
{
    public $customerStockProducts = [];
    public $cartItems = [];
    public $tables = [];
    public $showScannerModal = false;
    public $scannedBarcode = '';
    public $scanSuccess = false;
    public $selectedCustomer = null;

    public function mount()
    {
        $this->loadCustomerStockProducts();
    }

    private function loadCustomerStockProducts()
    {
        // Load customer stock movement statistics from the database with product details
        $this->customerStockProducts = CustomerStockProduct::with('product')->get()->map(function ($item) {
            return [
                'customer_name' => $item->customer->name ?? 'Unknown',
                'product_name' => $item->product->name ?? 'Unknown',
                'barcode' => $item->product->barcode ?? 'N/A',
                'wholesale_price' => $item->product->wholesale_price ?? 0,
                'retail_price' => $item->product->retail_price ?? 0,
                'status' => $this->getStockStatus($item->net_quantity),
                'income_quantity' => $item->income_quantity ?? 0,
                'income_total' => $item->income_total ?? 0,
                'outcome_quantity' => $item->outcome_quantity ?? 0,
                'outcome_total' => $item->outcome_total ?? 0,
                'net_quantity' => $item->net_quantity ?? 0,
                'profit' => $item->profit ?? 0
            ];
        })->toArray();
    }

    private function getStockStatus($quantity)
    {
        return match (true) {
            $quantity === 0 => trans('Out of Stock'),
            $quantity < 10 => trans('Low Stock'),
            default => trans('In Stock'),
        };
    }
    private function getGroupStatus($items)
    {
        $hasOutOfStock = collect($items)->contains(function ($item) {
            return $item['status'] === trans('Out of Stock');
        });

        $hasLowStock = collect($items)->contains(function ($item) {
            return $item['status'] === trans('Low Stock');
        });

        return match (true) {
            $hasOutOfStock => trans('Out of Stock'),
            $hasLowStock => trans('Low Stock'),
            default => trans('In Stock'),
        };
    }

    public function getStatusClass($status)
    {
        return match (true) {
            $status === trans('Out of Stock') => 'bg-red-100 text-red-700',
            $status === trans('Low Stock') => 'bg-yellow-100 text-yellow-700',
            $status === trans('In Stock') => 'bg-green-100 text-green-700',
            default => 'bg-gray-100 text-gray-700'
        };
    }

    public function openScanner()
    {
        $this->showScannerModal = true;
    }

    public function closeScanner()
    {
        $this->showScannerModal = false;
        $this->scannedBarcode = '';
        $this->scanSuccess = false;
    }

    public function processBarcode()
    {
        if (!$this->scannedBarcode || !$this->selectedCustomer) {
            return;
        }

        $stockProduct = CustomerStockProduct::where('barcode', $this->scannedBarcode)
            ->where('customer_id', $this->selectedCustomer)
            ->with(['product'])
            ->first();

        if ($stockProduct) {
            $this->cartItems[] = [
                'id' => $stockProduct->id,
                'name' => $stockProduct->product->name,
                'quantity' => 1,
                'current_stock' => $stockProduct->quantity
            ];
            $this->scanSuccess = true;
            $this->dispatch('closeModalAfterSuccess');
        }
    }

    public function render()
    {
        return view('livewire.dashboard');
    }
}