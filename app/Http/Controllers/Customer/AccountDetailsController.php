<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;

class AccountDetailsController extends Controller
{
    /**
     * Display the account incomes and outcomes.
     */
    public function showIncomes(Account $account, Request $request)
    {
        // Verify account belongs to authenticated customer
        $customer = CustomerRepository::currentUserCustomer()->model;
        if ($account->customer_id !== $customer->id) {
            abort(403, 'Unauthorized access to account');
        }

        $tab = $request->get('tab', 'incomes');

        $incomes = $account->incomes()
            ->latest()
            ->paginate(10, ['*'], 'incomes_page');

        $outcomes = $account->outcomes()
            ->latest()
            ->paginate(10, ['*'], 'outcomes_page');

        return Inertia::render('Customer/Accounts/AccountDetails', [
            'account' => $account,
            'incomes' => $incomes,
            'outcomes' => $outcomes,
            'totalIncome' => $account->total_income,
            'pendingIncome' => $account->pending_income,
            'monthlyIncome' => $account->monthly_income,
            'yearlyIncome' => $account->yearly_income,
            'incomeByMonth' => $account->income_by_month,
            'totalOutcome' => $account->outcomes()->where('status', '=', 'approved')->sum('amount'),
            'pendingOutcome' => $account->outcomes()->where('status', '=', 'pending')->sum('amount'),
            'monthlyOutcome' => $account->outcomes()
                ->where('status', '=', 'approved')
                ->whereMonth('date', now()->month)
                ->whereYear('date', now()->year)
                ->sum('amount'),
            'yearlyOutcome' => $account->outcomes()
                ->where('status', '=', 'approved')
                ->whereYear('date', now()->year)
                ->sum('amount'),
            'tab' => $tab,
            'customer' => $customer,
        ]);
    }

    /**
     * Create a new income.
     */
    public function createIncome(Account $account, Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'source' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            // Verify account belongs to authenticated customer
            $customer = CustomerRepository::currentUserCustomer()->model;
            if ($account->customer_id !== $customer->id) {
                throw ValidationException::withMessages(['amount' => 'Unauthorized operation']);
            }

            $account->incomes()->create([
                'amount' => $request->amount,
                'source' => '',
                'date' => now(),
                'description' => $request->description,
                'status' => 'pending'
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Income request submitted successfully. Pending approval.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error creating income: ' . $e->getMessage());
        }
    }

    /**
     * Create a new outcome.
     */
    public function createOutcome(Account $account, Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:0',
            'reference_number' => 'nullable|string|max:255',
            'date' => 'nullable|date',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Verify account belongs to authenticated customer
            $customer = CustomerRepository::currentUserCustomer()->model;
            if ($account->customer_id !== $customer->id) {
                throw ValidationException::withMessages(['amount' => 'Unauthorized operation']);
            }

            // Generate unique reference number
            $reference_number = 'OUT-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

            $account->outcomes()->create([
                'amount' => $request->amount,
                'reference_number' => $reference_number,
                'date' => $request->date ?? now(),
                'description' => $request->description,
                'status' => 'pending',
                'user_id' => auth()->guard('customer_user')->id()
            ]);

            DB::commit();

            return redirect()->back()->with('success', 'Outcome request submitted successfully. Pending approval.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error creating outcome: ' . $e->getMessage());
        }
    }

    /**
     * Approve an income.
     */
    public function approveIncome(Account $account, AccountIncome $income)
    {
        // Verify account belongs to authenticated customer
        $customer = CustomerRepository::currentUserCustomer()->model;
        if ($income->account_id !== $account->id || $account->customer_id !== $customer->id) {
            abort(403, 'Unauthorized operation');
        }

        try {
            DB::beginTransaction();
            $income->update(['status' => 'approved']);
            DB::commit();
            return redirect()->back()->with('success', 'Income approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error approving income: ' . $e->getMessage());
        }
    }

    /**
     * Approve an outcome.
     */
    public function approveOutcome(Account $account, AccountOutcome $outcome)
    {
        // Verify account belongs to authenticated customer
        $customer = CustomerRepository::currentUserCustomer()->model;
        if ($outcome->account_id !== $account->id || $account->customer_id !== $customer->id) {
            abort(403, 'Unauthorized operation');
        }

        try {
            DB::beginTransaction();
            $outcome->update(['status' => 'approved']);
            DB::commit();
            return redirect()->back()->with('success', 'Rent approved successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            return redirect()->back()->with('error', 'Error approving outcome: ' . $e->getMessage());
        }
    }
}
