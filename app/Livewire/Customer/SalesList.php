<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Sale;
use App\Models\SaleItem;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Auth;

class SalesList extends Component
{
    use WithPagination;

    public $search = '';
    public $dateFrom = '';
    public $dateTo = '';
    public $status = '';
    public $sortField = 'date';
    public $sortDirection = 'desc';
    public $selectedSale = null;
    public $showDetailsModal = false;
    public $showPaymentModal = false;
    public $paymentAmount = 0;
    public $paymentNotes = '';
    public $paymentDate;

    protected $queryString = [
        'search' => ['except' => ''],
        'dateFrom' => ['except' => ''],
        'dateTo' => ['except' => ''],
        'status' => ['except' => ''],
        'sortField' => ['except' => 'date'],
        'sortDirection' => ['except' => 'desc'],
    ];

    public function mount()
    {
        $this->paymentDate = now()->format('Y-m-d');
    }

    public function updatingSearch()
    {
        $this->resetPage();
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }
    }

    public function getSortIcon($field)
    {
        if ($this->sortField !== $field) {
            return 'sort';
        }
        return $this->sortDirection === 'asc' ? 'sort-up' : 'sort-down';
    }

    public function showSaleDetails($saleId)
    {
        $this->selectedSale = Sale::with(['saleItems.product', 'customer', 'currency'])
            ->findOrFail($saleId);
        $this->showDetailsModal = true;
    }

    public function showPaymentForm($saleId)
    {
        $this->selectedSale = Sale::findOrFail($saleId);
        $this->showPaymentModal = true;
        $this->paymentAmount = $this->selectedSale->due_amount;
    }

    public function addPayment()
    {
        $this->validate([
            'paymentAmount' => 'required|numeric|min:0',
            'paymentDate' => 'required|date',
            'paymentNotes' => 'nullable|string|max:255',
        ]);

        $this->selectedSale->payments()->create([
            'amount' => $this->paymentAmount,
            'date' => $this->paymentDate,
            'notes' => $this->paymentNotes,
        ]);

        $this->selectedSale->refresh();
        $this->showPaymentModal = false;
        $this->reset(['paymentAmount', 'paymentNotes', 'paymentDate']);
        session()->flash('success', 'Payment added successfully.');
    }

    public function getStatusBadgeClass($status)
    {
        return match ($status) {
            'completed' => 'bg-green-100 text-green-800',
            'pending' => 'bg-yellow-100 text-yellow-800',
            'cancelled' => 'bg-red-100 text-red-800',
            default => 'bg-gray-100 text-gray-800',
        };
    }

    public function render()
    {
        $sales = Sale::query()
            ->where('customer_id', Auth::guard('customer')->id())
            ->when($this->search, function ($query) {
                $query->where(function ($q) {
                    $q->where('reference', 'like', '%' . $this->search . '%')
                      ->orWhereHas('customer', function ($q) {
                          $q->where('name', 'like', '%' . $this->search . '%');
                      });
                });
            })
            ->when($this->dateFrom, function ($query) {
                $query->whereDate('date', '>=', $this->dateFrom);
            })
            ->when($this->dateTo, function ($query) {
                $query->whereDate('date', '<=', $this->dateTo);
            })
            ->when($this->status, function ($query) {
                $query->where('status', $this->status);
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate(10);

        return view('livewire.customer.sales-list', [
            'sales' => $sales
        ]);
    }
} 