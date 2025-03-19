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
        // Load customer stock movement statistics from the database
        $this->customerStockProducts = CustomerStockProduct::all();
    }

    private function getStockStatus($quantity)
    {
        return match (true) {
            $quantity <= 0 => 'out_of_stock',
            $quantity < 10 => 'low_stock',
            default => 'in_stock',
        };
    }

    private function getGroupStatus($items)
    {
        $hasOutOfStock = collect($items)->contains(function ($item) {
            return $item['status'] === 'out_of_stock';
        });

        $hasLowStock = collect($items)->contains(function ($item) {
            return $item['status'] === 'low_stock';
        });

        return match (true) {
            $hasOutOfStock => 'out_of_stock',
            $hasLowStock => 'low_stock',
            default => 'in_stock',
        };
    }

    public function getStatusClass($status)
    {
        return match ($status) {
            'in_stock' => 'bg-green-100 text-green-700',
            'out_of_stock' => 'bg-red-100 text-red-700',
            'low_stock' => 'bg-yellow-100 text-yellow-700',
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