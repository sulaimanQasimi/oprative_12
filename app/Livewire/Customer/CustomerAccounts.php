<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use App\Models\Account;
use App\Repositories\Customer\CustomerRepository;
use Livewire\WithPagination;

class CustomerAccounts extends Component
{
    use WithPagination;

    public $customer;
    public $name;
    public $id_number;
    public $account_number;
    public $customer_id;
    public $approved_by;
    public $address;
    public $showCreateModal = false;
    public $search_id_number = '';
    public $search_account_number = '';
    public $isFilterOpen = false;

    protected $queryString = [
        'search_id_number' => ['except' => ''],
        'search_account_number' => ['except' => '']
    ];

    // Add listeners for search updates
    protected $listeners = ['refresh' => '$refresh'];

    // Update rules
    protected $rules = [
        'name' => 'required|string|max:255',
        'id_number' => 'required|string|max:50|unique:accounts',
        'address' => 'required|string|max:500',
    ];

    // Add updatedSearchIdNumber method
    public function updatedSearchIdNumber()
    {
        $this->resetPage();
    }

    // Add updatedSearchAccountNumber method
    public function updatedSearchAccountNumber()
    {
        $this->resetPage();
    }

    public function mount()
    {
        $this->customer = CustomerRepository::currentUserCustomer()->model;
        $this->customer_id = $this->customer->id;
        $this->isFilterOpen = $this->search_id_number || $this->search_account_number;
    }

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

        // Set customer_id from authent
        $this->customer->accounts()->create([
            'name' => $this->name,
            'id_number' => $this->id_number,
            'account_number' => $this->generateUniqueAccountNumber(),
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

    public function resetFilters()
    {
        $this->reset(['search_id_number', 'search_account_number']);
        $this->resetPage();
    }

    public function toggleFilter()
    {
        $this->isFilterOpen = !$this->isFilterOpen;
    }

    public function render()
    {
        $query = $this->customer->accounts();

        if (!empty($this->search_id_number)) {
            $query->where('id_number', 'like', '%' . trim($this->search_id_number) . '%');
        }

        if (!empty($this->search_account_number)) {
            $query->where('account_number', 'like', '%' . trim($this->search_account_number) . '%');
        }

        return view('livewire.customer.customer-accounts', [
            'accounts' => $query->latest()->paginate(10)
        ]);
    }
}
