<?php

namespace App\Livewire\Customer;

use App\Models\Customer;
use App\Models\CustomerStockProduct;
use Illuminate\Support\Facades\DB;
use Livewire\Component;

class Dashboard extends Component
{
    public $customer;
    public $customerStockProducts = [];
    public $cartItems = [];
    public $tables = [];
    public $showScannerModal = false;
    public $scannedBarcode = '';
    public $scanSuccess = false;
    public $searchQuery = '';
    public $searchResults = [];
    public $showDropdown = false;
    public $highlightIndex = 0;

    protected $listeners = [
        'closeModalAfterSuccess' => 'closeScanner',
        'refreshDashboard' => 'loadCustomerStockProducts'
    ];

    public function mount()
    {
        $this->customer = auth()->guard('customer')->user();
        $this->loadCustomerStockProducts();
    }

    public function loadCustomerStockProducts()
    {

        // Load customer stock movement statistics from the database with product details
        $this->customerStockProducts = CustomerStockProduct::with('product')
            ->where('customer_id', $this->customer->id)
            ->get()
            ->map(function ($item) {
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

    public function updatedSelectedCustomer()
    {
        $this->loadCustomerStockProducts();
        $this->cartItems = [];
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
                'current_stock' => $stockProduct->net_quantity,
                'price' => $stockProduct->product->retail_price
            ];
            $this->scanSuccess = true;
            $this->dispatch('closeModalAfterSuccess');
        }
    }

    public function updatedSearchQuery()
    {
        if (strlen($this->searchQuery) > 0 && $this->selectedCustomer) {
            $this->searchResults = CustomerStockProduct::with('product')
                ->where('customer_id', $this->selectedCustomer)
                ->whereHas('product', function ($query) {
                    $query->where('name', 'like', '%' . $this->searchQuery . '%')
                        ->orWhere('barcode', 'like', '%' . $this->searchQuery . '%');
                })
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->product->name,
                        'sku' => $item->product->sku,
                        'price' => $item->product->retail_price,
                        'stock' => $item->net_quantity,
                        'image' => $item->product->image
                    ];
                })
                ->toArray();
            $this->showDropdown = true;
            $this->highlightIndex = 0;
        } else {
            $this->searchResults = [];
            $this->showDropdown = false;
        }
    }

    public function incrementHighlight()
    {
        if ($this->highlightIndex === count($this->searchResults) - 1) {
            $this->highlightIndex = 0;
            return;
        }
        $this->highlightIndex++;
    }

    public function decrementHighlight()
    {
        if ($this->highlightIndex === 0) {
            $this->highlightIndex = count($this->searchResults) - 1;
            return;
        }
        $this->highlightIndex--;
    }

    public function selectProduct($index = null)
    {
        $index = $index ?? $this->highlightIndex;
        if (!isset($this->searchResults[$index])) return;

        $selectedProduct = $this->searchResults[$index];
        $this->cartItems[] = [
            'name' => $selectedProduct['name'],
            'quantity' => 1,
            'price' => $selectedProduct['price'],
            'current_stock' => $selectedProduct['stock']
        ];

        $this->searchQuery = '';
        $this->showDropdown = false;
    }

    public function closeDropdown()
    {
        $this->showDropdown = false;
    }

    public function render()
    {
        return view('livewire.customer.dashboard');
    }
}
