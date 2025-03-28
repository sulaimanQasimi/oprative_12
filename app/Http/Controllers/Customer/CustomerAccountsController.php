<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Account;
use App\Repositories\Customer\CustomerRepository;

class CustomerAccountsController extends Controller
{
    public function index(Request $request)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $search_id_number = $request->query('search_id_number', '');
        $search_account_number = $request->query('search_account_number', '');
        $isFilterOpen = !empty($search_id_number) || !empty($search_account_number);

        $query = $customer->accounts();

        if (!empty($search_id_number)) {
            $query->where('id_number', 'like', '%' . trim($search_id_number) . '%');
        }

        if (!empty($search_account_number)) {
            $query->where('account_number', 'like', '%' . trim($search_account_number) . '%');
        }

        $accounts = $query->latest()->paginate(10);

        return view('customer.accounts.index', [
            'accounts' => $accounts,
            'search_id_number' => $search_id_number,
            'search_account_number' => $search_account_number,
            'isFilterOpen' => $isFilterOpen,
            'customer' => $customer
        ]);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|string|max:50|unique:accounts',
            'address' => 'required|string|max:500',
        ]);

        $customer = CustomerRepository::currentUserCustomer()->model;

        $customer->accounts()->create([
            'name' => $request->name,
            'id_number' => $request->id_number,
            'account_number' => $this->generateUniqueAccountNumber($customer->id),
            'address' => $request->address,
            'approved_by' => null, // This will be set by admin/staff later
        ]);

        return redirect()->route('customer.accounts.index')
            ->with('success', __('Account request submitted successfully. Pending approval.'));
    }

    public function create()
    {
        return view('customer.accounts.create');
    }

    public function resetFilters()
    {
        return redirect()->route('customer.accounts.index');
    }

    private function generateUniqueAccountNumber($customer_id)
    {
        do {
            // Format: YY-CID-XXXXX where:
            // YY = Last 2 digits of current year
            // CID = First 4 digits of customer ID
            // XXXXX = Random 5 digits
            $year = date('y');
            $customerId = str_pad(substr($customer_id, 0, 4), 4, '0');
            $random = str_pad(rand(0, 99999), 5, '0', STR_PAD_LEFT);

            $accountNumber = "{$year}-{$customerId}-{$random}";
        } while (Account::where('account_number', $accountNumber)->exists());

        return $accountNumber;
    }
}
