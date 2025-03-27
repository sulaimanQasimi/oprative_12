<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Sale;
use App\Models\SaleItem;
use App\Repositories\Customer\CustomerRepository;
use Livewire\WithPagination;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Validation\Rule;
use Illuminate\Support\Facades\DB;

class SalesList extends Component
{
    use WithPagination;
    public $customer;
    public $search = '';
    public $dateFrom = '';
    public $dateTo = '';
    public $status = '';
    public $confirmedByWarehouse = '';
    public $confirmedByShop = '';
    public $movedFromWarehouse = '';
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
        'confirmedByWarehouse' => ['except' => ''],
        'confirmedByShop' => ['except' => ''],
        'movedFromWarehouse' => ['except' => ''],
        'sortField' => ['except' => 'date'],
        'sortDirection' => ['except' => 'desc'],
    ];

    protected function rules()
    {
        return [
            'search' => 'nullable|string|max:255',
            'dateFrom' => 'nullable|date',
            'dateTo' => 'nullable|date|after_or_equal:dateFrom',
            'status' => ['nullable', Rule::in(['completed', 'pending', 'cancelled', ''])],
            'confirmedByWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'confirmedByShop' => ['nullable', Rule::in(['0', '1', ''])],
            'movedFromWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'sortField' => ['required', Rule::in(['reference', 'date', 'total_amount', 'status'])],
            'sortDirection' => ['required', Rule::in(['asc', 'desc'])],
            'paymentAmount' => 'required|numeric|min:0',
            'paymentDate' => 'required|date',
            'paymentNotes' => 'nullable|string|max:255',
        ];
    }

    public function mount()
    {
        $this->customer = CustomerRepository::currentUserCustomer()->model;
        $this->paymentDate = now()->format('Y-m-d');
    }

    public function updatingSearch()
    {
        $this->validateOnly('search');
        $this->resetPage();
    }

    public function sortBy($field)
    {
        // Validate sort field
        $this->validate([
            'sortField' => Rule::in(['reference', 'date', 'total_amount', 'status'])
        ]);

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
        // Verify sale belongs to authenticated customer
        $sale = Sale::where('customer_id', $this->customer->id)
            ->findOrFail($saleId);

        $this->selectedSale = $sale->load(['saleItems.product', 'customer', 'currency']);
        $this->showDetailsModal = true;
    }

    public function showPaymentForm($saleId)
    {
        // Verify sale belongs to authenticated customer and has due amount
        $sale = Sale::where('customer_id', $this->customer->id)
            ->where('due_amount', '>', 0)
            ->findOrFail($saleId);

        $this->selectedSale = $sale;
        $this->showPaymentModal = true;
        $this->paymentAmount = $sale->due_amount;
    }

    public function addPayment()
    {
        // Verify sale belongs to authenticated customer
        if (!$this->selectedSale || $this->selectedSale->customer_id !== $this->customer->id) {
            abort(403, 'Unauthorized access.');
        }

        $rules = $this->rules();
        $rules['paymentAmount'] = 'required|numeric|min:0|max:' . $this->selectedSale->due_amount;

        $this->validate($rules);

        try {
            DB::beginTransaction();

            $this->selectedSale->payments()->create([
                'amount' => $this->paymentAmount,
                'date' => $this->paymentDate,
                'notes' => $this->paymentNotes,
            ]);

            DB::commit();

            $this->selectedSale->refresh();
            $this->showPaymentModal = false;
            $this->reset(['paymentAmount', 'paymentNotes', 'paymentDate']);

            $this->dispatch('notify', [
                'message' => __('Payment added successfully.'),
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->dispatch('notify', [
                'message' => __('Error adding payment. Please try again.'),
                'type' => 'error'
            ]);
        }
    }

    public function confirmSale($saleId)
    {
        // Verify sale belongs to authenticated customer
        $sale = Sale::where('customer_id', $this->customer->id)
            ->findOrFail($saleId);

        // Check if warehouse has already confirmed
        if (!$sale->confirmed_by_warehouse) {
            $this->dispatch('notify', [
                'message' => __('Cannot confirm sale. Warehouse confirmation is required first.'),
                'type' => 'error'
            ]);
            return;
        }

        try {
            DB::beginTransaction();

            $sale->update([
                'confirmed_by_shop' => true,
                'confirmed_at' => now(),
            ]);

            DB::commit();

            $this->dispatch('notify', [
                'message' => __('Sale confirmed successfully.'),
                'type' => 'success'
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            $this->dispatch('notify', [
                'message' => __('Error confirming sale. Please try again.'),
                'type' => 'error'
            ]);
        }
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
        // Validate all filter inputs
        $this->validate([
            'search' => 'nullable|string|max:255',
            'dateFrom' => 'nullable|date',
            'dateTo' => 'nullable|date|after_or_equal:dateFrom',
            'status' => ['nullable', Rule::in(['completed', 'pending', 'cancelled', ''])],
            'confirmedByWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'confirmedByShop' => ['nullable', Rule::in(['0', '1', ''])],
            'movedFromWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'sortField' => ['required', Rule::in(['reference', 'date', 'total_amount', 'status'])],
            'sortDirection' => ['required', Rule::in(['asc', 'desc'])],
        ]);

        $sales = Sale::query()
            ->where('customer_id', $this->customer->id)
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
            ->when($this->confirmedByWarehouse !== '', function ($query) {
                $query->where('confirmed_by_warehouse', $this->confirmedByWarehouse === '1');
            })
            ->when($this->confirmedByShop !== '', function ($query) {
                $query->where('confirmed_by_shop', $this->confirmedByShop === '1');
            })
            ->when($this->movedFromWarehouse !== '', function ($query) {
                $query->where('moved_from_warehouse', $this->movedFromWarehouse === '1');
            })
            ->orderBy($this->sortField, $this->sortDirection)
            ->paginate(10);

        return view('livewire.customer.sales-list', [
            'sales' => $sales
        ]);
    }
}
