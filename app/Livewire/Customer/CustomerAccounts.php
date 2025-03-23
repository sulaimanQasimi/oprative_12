<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Account;
use Livewire\WithPagination;

class CustomerAccounts extends Component
{
    use WithPagination;

    public $name;
    public $id_number;
    public $account_number;
    public $customer_id;
    public $approved_by;
    public $address;
    public $showCreateModal = false;

    protected $rules = [
        'name' => 'required|string|max:255',
        'id_number' => 'required|string|max:50|unique:accounts',
        'address' => 'required|string|max:500',
    ];

    private function generateUniqueAccountNumber()
    {
        do {
            // Format: YY-CID-XXXXX where:
            // YY = Last 2 digits of current year
            // CID = First 4 digits of customer ID
            // XXXXX = Random 5 digits
            $year = date('y');
            $customerId = str_pad(substr($this->customer_id, 0, 4), 4, '0');
            $random = str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);

            $accountNumber = "{$year}-{$customerId}-{$random}";
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }

    public function createAccount()
    {
        $this->validate();

        // Set customer_id from authenticated user
        $this->customer_id = auth('customer')->id();

        auth('customer')->user()->accounts()->create([
            'name' => $this->name,
            'id_number' => $this->id_number,
            'account_number' => $this->generateUniqueAccountNumber(),
            'customer_id' => $this->customer_id,
            'address' => $this->address,
            'approved_by' => null, // This will be set by admin/staff later
        ]);

        $this->reset(['name', 'id_number', 'address', 'showCreateModal']);
        session()->flash('success', __('Account request submitted successfully. Pending approval.'));
    }

    public function toggleCreateModal()
    {
        $this->showCreateModal = !$this->showCreateModal;
        $this->reset(['name', 'id_number', 'address']);
    }

    public function render()
    {
        return view('livewire.customer.customer-accounts', [
            'accounts' => auth('customer')->user()->accounts()->latest()->paginate(10)
        ]);
    }
}
