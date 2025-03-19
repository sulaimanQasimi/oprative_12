<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\MarketOrder;
use App\Models\MarketOrderItem;
use App\Models\Product;

class MarketOrderCreate extends Component
{
    public $showScannerModal = false;
    public $scannedBarcode = '';
    public $scanSuccess = false;
    public $orderItems = [];
    public $total = 0;

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
        $this->total = collect($this->orderItems)->sum('total');
    }

    public function createOrder()
    {
        if (empty($this->orderItems)) {
            return;
        }

        $order = MarketOrder::create([
            'total_amount' => $this->total,
            'status' => 'pending'
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

        $this->orderItems = [];
        $this->total = 0;
        $this->dispatch('orderCreated');
    }

    public function render()
    {
        return view('livewire.market-order-create');
    }
}