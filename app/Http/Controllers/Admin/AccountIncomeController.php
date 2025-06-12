<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountIncome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AccountIncomeController extends Controller
{
    public function store(Request $request, Account $account)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'source' => 'required|string|in:sale,service,interest,commission,other',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $income = $account->incomes()->create([
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'source' => $validated['source'],
                'date' => $validated['date'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'approved', // Admin creates approved incomes by default
                'user_id' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Income record created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating income: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating income: ' . $e->getMessage()]);
        }
    }

    public function show(Account $account, AccountIncome $income)
    {
        // Ensure income belongs to the account
        if ($income->account_id !== $account->id) {
            abort(404);
        }

        return response()->json([
            'income' => $income->load(['user', 'account']),
        ]);
    }

    public function update(Request $request, Account $account, AccountIncome $income)
    {
        // Ensure income belongs to the account
        if ($income->account_id !== $account->id) {
            abort(404);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'source' => 'required|string|in:sale,service,interest,commission,other',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        try {
            DB::beginTransaction();

            $income->update($validated);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Income record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating income: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating income: ' . $e->getMessage()]);
        }
    }

    public function destroy(Account $account, AccountIncome $income)
    {
        // Ensure income belongs to the account
        if ($income->account_id !== $account->id) {
            abort(404);
        }

        try {
            $income->delete();

            return redirect()->back()
                ->with('success', 'Income record deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting income: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting income: ' . $e->getMessage());
        }
    }
}
