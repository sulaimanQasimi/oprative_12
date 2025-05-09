<?php

namespace App\Livewire\Customer;

use App\Models\Account;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use App\Repositories\Customer\CustomerRepository;
use Livewire\Component;
use Livewire\WithPagination;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

class AccountIncomes extends Component
{
    use WithPagination;

    protected $customer;
    protected Account $account;
    public $showCreateModal = false;
    public $showCreateOutcomeModal = false;
    public $amount;
    public $description;
    public $status = 'pending';
    public $activeTab = 'incomes';

    // Outcome properties
    public $outcome_amount;
    public $outcome_reference_number;
    public $outcome_date;
    public $outcome_description;

    protected $rules = [
        'amount' => 'required|numeric|min:0',
        'description' => 'nullable|string|max:1000',
        'outcome_amount' => 'required|numeric|min:0',
        'outcome_reference_number' => 'nullable|string|max:255',
        'outcome_date' => 'required|date',
        'outcome_description' => 'nullable|string|max:1000',
    ];

    public function mount(Account $account)
    {
        // Verify account belongs to authenticated customer
        $customer = CustomerRepository::currentUserCustomer()->model;
        if ($account->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to account');
        }

        $this->customer = $customer;
        $this->account = $account;
        $this->outcome_date = now()->format('Y-m-d');
    }

    public function createIncome()
    {
        $this->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Re-verify account belongs to customer
            if ($this->account->customer_id !== $this->customer->id) {
                throw ValidationException::withMessages(['amount' => 'Unauthorized operation']);
            }

            $this->account->incomes()->create([
                'amount' => $this->amount,
                'description' => $this->description,
                'status' => 'pending'
            ]);

            DB::commit();

            $this->reset(['amount', 'description', 'showCreateModal']);
            session()->flash('success', __('Income request submitted successfully. Pending approval.'));
        } catch (\Exception $e) {
            DB::rollBack();
            session()->flash('error', __('Error creating income: ') . $e->getMessage());
        }
    }

    public function createOutcome()
    {
        $this->validate([
            'outcome_amount' => 'required|numeric|min:0',
            'outcome_reference_number' => 'nullable|string|max:255',
            'outcome_date' => 'required|date',
            'outcome_description' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Re-verify account belongs to customer
            if ($this->account->customer_id !== $this->customer->id) {
                throw ValidationException::withMessages(['outcome_amount' => 'Unauthorized operation']);
            }

            $this->account->outcomes()->create([
                'amount' => $this->outcome_amount,
                'reference_number' => $this->outcome_reference_number,
                'date' => $this->outcome_date,
                'description' => $this->outcome_description,
                'status' => 'pending',
                'user_id' => auth()->guard('customer_user')->id()
            ]);

            DB::commit();

            $this->reset(['outcome_amount', 'outcome_reference_number', 'outcome_date', 'outcome_description', 'showCreateOutcomeModal']);
            session()->flash('success', __('Outcome request submitted successfully. Pending approval.'));
        } catch (\Exception $e) {
            DB::rollBack();
            session()->flash('error', __('Error creating outcome: ') . $e->getMessage());
        }
    }

    public function approveIncome(AccountIncome $income)
    {
        if ($income->account_id !== $this->account->id || $this->account->customer_id !== $this->customer->id) {
            abort(403);
        }

        try {
            DB::beginTransaction();
            $income->update(['status' => 'approved']);
            DB::commit();
            session()->flash('success', __('Income approved successfully.'));
        } catch (\Exception $e) {
            DB::rollBack();
            session()->flash('error', __('Error approving income: ') . $e->getMessage());
        }
    }

    public function approveOutcome(AccountOutcome $outcome)
    {
        if ($outcome->account_id !== $this->account->id || $this->account->customer_id !== $this->customer->id) {
            abort(403);
        }

        try {
            DB::beginTransaction();
            $outcome->update(['status' => 'approved']);
            DB::commit();
            session()->flash('success', __('Rent approved successfully.'));
        } catch (\Exception $e) {
            DB::rollBack();
            session()->flash('error', __('Error approving outcome: ') . $e->getMessage());
        }
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['amount', 'description']);
    }

    public function toggleCreateOutcomeModal()
    {
        $this->showCreateOutcomeModal = !$this->showCreateOutcomeModal;
        $this->reset(['outcome_amount', 'outcome_reference_number', 'outcome_date', 'outcome_description']);
    }

    public function render()
    {
        // Final account ownership verification
        if ($this->account->customer_id !== $this->customer->id) {
            abort(403);
        }

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
