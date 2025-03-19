<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\MarketOrder;
use App\Models\MarketOrderItem;
use App\Models\Product;
use Illuminate\Support\Str;

class MarketOrderCreate extends Component
{
    public $showScannerModal = false;
    public $scannedBarcode = '';
    public $scanSuccess = false;
    public $orderItems = [];
    public $subtotal = 0;
    public $taxRate = 0.1; // 10% tax rate
    public $taxAmount = 0;
    public $discountAmount = 0;
    public $total = 0;
    public $amountPaid = 0;
    public $changeDue = 0;
    public $paymentMethod = 'cash';
    public $notes = '';
    public $currentOrderId = null;
    public $orderCreated = false;

    protected $listeners = ['closeModalAfterSuccess' => 'closeScanner'];

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
        $this->taxAmount = round($this->subtotal * $this->taxRate, 2);
        $this->total = $this->subtotal + $this->taxAmount - $this->discountAmount;
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
        $this->discountAmount = min($amount, $this->subtotal);
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
                'tax_amount' => $this->taxAmount,
                'discount_amount' => $this->discountAmount,
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
                    'price' => $item['price'],
                    'total' => $item['total']
                ]);
            }

            $this->reset(['orderItems', 'subtotal', 'taxAmount', 'discountAmount', 'total',
                         'amountPaid', 'changeDue', 'paymentMethod', 'notes', 'currentOrderId', 'orderCreated']);
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