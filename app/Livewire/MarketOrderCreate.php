<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\MarketOrder;
use App\Models\MarketOrderItem;
use App\Models\Product;
use App\Models\CustomerStockOutcome;
use Illuminate\Support\Str;

class MarketOrderCreate extends Component
{
    public $showScannerModal = false;
    public $scannedBarcode = '';
    public $scanSuccess = false;
    public $orderItems = [];
    public $subtotal = 0;
    public $total = 0;
    public $amountPaid = 0;
    public $changeDue = 0;
    public $paymentMethod = 'cash';
    public $notes = '';
    public $currentOrderId = null;
    public $orderCreated = false;

    public $searchQuery = '';
    public $searchResults = [];
    public $showDropdown = false;
    public $highlightIndex = 0;

    protected $listeners = ['closeModalAfterSuccess' => 'closeScanner'];

    public function updatedSearchQuery()
    {
        if (strlen($this->searchQuery) > 0) {
            $this->searchResults = Product::where('name', 'like', '%' . $this->searchQuery . '%')
                ->orWhere('barcode', 'like', '%' . $this->searchQuery . '%')
                ->get()
                ->map(function ($item) {
                    return [
                        'name' => $item->name,
                        'sku' => $item->sku,
                        'price' => $item->retail_price,
                        'stock' => $item->quantity,
                        'image' => $item->image
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
        $product = Product::where('name', $selectedProduct['name'])->first();
        if (!$product) return;

        $existingItem = collect($this->orderItems)->firstWhere('product_id', $product->id);

        if ($existingItem) {
            $this->orderItems = collect($this->orderItems)->map(function ($item) use ($selectedProduct) {
                if ($item['name'] === $selectedProduct['name']) {
                    $item['quantity'] += 1;
                    $item['total'] = $item['quantity'] * $item['price'];
                }
                return $item;
            })->toArray();
        } else {
            $this->orderItems[] = [
                'product_id' => $product->id,
                'name' => $selectedProduct['name'],
                'price' => $selectedProduct['price'],
                'quantity' => 1,
                'total' => $selectedProduct['price']
            ];
        }

        $this->calculateTotal();
        $this->searchQuery = '';
        $this->showDropdown = false;
    }

    public function saveToOrder()
    {
        if (empty($this->scannedBarcode)) {
            return;
        }

        $product = Product::where('barcode', $this->scannedBarcode)->first();

        if ($product) {
            $existingItem = collect($this->orderItems)->firstWhere('product_id', $product->id);

            if ($existingItem) {
                $this->orderItems = collect($this->orderItems)->map(function ($item) use ($product) {
                    if ($item['product_id'] === $product->id) {
                        $item['quantity'] += 1;
                        $item['total'] = $item['quantity'] * $item['price'];
                    }
                    return $item;
                })->toArray();
            } else {
                $this->orderItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->retail_price,
                    'quantity' => 1,
                    'total' => $product->retail_price
                ];
            }

            $this->calculateTotal();
            $this->scanSuccess = true;
            $this->dispatch('closeModalAfterSuccess');
        }
    }

    public function closeDropdown()
    {
        $this->showDropdown = false;
    }

    public function openScanner()
    {
        $this->showScannerModal = true;
        $this->scannedBarcode = '';
        $this->scanSuccess = false;
    }

    public function closeScanner()
    {
        $this->showScannerModal = false;
        $this->scannedBarcode = '';
        $this->scanSuccess = false;
    }

    public function processBarcode()
    {
        if (empty($this->scannedBarcode)) {
            return;
        }

        $product = Product::where('barcode', $this->scannedBarcode)->first();

        if ($product) {
            $existingItem = collect($this->orderItems)->firstWhere('product_id', $product->id);

            if ($existingItem) {
                $this->orderItems = collect($this->orderItems)->map(function ($item) use ($product) {
                    if ($item['product_id'] === $product->id) {
                        $item['quantity'] += 1;
                        $item['total'] = $item['quantity'] * $item['price'];
                    }
                    return $item;
                })->toArray();
            } else {
                $this->orderItems[] = [
                    'product_id' => $product->id,
                    'name' => $product->name,
                    'price' => $product->retail_price,
                    'quantity' => 1,
                    'total' => $product->retail_price
                ];
            }

            $this->calculateTotal();
            $this->scanSuccess = true;
            $this->dispatch('closeModalAfterSuccess');
        }
    }

    public function updateQuantity($index, $change)
    {
        if (isset($this->orderItems[$index])) {
            $newQuantity = $this->orderItems[$index]['quantity'] + $change;

            if ($newQuantity > 0) {
                $this->orderItems[$index]['quantity'] = $newQuantity;
                $this->orderItems[$index]['total'] = $newQuantity * $this->orderItems[$index]['price'];
            } else {
                unset($this->orderItems[$index]);
                $this->orderItems = array_values($this->orderItems);
            }

            $this->calculateTotal();
        }
    }

    public function removeItem($index)
    {
        if (isset($this->orderItems[$index])) {
            unset($this->orderItems[$index]);
            $this->orderItems = array_values($this->orderItems);
            $this->calculateTotal();
        }
    }

    public function calculateTotal()
    {
        $this->subtotal = collect($this->orderItems)->sum('total');
        $this->total = $this->subtotal;
        $this->amountPaid = $this->total;
        $this->calculateChange();
    }

    public function calculateChange()
    {
        $this->changeDue = max(0, $this->amountPaid - $this->total);
    }

    public function updatedAmountPaid()
    {
        $this->calculateChange();
    }

    public function applyDiscount($amount)
    {
        $this->calculateTotal();
    }

    public function createOrder()
    {
        if ($this->currentOrderId) {
            if (empty($this->orderItems) || $this->amountPaid < $this->total) {
                return;
            }

            $order = MarketOrder::find($this->currentOrderId);
            if (!$order) {
                return;
            }

            $order->update([
                'subtotal' => $this->subtotal,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => $this->total,
                'payment_method' => $this->paymentMethod,
                'payment_status' => $this->amountPaid >= $this->total ? 'paid' : 'partial',
                'order_status' => 'completed',
                'notes' => $this->notes
            ]);

            foreach ($this->orderItems as $item) {
                MarketOrderItem::create([
                    'market_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['price'],
                    'subtotal' => $item['total'],
                    'discount_amount' => 0
                ]);

                CustomerStockOutcome::create([
                    'reference_number' => $order->order_number,
                    'customer_id' => $order->customer_id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'price' => $item['price'],
                    'total' => $item['total'],
                    'model_type' => MarketOrder::class,
                    'model_id' => $order->id
                ]);
            }

            $this->reset([
                'orderItems',
                'subtotal',
                'total',
                'amountPaid',
                'changeDue',
                'paymentMethod',
                'notes',
                'currentOrderId',
                'orderCreated'
            ]);
            $this->dispatch('orderCreated');
        } else {
            $order = MarketOrder::create([
                'order_number' => 'POS-' . Str::random(8),
                'customer_id' => 1, // Default customer for now
                'subtotal' => 0,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'notes' => ''
            ]);

            $this->currentOrderId = $order->id;
            $this->orderCreated = true;
        }
    }

    public function render()
    {
        return view('livewire.market-order-create');
    }
}
