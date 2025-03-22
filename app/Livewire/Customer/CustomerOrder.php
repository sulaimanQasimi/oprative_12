<?php

namespace App\Livewire\Customer;

use App\Models\MarketOrder;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class CustomerOrder extends Component
{
    use WithPagination;

    public $orders;
    public $selectedOrder;
    public $showOrderDetails = false;
    public $searchQuery = '';
    public $statusFilter = 'all';
    public $dateRange = 'all';
    public $sortField = 'created_at';
    public $sortDirection = 'desc';

    protected $queryString = [
        'statusFilter' => ['except' => 'all'],
        'dateRange' => ['except' => 'all'],
        'searchQuery' => ['except' => ''],
        'sortField' => ['except' => 'created_at'],
        'sortDirection' => ['except' => 'desc'],
    ];

    protected $listeners = [
        'refreshOrders' => '$refresh',
        'orderStatusUpdated' => 'loadOrders'
    ];

    public function mount()
    {
        $this->loadOrders();
    }

    public function loadOrders()
    {
        $query = MarketOrder::where('customer_id', auth()->guard('customer')->id())
            ->with(['items.product']);

        // Apply search filter for order number
        if ($this->searchQuery) {
            $query->where(function($q) {
                $q->where('id', 'like', '%' . $this->searchQuery . '%')
                  ->orWhere('total_amount', 'like', '%' . $this->searchQuery . '%');
            });
        }

        // Apply status filter
        if ($this->statusFilter !== 'all') {
            $query->where('order_status', $this->statusFilter);
        }

        // Apply date range filter with more precise date handling
        switch ($this->dateRange) {
            case 'today':
                $query->whereDate('created_at', Carbon::today());
                break;
            case 'week':
                $query->whereBetween('created_at', [
                    Carbon::now()->startOfWeek(),
                    Carbon::now()->endOfWeek()
                ]);
                break;
            case 'month':
                $query->whereBetween('created_at', [
                    Carbon::now()->startOfMonth(),
                    Carbon::now()->endOfMonth()
                ]);
                break;
            case 'year':
                $query->whereBetween('created_at', [
                    Carbon::now()->startOfYear(),
                    Carbon::now()->endOfYear()
                ]);
                break;
        }

        // Apply dynamic sorting with proper handling
        if ($this->sortField === 'total_amount') {
            $query->orderByRaw('CAST(total_amount AS DECIMAL(10,2)) ' . $this->sortDirection);
        } else {
            $query->orderBy($this->sortField, $this->sortDirection);
        }

        $this->orders = $query->get();
    }

    public function getOrderStats()
    {
        return [
            'total_orders' => $this->orders->count(),
            'total_amount' => $this->orders->sum('total_amount'),
            'pending_orders' => $this->orders->where('order_status', 'pending')->count(),
            'completed_orders' => $this->orders->where('order_status', 'completed')->count(),
        ];
    }

    public function viewOrderDetails($orderId)
    {
        $this->selectedOrder = $this->orders->find($orderId);
        $this->showOrderDetails = true;
    }

    public function closeOrderDetails()
    {
        $this->showOrderDetails = false;
        $this->selectedOrder = null;
    }

    public function updatedSearchQuery()
    {
        $this->loadOrders();
    }

    public function updatedStatusFilter()
    {
        $this->loadOrders();
    }

    public function updatedDateRange()
    {
        $this->loadOrders();
    }

    public function updatedSortField()
    {
        $this->loadOrders();
    }

    public function updatedSortDirection()
    {
        $this->loadOrders();
    }

    public function toggleSort($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }

        $this->loadOrders();
    }

    public function getOrderStatusColor($status)
    {
        return match ($status) {
            'pending' => ['bg' => 'from-amber-500/10 to-orange-500/10', 'text' => 'text-amber-700'],
            'processing' => ['bg' => 'from-blue-500/10 to-indigo-500/10', 'text' => 'text-blue-700'],
            'completed' => ['bg' => 'from-emerald-500/10 to-green-500/10', 'text' => 'text-emerald-700'],
            default => ['bg' => 'bg-gray-100', 'text' => 'text-gray-700'],
        };
    }

    // New methods for order details
    public function getOrderStatus($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? (string)($order->status ?? '') : '';
    }

    public function getOrderItems($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? $order->items->map(function($item) {
            return [
                'id' => $item->id,
                'quantity' => $item->quantity,
                'price' => $item->unit_price,
                'product' => [
                    'name' => $item->product->name,
                    'stock' => $item->product->stock
                ]
            ];
        }) : [];
    }

    public function getOrderSubtotal($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? number_format($order->total_amount - ($order->tax ?? 0), 2) : '0.00';
    }

    public function getOrderTax($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? number_format($order->tax ?? 0, 2) : '0.00';
    }

    public function getOrderTotal($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? number_format($order->total_amount, 2) : '0.00';
    }

    public function isOrderPaid($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? $order->is_paid : false;
    }

    public function getOrderNumber($orderId)
    {
        $order = $this->orders->find($orderId);
        return $order ? ($order->order_number ?? '#' . str_pad($order->id, 6, '0', STR_PAD_LEFT)) : '';
    }

    public function render()
    {
        return view('livewire.customer.customer-order', [
            'stats' => $this->getOrderStats(),
        ]);
    }
}
