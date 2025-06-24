<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Account;
use App\Models\Customer;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;

class AccountController extends Controller
{
    public function index(Request $request)
    {
        $query = Account::with(['customer', 'incomes', 'outcomes']);

        // Filter by customer if specified
        if ($request->filled('customer_id')) {
            $query->where('customer_id', $request->customer_id);
        }

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('account_number', 'like', "%{$search}%")
                  ->orWhere('id_number', 'like', "%{$search}%")
                  ->orWhereHas('customer', function ($customerQuery) use ($search) {
                      $customerQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        $paginatedAccounts = $query->latest()->paginate(10);
        $paginatedAccounts->appends($request->query());
        
        // Transform the paginated data
        $accounts = [
            'data' => $paginatedAccounts->items(),
            'current_page' => $paginatedAccounts->currentPage(),
            'last_page' => $paginatedAccounts->lastPage(),
            'per_page' => $paginatedAccounts->perPage(),
            'total' => $paginatedAccounts->total(),
            'from' => $paginatedAccounts->firstItem(),
            'to' => $paginatedAccounts->lastItem(),
            'links' => $paginatedAccounts->linkCollection(),
        ];
        
        // Transform each account
        $accounts['data'] = collect($accounts['data'])->map(function ($account) {
            $totalIncome = $account->approvedIncomes()->sum('amount');
            $totalOutcome = $account->approvedOutcomes()->sum('amount');
            $netBalance = $totalIncome - $totalOutcome;

            return [
                'id' => $account->id,
                'name' => $account->name,
                'id_number' => $account->id_number,
                'account_number' => $account->account_number,
                'customer' => [
                    'id' => $account->customer->id,
                    'name' => $account->customer->name,
                ],
                'address' => $account->address,
                'status' => $account->status,
                'total_income' => $totalIncome,
                'total_outcome' => $totalOutcome,
                'net_balance' => $netBalance,
                'pending_income' => $account->pendingIncomes()->sum('amount'),
                'pending_outcome' => $account->pendingOutcomes()->sum('amount'),
                'created_at' => $account->created_at,
                'updated_at' => $account->updated_at,
            ];
        })->toArray();

        $customers = Customer::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Account/Index', [
            'accounts' => $accounts,
            'customers' => $customers,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
                'customer_id' => $request->get('customer_id'),
            ],
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function create(Request $request)
    {
        $customers = Customer::select('id', 'name')->orderBy('name')->get();
        $selectedCustomerId = $request->customer_id;

        return Inertia::render('Admin/Account/Create', [
            'customers' => $customers,
            'selectedCustomerId' => $selectedCustomerId,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|string|max:50|unique:accounts,id_number',
            'account_number' => 'required|string|max:50|unique:accounts,account_number',
            'customer_id' => 'required|exists:customers,id',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:pending,active,suspended,closed',
        ]);

        try {
            $account = Account::create([
                'name' => $validated['name'],
                'id_number' => $validated['id_number'],
                'account_number' => $validated['account_number'],
                'customer_id' => $validated['customer_id'],
                'address' => $validated['address'],
                'status' => $validated['status'],
                'approved_by' => Auth::id(),
            ]);

            return redirect()->route('admin.accounts.index')
                ->with('success', 'Account created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating account: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating account: ' . $e->getMessage()]);
        }
    }

    public function show(Account $account)
    {
        try {
            $account->load(['customer', 'incomes.user', 'outcomes.user']);

            $totalIncome = $account->approvedIncomes()->sum('amount');
            $totalOutcome = $account->approvedOutcomes()->sum('amount');
            $netBalance = $totalIncome - $totalOutcome;

            // Get monthly data for charts
            $monthlyIncome = $account->approvedIncomes()
                ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
                ->whereYear('date', now()->year)
                ->groupBy('month')
                ->get()
                ->pluck('total', 'month')
                ->toArray();

            $monthlyOutcome = $account->approvedOutcomes()
                ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
                ->whereYear('date', now()->year)
                ->groupBy('month')
                ->get()
                ->pluck('total', 'month')
                ->toArray();

            return Inertia::render('Admin/Account/Show', [
                'account' => [
                    'id' => $account->id,
                    'name' => $account->name,
                    'id_number' => $account->id_number,
                    'account_number' => $account->account_number,
                    'customer' => $account->customer,
                    'address' => $account->address,
                    'status' => $account->status,
                    'total_income' => $totalIncome,
                    'total_outcome' => $totalOutcome,
                    'net_balance' => $netBalance,
                    'pending_income' => $account->pendingIncomes()->sum('amount'),
                    'pending_outcome' => $account->pendingOutcomes()->sum('amount'),
                    'monthly_income' => $monthlyIncome,
                    'monthly_outcome' => $monthlyOutcome,
                    'recent_incomes' => $account->incomes()->with('user')->latest()->take(5)->get(),
                    'recent_outcomes' => $account->outcomes()->with('user')->latest()->take(5)->get(),
                    'created_at' => $account->created_at,
                    'updated_at' => $account->updated_at,
                ],
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading account: ' . $e->getMessage());
            return redirect()->route('admin.accounts.index')
                ->with('error', 'Error loading account: ' . $e->getMessage());
        }
    }

    public function edit(Account $account)
    {
        $customers = Customer::select('id', 'name')->orderBy('name')->get();

        return Inertia::render('Admin/Account/Edit', [
            'account' => [
                'id' => $account->id,
                'name' => $account->name,
                'id_number' => $account->id_number,
                'account_number' => $account->account_number,
                'customer_id' => $account->customer_id,
                'address' => $account->address,
                'status' => $account->status,
            ],
            'customers' => $customers,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function update(Request $request, Account $account)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'id_number' => 'required|string|max:50|unique:accounts,id_number,' . $account->id,
            'account_number' => 'required|string|max:50|unique:accounts,account_number,' . $account->id,
            'customer_id' => 'required|exists:customers,id',
            'address' => 'nullable|string|max:500',
            'status' => 'required|in:pending,active,suspended,closed',
        ]);

        try {
            $account->update([
                'name' => $validated['name'],
                'id_number' => $validated['id_number'],
                'account_number' => $validated['account_number'],
                'customer_id' => $validated['customer_id'],
                'address' => $validated['address'],
                'status' => $validated['status'],
            ]);

            return redirect()->route('admin.accounts.show', $account->id)
                ->with('success', 'Account updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating account: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating account: ' . $e->getMessage()]);
        }
    }

    public function destroy(Account $account)
    {
        try {
            // Check if account has any transactions
            if ($account->incomes()->count() > 0 || $account->outcomes()->count() > 0) {
                return redirect()->back()
                    ->with('error', 'Cannot delete account with existing transactions.');
            }

            $account->delete();

            return redirect()->route('admin.accounts.index')
                ->with('success', 'Account deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting account: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting account: ' . $e->getMessage());
        }
    }

    public function incomes(Request $request, Account $account)
    {
        $query = $account->incomes()->with(['user']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $incomes = $query->latest('date')->get();

        return Inertia::render('Admin/Account/Income', [
            'account' => [
                'id' => $account->id,
                'name' => $account->name,
                'account_number' => $account->account_number,
                'customer' => $account->customer,
            ],
            'incomes' => $incomes,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
            'auth' => [
                'user' => Auth::user()
            ]
        ]);
    }

    public function outcomes(Request $request, Account $account)
    {
        $query = $account->outcomes()->with(['user']);

        // Search functionality
        if ($request->has('search') && $request->search) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('description', 'like', "%{$search}%")
                  ->orWhere('reference_number', 'like', "%{$search}%");
            });
        }

        // Status filter
        if ($request->has('status') && $request->status) {
            $query->where('status', $request->status);
        }

        // Date range filter
        if ($request->has('date_from') && $request->date_from) {
            $query->whereDate('date', '>=', $request->date_from);
        }
        if ($request->has('date_to') && $request->date_to) {
            $query->whereDate('date', '<=', $request->date_to);
        }

        $outcomes = $query->latest('date')->get();

        return Inertia::render('Admin/Account/Outcome', [
            'account' => [
                'id' => $account->id,
                'name' => $account->name,
                'account_number' => $account->account_number,
                'customer' => $account->customer,
            ],
            'outcomes' => $outcomes,
            'filters' => $request->only(['search', 'status', 'date_from', 'date_to']),
        ]);
    }
}
