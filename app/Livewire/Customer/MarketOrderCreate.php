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
use App\Models\Account;
use App\Models\AccountOutcome;

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
    public $accountSearchQuery = '';
    public $accountSearchResults = [];
    public $showAccountDropdown = false;
    public $selectedAccount = null;
    public $accountHighlightIndex = 0;

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
        $this->selectedAccount = null;
        $this->accountSearchQuery = '';
        $this->accountSearchResults = [];
        $this->showAccountDropdown = false;
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

    public function updatedAccountSearchQuery()
    {
        if (strlen($this->accountSearchQuery) < 2) {
            $this->accountSearchResults = [];
            $this->showAccountDropdown = false;
            return;
        }

        $this->accountSearchResults = Account::where('customer_id', $this->customerId)
            ->where(function($query) {
                $query->where('name', 'like', '%' . $this->accountSearchQuery . '%')
                    ->orWhere('account_number', 'like', '%' . $this->accountSearchQuery . '%')
                    ->orWhere('id_number', 'like', '%' . $this->accountSearchQuery . '%');
            })
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'account_number' => $account->account_number,
                    'id_number' => $account->id_number,
                    'balance' => $account->total_income - $account->total_outcome
                ];
            })
            ->toArray();

        $this->showAccountDropdown = true;
        $this->accountHighlightIndex = 0;
    }

    public function selectAccount($index)
    {
        if (!isset($this->accountSearchResults[$index])) return;

        $this->selectedAccount = $this->accountSearchResults[$index];
        $this->accountSearchQuery = $this->selectedAccount['name'];
        $this->showAccountDropdown = false;
    }

    public function incrementAccountHighlight()
    {
        if ($this->accountHighlightIndex === count($this->accountSearchResults) - 1) {
            $this->accountHighlightIndex = 0;
            return;
        }
        $this->accountHighlightIndex++;
    }

    public function decrementAccountHighlight()
    {
        if ($this->accountHighlightIndex === 0) {
            $this->accountHighlightIndex = count($this->accountSearchResults) - 1;
            return;
        }
        $this->accountHighlightIndex--;
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

        $order = MarketOrder::findOrFail($this->currentOrderId);

        if ($this->amountPaid < $this->total) {
            if (!$this->selectedAccount) {
                session()->flash('error', 'Please select an account for the remaining balance.');
                return;
            }

            // Create account outcome for the remaining balance
            AccountOutcome::create([
                'account_id' => $this->selectedAccount['id'],
                'reference_number' => $order->order_number,
                'amount' => $this->total - $this->amountPaid,
                'date' => now(),
                'status' => 'pending',
                'user_id' => auth()->guard('customer')->id(),
                'description' => 'Remaining balance for order ' . $order->order_number,
                'model_type' => MarketOrder::class,
                'model_id' => $order->id
            ]);
        }

        // Update order details
        $order->update([
            'customer_id' => $this->customerId,
            'subtotal' => $this->subtotal,
            'tax_amount' => 0,
            'discount_amount' => 0,
            'total_amount' => $this->amountPaid,
            'payment_method' => $this->paymentMethod,
            'payment_status' => $this->amountPaid >= $this->total ? 'paid' : 'partial',
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
