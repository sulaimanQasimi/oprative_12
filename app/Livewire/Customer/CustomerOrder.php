<?php

namespace App\Livewire\Customer;

use App\Models\MarketOrder;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Support\Facades\DB;

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

        // Apply search filter
        if ($this->searchQuery) {
            $query->where(function($q) {
                $q->where('id', 'like', '%' . $this->searchQuery . '%')
                  ->orWhere('total_amount', 'like', '%' . $this->searchQuery . '%');
            });
        }

        // Apply status filter
        if ($this->statusFilter !== 'all') {
            $query->where('status', $this->statusFilter);
        }

        // Apply date range filter
        switch ($this->dateRange) {
            case 'today':
                $query->whereDate('created_at', today());
                break;
            case 'week':
                $query->whereBetween('created_at', [now()->startOfWeek(), now()->endOfWeek()]);
                break;
            case 'month':
                $query->whereMonth('created_at', now()->month);
                break;
            case 'year':
                $query->whereYear('created_at', now()->year);
                break;
        }

        // Apply sorting
        $query->orderBy($this->sortField, $this->sortDirection);

        $this->orders = $query->get();
    }

    public function getOrderStats()
    {
        return [
            'total_orders' => $this->orders->count(),
            'total_amount' => $this->orders->sum('total_amount'),
            'pending_orders' => $this->orders->where('status', 'pending')->count(),
            'completed_orders' => $this->orders->where('status', 'completed')->count(),
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

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }

        $this->loadOrders();
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

    public function getOrderStatusColor($status)
    {
        return match ($status) {
            'pending' => ['bg' => 'from-amber-500/10 to-orange-500/10', 'text' => 'text-amber-700'],
            'processing' => ['bg' => 'from-blue-500/10 to-indigo-500/10', 'text' => 'text-blue-700'],
            'completed' => ['bg' => 'from-emerald-500/10 to-green-500/10', 'text' => 'text-emerald-700'],
            default => ['bg' => 'bg-gray-100', 'text' => 'text-gray-700'],
        };
    }

    public function render()
    {
        return view('livewire.customer.customer-order', [
            'stats' => $this->getOrderStats(),
        ]);
    }
}
