<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\AccountOutcome;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AccountOutcomeController extends Controller
{
    public function store(Request $request, Account $account)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'reference_number' => 'nullable|string|max:255',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            // Generate reference number if not provided
            $referenceNumber = $validated['reference_number'] ?? 'OUT-' . strtoupper(substr(md5(uniqid(mt_rand(), true)), 0, 8));

            $outcome = $account->outcomes()->create([
                'amount' => $validated['amount'],
                'description' => $validated['description'],
                'reference_number' => $referenceNumber,
                'date' => $validated['date'],
                'notes' => $validated['notes'] ?? null,
                'status' => 'approved', // Admin creates approved outcomes by default
                'user_id' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Outcome record created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating outcome: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating outcome: ' . $e->getMessage()]);
        }
    }

    public function show(Account $account, AccountOutcome $outcome)
    {
        // Ensure outcome belongs to the account
        if ($outcome->account_id !== $account->id) {
            abort(404);
        }

        return response()->json([
            'outcome' => $outcome->load(['user', 'account']),
        ]);
    }

    public function update(Request $request, Account $account, AccountOutcome $outcome)
    {
        // Ensure outcome belongs to the account
        if ($outcome->account_id !== $account->id) {
            abort(404);
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0',
            'description' => 'required|string|max:1000',
            'reference_number' => 'nullable|string|max:255',
            'date' => 'required|date',
            'notes' => 'nullable|string|max:1000',
            'status' => 'required|string|in:pending,approved,rejected',
        ]);

        try {
            DB::beginTransaction();

            $outcome->update($validated);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Outcome record updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating outcome: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating outcome: ' . $e->getMessage()]);
        }
    }

    public function destroy(Account $account, AccountOutcome $outcome)
    {
        // Ensure outcome belongs to the account
        if ($outcome->account_id !== $account->id) {
            abort(404);
        }

        try {
            $outcome->delete();

            return redirect()->back()
                ->with('success', 'Outcome record deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting outcome: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting outcome: ' . $e->getMessage());
        }
    }
}
