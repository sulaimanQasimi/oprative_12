<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\MarketOrder;
use App\Models\MarketOrderItem;
use App\Models\Product;
use App\Models\CustomerStockOutcome;
use App\Models\CustomerStockProduct;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\DB;

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
    public $customerId = null; // TODO: Get from authenticated user

    public $searchQuery = '';
    public $searchResults = [];
    public $showDropdown = false;
    public $highlightIndex = 0;

    protected $listeners = ['closeModalAfterSuccess' => 'closeScanner'];

    public function mount()
    {
        // Initialize any necessary data
        $this->resetOrderState();
        $this->customerId = auth()->guard('customer')->id();
    }

    protected function resetOrderState()
    {
        $this->orderItems = [];
        $this->subtotal = 0;
        $this->total = 0;
        $this->amountPaid = 0;
        $this->changeDue = 0;
        $this->paymentMethod = 'cash';
        $this->notes = '';
        $this->currentOrderId = null;
        $this->orderCreated = false;
    }

    public function updatedSearchQuery()
    {
        if (strlen($this->searchQuery) < 2) {
            $this->searchResults = [];
            $this->showDropdown = false;
            return;
        }

        $this->searchResults = CustomerStockProduct::with(['product' => function($query) {
                $query->select('id', 'name', 'barcode', 'purchase_price', 'wholesale_price', 'retail_price',
                             'purchase_profit', 'wholesale_profit', 'retail_profit', 'is_activated',
                             'is_in_stock', 'is_shipped', 'is_trend', 'type');
            }])
            ->where('customer_id', $this->customerId)
            ->where('net_quantity', '>', 0)
            ->where(function($query) {
                $query->whereHas('product', function($q) {
                    $q->where('name', 'like', '%' . $this->searchQuery . '%')
                      ->orWhere('barcode', 'like', '%' . $this->searchQuery . '%');
                });
            })
            ->select('customer_id', 'product_id', 'net_quantity')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'purchase_price' => $item->product->purchase_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'retail_price' => $item->product->retail_price,
                    'purchase_profit' => $item->product->purchase_profit,
                    'wholesale_profit' => $item->product->wholesale_profit,
                    'retail_profit' => $item->product->retail_profit,
                    'is_activated' => $item->product->is_activated,
                    'is_in_stock' => $item->product->is_in_stock,
                    'is_shipped' => $item->product->is_shipped,
                    'is_trend' => $item->product->is_trend,
                    'type' => $item->product->type,
                    'stock' => $item->net_quantity,
                     ];
            })
            ->toArray();

        $this->showDropdown = true;
        $this->highlightIndex = 0;
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

        // Check stock availability
        $stockAvailable = CustomerStockProduct::where('customer_id', $this->customerId)
            ->where('product_id', $selectedProduct['id'])
            ->where('net_quantity', '>', 0)
            ->exists();

        if (!$stockAvailable) return;

        $existingItem = collect($this->orderItems)->firstWhere('product_id', $selectedProduct['id']);

        if ($existingItem) {
            if ($existingItem['quantity'] >= $selectedProduct['stock']) {
                return;
            }

            $this->orderItems = collect($this->orderItems)->map(function ($item) use ($selectedProduct) {
                if ($item['product_id'] === $selectedProduct['id']) {
                    $item['quantity'] += 1;
                    $item['total'] = $item['quantity'] * $item['price'];
                }
                return $item;
            })->toArray();
        } else {
            $this->orderItems[] = [
                'product_id' => $selectedProduct['id'],
                'name' => $selectedProduct['name'],
                'price' => $selectedProduct['retail_price'],
                'quantity' => 1,
                'total' => $selectedProduct['retail_price']
            ];
        }

        $this->calculateTotal();
        $this->searchQuery = '';
        $this->showDropdown = false;
    }

    public function saveToOrder()
    {
        if (empty($this->scannedBarcode)) return;

        $customerStockProduct = CustomerStockProduct::with(['product' => function($query) {
            $query->select('id', 'name', 'retail_price');
        }])
        ->where('customer_id', $this->customerId)
        ->whereHas('product', function($query) {
            $query->where('barcode', $this->scannedBarcode);
        })
        ->where('net_quantity', '>', 0)
        ->first();

        if (!$customerStockProduct) return;

        $this->addItemToOrder($customerStockProduct);
    }

    protected function addItemToOrder($customerStockProduct)
    {
        $existingItem = collect($this->orderItems)->firstWhere('product_id', $customerStockProduct->product_id);

        if ($existingItem) {
            if ($existingItem['quantity'] >= $customerStockProduct->net_quantity) {
                return;
            }

            $this->orderItems = collect($this->orderItems)->map(function ($item) use ($customerStockProduct) {
                if ($item['product_id'] === $customerStockProduct->product_id) {
                    $item['quantity'] += 1;
                    $item['total'] = $item['quantity'] * $item['price'];
                }
                return $item;
            })->toArray();
        } else {
            $this->orderItems[] = [
                'product_id' => $customerStockProduct->product_id,
                'name' => $customerStockProduct->product->name,
                'price' => $customerStockProduct->product->retail_price,
                'quantity' => 1,
                'total' => $customerStockProduct->product->retail_price
            ];
        }

        $this->calculateTotal();
        $this->scanSuccess = true;
        $this->dispatch('closeModalAfterSuccess');
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

        $customerStockProduct = CustomerStockProduct::with('product')
            ->where('customer_id', 1)
            ->whereHas('product', function($query) {
                $query->where('barcode', $this->scannedBarcode);
            })
            ->first();

        if ($customerStockProduct && $customerStockProduct->net_quantity > 0) {
            $existingItem = collect($this->orderItems)->firstWhere('product_id', $customerStockProduct->product_id);

            if ($existingItem) {
                if ($existingItem['quantity'] >= $customerStockProduct->net_quantity) {
                    return;
                }

                $this->orderItems = collect($this->orderItems)->map(function ($item) use ($customerStockProduct) {
                    if ($item['product_id'] === $customerStockProduct->product_id) {
                        $item['quantity'] += 1;
                        $item['total'] = $item['quantity'] * $item['price'];
                    }
                    return $item;
                })->toArray();
            } else {
                $this->orderItems[] = [
                    'product_id' => $customerStockProduct->product_id,
                    'name' => $customerStockProduct->product->name,
                    'price' => $customerStockProduct->product->retail_price,
                    'quantity' => 1,
                    'total' => $customerStockProduct->product->retail_price
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

            $customerStockProduct = CustomerStockProduct::where('customer_id', 1)
                ->where('product_id', $this->orderItems[$index]['product_id'])
                ->first();

            if (!$customerStockProduct || $newQuantity > $customerStockProduct->net_quantity) {
                return;
            }

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
            if (!$this->currentOrderId) {
                // Create new order
                $order = MarketOrder::create([
                    'order_number' => 'POS-' . Str::random(8),
                    'customer_id' => $this->customerId,
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
                DB::commit();
                return;
            }

            // Complete existing order
            if (empty($this->orderItems)) {
                session()->flash('error', 'Please add items to the order before completing.');
                return;
            }

            if ($this->amountPaid < $this->total) {
                session()->flash('error', 'Please enter the full payment amount before completing the order.');
                return;
            }

            $order = MarketOrder::findOrFail($this->currentOrderId);

            // Update order details
            $order->update([
                'customer_id' => $this->customerId,
                'subtotal' => $this->subtotal,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => $this->total,
                'payment_method' => $this->paymentMethod,
                'payment_status' => 'paid',
                'order_status' => 'completed',
                'notes' => $this->notes
            ]);

            // Process each order item
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

            DB::commit();
            session()->flash('success', 'Order completed successfully!');
            $this->resetOrderState();
            $this->dispatch('orderCreated');

    }

    public function getStatusClassWithoutBg($status)
    {
        return match ($status) {
            'Out of Stock' => 'text-red-700',
            'Low Stock' => 'text-yellow-700',
            'In Stock' => 'text-green-700',
            default => 'text-gray-700'
        };
    }

    public function render()
    {
        return view('livewire.customer.market-order-create');
    }
}
