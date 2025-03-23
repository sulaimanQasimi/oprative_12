<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Account;
use Livewire\WithPagination;

class CustomerAccounts extends Component
{
    use WithPagination;

    public $name;
    public $bank_name;
    public $branch;
    public $showCreateModal = false;

    protected $rules = [
        'name' => 'required|string|max:255',
        'bank_name' => 'required|string|max:255',
        'branch' => 'required|string|max:255',
    ];

    private function generateUniqueAccountNumber()
    {
        do {
            // Format: YY-BANK-XXXXX where:
            // YY = Last 2 digits of current year
            // BANK = First 4 letters of bank name (padded with X if shorter)
            // XXXXX = Random 5 digits
            $year = date('y');
            $bankCode = strtoupper(substr(preg_replace('/[^A-Za-z0-9]/', '', $this->bank_name), 0, 4));
            $bankCode = str_pad($bankCode, 4, 'X');
            $random = str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);

            $accountNumber = "{$year}-{$bankCode}-{$random}";
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }

    public function createAccount()
    {
        $this->validate();

        auth('customer')->user()->accounts()->create([
            'name' => $this->name,
            'account_number' => $this->generateUniqueAccountNumber(),
            'bank_name' => $this->bank_name,
            'branch' => $this->branch,
        ]);

        $this->reset(['name', 'bank_name', 'branch', 'showCreateModal']);
        session()->flash('success', 'Account created successfully with an auto-generated account number.');
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['name', 'bank_name', 'branch']);
    }

    public function render()
    {
        return view('livewire.customer.customer-accounts', [
            'accounts' => auth('customer')->user()->accounts()->latest()->paginate(10)
        ]);
    }
}
