<?php

namespace App\Livewire\Customer;

use App\Models\Account;
use App\Models\AccountIncome;
use Livewire\Component;
use Livewire\WithPagination;

class AccountIncomes extends Component
{
    use WithPagination;

    public $account;
    public $showCreateModal = false;
    public $amount;
    public $source;
    public $description;
    public $income_date;
    public $status = 'pending';

    protected $rules = [
        'amount' => 'required|numeric|min:0',
        'source' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'income_date' => 'required|date',
    ];

    public function mount(Account $account)
    {
        $this->account = $account;
        $this->income_date = now()->format('Y-m-d');
    }

    public function createIncome()
    {
        $this->validate();

        $this->account->incomes()->create([
            'amount' => $this->amount,
            'source' => $this->source,
            'description' => $this->description,
            'income_date' => $this->income_date,
            'status' => 'pending'
        ]);

        $this->reset(['amount', 'source', 'description', 'income_date', 'showCreateModal']);
        session()->flash('success', __('Income request submitted successfully. Pending approval.'));
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['amount', 'source', 'description', 'income_date']);
    }

    public function render()
    {
        return view('livewire.customer.account-incomes', [
            'incomes' => $this->account->incomes()
                ->latest()
                ->paginate(10),
            'totalIncome' => $this->account->total_income,
            'pendingIncome' => $this->account->pending_income,
            'monthlyIncome' => $this->account->monthly_income,
            'yearlyIncome' => $this->account->yearly_income,
            'incomeByMonth' => $this->account->income_by_month
        ]);
    }
}
