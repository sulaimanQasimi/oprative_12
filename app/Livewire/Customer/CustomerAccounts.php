<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Account;
use Livewire\WithPagination;

class CustomerAccounts extends Component
{
    use WithPagination;

    public $name;
    public $account_number;
    public $bank_name;
    public $branch;
    public $showCreateModal = false;

    protected $rules = [
        'name' => 'required|string|max:255',
        'account_number' => 'required|string|max:255',
        'bank_name' => 'required|string|max:255',
        'branch' => 'required|string|max:255',
    ];

    public function createAccount()
    {
        $this->validate();

        auth('customer')->user()->accounts()->create([
            'name' => $this->name,
            'account_number' => $this->account_number,
            'bank_name' => $this->bank_name,
            'branch' => $this->branch,
        ]);

        $this->reset(['name', 'account_number', 'bank_name', 'branch', 'showCreateModal']);
        session()->flash('success', 'Account created successfully.');
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['name', 'account_number', 'bank_name', 'branch']);
    }

    public function render()
    {
        return view('livewire.customer.customer-accounts', [
            'accounts' => auth('customer')->user()->accounts()->latest()->paginate(10)
        ]);
    }
}
