<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use App\Models\Warehouse;

class WalletController extends Controller
{
    public function wallet(Request $request)
    {
        $warehouse = Auth::user()->warehouse ?? null;
        if (!$warehouse) {
            return redirect()->route('warehouse.dashboard')->with('error', 'No warehouse assigned.');
        }
        $wallet = $warehouse->wallet;
        if (!$wallet) {
            $wallet = $warehouse->createWallet([
                'name' => $warehouse->name . ' Wallet',
                'slug' => 'warehouse-' . $warehouse->id,
            ]);
        }
        $transactions = $wallet->transactions()->orderBy('created_at', 'desc')->limit(20)->get();
        $totalDeposits = $wallet->transactions()->where('type', 'deposit')->sum('amount');
        $totalWithdrawals = $wallet->transactions()->where('type', 'withdraw')->sum('amount');
        $currentBalance = $wallet->balance;
        return Inertia::render('Warehouse/Wallet', [
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
                'code' => $warehouse->code,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $currentBalance,
            ],
            'transactions' => $transactions,
            'statistics' => [
                'total_deposits' => $totalDeposits,
                'total_withdrawals' => $totalWithdrawals,
                'current_balance' => $currentBalance,
            ],
        ]);
    }

    public function depositForm(Request $request)
    {
        $warehouse = Auth::user()->warehouse ?? null;
        if (!$warehouse) {
            return redirect()->route('warehouse.dashboard')->with('error', 'No warehouse assigned.');
        }
        $wallet = $warehouse->wallet;
        return Inertia::render('Warehouse/WalletDeposit', [
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $wallet->balance,
            ],
        ]);
    }

    public function deposit(Request $request)
    {
        $warehouse = Auth::user()->warehouse ?? null;
        if (!$warehouse) {
            return redirect()->route('warehouse.dashboard')->with('error', 'No warehouse assigned.');
        }
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:1000',
        ]);
        $wallet = $warehouse->wallet;
        $wallet->deposit($validated['amount'], [
            'description' => $validated['description'] ?? 'Manual deposit',
            'created_by' => Auth::id(),
            'warehouse_id' => $warehouse->id,
        ]);
        return redirect()->route('warehouse.wallet')->with('success', 'Deposit completed successfully.');
    }

    public function withdrawForm(Request $request)
    {
        $warehouse = Auth::user()->warehouse ?? null;
        if (!$warehouse) {
            return redirect()->route('warehouse.dashboard')->with('error', 'No warehouse assigned.');
        }
        $wallet = $warehouse->wallet;
        return Inertia::render('Warehouse/WalletWithdraw', [
            'warehouse' => [
                'id' => $warehouse->id,
                'name' => $warehouse->name,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $wallet->balance,
            ],
        ]);
    }

    public function withdraw(Request $request)
    {
        $warehouse = Auth::user()->warehouse ?? null;
        if (!$warehouse) {
            return redirect()->route('warehouse.dashboard')->with('error', 'No warehouse assigned.');
        }
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
            'description' => 'nullable|string|max:1000',
        ]);
        $wallet = $warehouse->wallet;
        if ($wallet->balance < $validated['amount']) {
            return redirect()->back()->withErrors(['amount' => 'Insufficient balance.']);
        }
        $wallet->withdraw($validated['amount'], [
            'description' => $validated['description'] ?? 'Manual withdrawal',
            'created_by' => Auth::id(),
            'warehouse_id' => $warehouse->id,
        ]);
        return redirect()->route('warehouse.wallet')->with('success', 'Withdrawal completed successfully.');
    }
}
