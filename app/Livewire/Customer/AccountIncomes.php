<?php

namespace App\Livewire\Customer;

use App\Models\Account;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use Livewire\Component;
use Livewire\WithPagination;

class AccountIncomes extends Component
{
    use WithPagination;

    public $account;
    public $showCreateModal = false;
    public $showCreateOutcomeModal = false;
    public $amount;
    public $source;
    public $description;
    public $date;
    public $status = 'pending';
    public $activeTab = 'incomes';

    // Outcome properties
    public $outcome_amount;
    public $outcome_reference_number;
    public $outcome_date;
    public $outcome_description;

    protected $rules = [
        'amount' => 'required|numeric|min:0',
        'source' => 'required|string|max:255',
        'description' => 'nullable|string|max:1000',
        'date' => 'required|date',
        'outcome_amount' => 'required|numeric|min:0',
        'outcome_reference_number' => 'nullable|string|max:255',
        'outcome_date' => 'required|date',
        'outcome_description' => 'nullable|string|max:1000',
    ];

    public function mount(Account $account)
    {
        $this->account = $account;
        $this->date = now()->format('Y-m-d');
        $this->outcome_date = now()->format('Y-m-d');
    }

    public function createIncome()
    {
        $this->validate([
            'amount' => 'required|numeric|min:0',
            'source' => 'required|string|max:255',
            'description' => 'nullable|string|max:1000',
            'date' => 'required|date',
        ]);

        $this->account->incomes()->create([
            'amount' => $this->amount,
            'source' => $this->source,
            'description' => $this->description,
            'date' => $this->date,
            'status' => 'pending'
        ]);

        $this->reset(['amount', 'source', 'description', 'date', 'showCreateModal']);
        session()->flash('success', __('Income request submitted successfully. Pending approval.'));
    }

    public function createOutcome()
    {
        $this->validate([
            'outcome_amount' => 'required|numeric|min:0',
            'outcome_reference_number' => 'nullable|string|max:255',
            'outcome_date' => 'required|date',
            'outcome_description' => 'nullable|string|max:1000',
        ]);

        $this->account->outcomes()->create([
            'amount' => $this->outcome_amount,
            'reference_number' => $this->outcome_reference_number,
            'date' => $this->outcome_date,
            'description' => $this->outcome_description,
            'status' => 'pending',
            'user_id' => auth('customer')->id()
        ]);

        $this->reset(['outcome_amount', 'outcome_reference_number', 'outcome_date', 'outcome_description', 'showCreateOutcomeModal']);
        session()->flash('success', __('Outcome request submitted successfully. Pending approval.'));
    }

    public function approveIncome(AccountIncome $income)
    {
        if ($income->account_id !== $this->account->id) {
            abort(403);
        }

        $income->update(['status' => 'approved']);
        session()->flash('success', __('Income approved successfully.'));
    }

    public function approveOutcome(AccountOutcome $outcome)
    {
        if ($outcome->account_id !== $this->account->id) {
            abort(403);
        }

        $outcome->update(['status' => 'approved']);
        session()->flash('success', __('Rent approved successfully.'));
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['amount', 'source', 'description', 'date']);
    }

    public function toggleCreateOutcomeModal()
    {
        $this->showCreateOutcomeModal = !$this->showCreateOutcomeModal;
        $this->reset(['outcome_amount', 'outcome_reference_number', 'outcome_date', 'outcome_description']);
    }

    public function render()
    {
        return view('livewire.customer.account-incomes', [
            'incomes' => $this->account->incomes()
                ->latest()
                ->paginate(10),
            'outcomes' => $this->account->outcomes()
                ->latest()
                ->paginate(10),
            'totalIncome' => $this->account->total_income,
            'pendingIncome' => $this->account->pending_income,
            'monthlyIncome' => $this->account->monthly_income,
            'yearlyIncome' => $this->account->yearly_income,
            'incomeByMonth' => $this->account->income_by_month,
            'totalOutcome' => $this->account->outcomes()->where('status', '=', 'approved')->sum('amount'),
            'pendingOutcome' => $this->account->outcomes()->where('status', '=', 'pending')->sum('amount'),
            'monthlyOutcome' => $this->account->outcomes()
                ->where('status', '=', 'approved')
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('amount'),
            'yearlyOutcome' => $this->account->outcomes()
                ->where('status', '=', 'approved')
                ->whereYear('date', now()->year)
                ->sum('amount'),
        ]);
    }
}
