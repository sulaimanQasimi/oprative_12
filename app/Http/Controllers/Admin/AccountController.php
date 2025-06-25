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
    /**
     * Constructor to apply middleware for all account permissions
     *
     * Permissions implemented:
     * - view_account: View individual account details
     * - view_any_account: View list of accounts and access index
     * - create_account: Create new accounts
     * - update_account: Edit and update account information
     * - delete_account: Soft delete accounts
     * - restore_account: Restore soft-deleted accounts
     * - force_delete_account: Permanently delete accounts
     */
    public function __construct()
    {
        // Apply comprehensive middleware protection for all account operations
        $this->middleware('permission:view_any_account')->only(['index']);
        $this->middleware('permission:view_account')->only(['show']);
        $this->middleware('permission:create_account')->only(['create', 'store']);
        $this->middleware('permission:update_account')->only(['edit', 'update']);
        $this->middleware('permission:delete_account')->only(['destroy']);
        $this->middleware('permission:restore_account')->only(['restore']);
        $this->middleware('permission:force_delete_account')->only(['forceDelete']);
    }

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
        ];

        // Transform each account
        $accounts['data'] = collect($accounts['data'])
        ->map(function ($account) {
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

        // Pass all 7 account permissions to frontend for UI control
        $permissions = [
            'view_account' => Auth::user()->can('view_account'),
            'view_any_account' => Auth::user()->can('view_any_account'),
            'create_account' => Auth::user()->can('create_account'),
            'update_account' => Auth::user()->can('update_account'),
            'delete_account' => Auth::user()->can('delete_account'),
            'restore_account' => Auth::user()->can('restore_account'),
            'force_delete_account' => Auth::user()->can('force_delete_account'),
        ];

        return Inertia::render('Admin/Account/Index', [
            'accounts' => $accounts,
            'customers' => $customers,
            'filters' => [
                'search' => $request->get('search'),
                'status' => $request->get('status'),
                'customer_id' => $request->get('customer_id'),
            ],
            'permissions' => $permissions,
        ]);
    }

    public function create(Request $request)
    {
        $customers = Customer::select('id', 'name')->orderBy('name')->get();
        $selectedCustomerId = $request->customer_id;

        // Pass create permission to frontend
        $permissions = [
            'create_account' => Auth::user()->can('create_account'),
        ];

        return Inertia::render('Admin/Account/Create', [
            'customers' => $customers,
            'selectedCustomerId' => $selectedCustomerId,
            'permissions' => $permissions,
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
            Account::create([
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

    public function show(Request $request, Account $account)
    {
        try {
            $account->load(['customer']);

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

            // Build incomes query with filters
            $incomesQuery = $account->incomes()->with(['approvedBy']);

            if ($request->filled('income_search')) {
                $search = $request->income_search;
                $incomesQuery->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%");
                });
            }

            if ($request->filled('income_status')) {
                $incomesQuery->where('status', $request->income_status);
            }

            if ($request->filled('income_date_from')) {
                $incomesQuery->whereDate('date', '>=', $request->income_date_from);
            }
            if ($request->filled('income_date_to')) {
                $incomesQuery->whereDate('date', '<=', $request->income_date_to);
            }

            $incomes = $incomesQuery->latest('date')->paginate(10, ['*'], 'incomes_page');
            $incomes->appends($request->query());

            // Build outcomes query with filters
            $outcomesQuery = $account->outcomes()->with(['user']);

            if ($request->filled('outcome_search')) {
                $search = $request->outcome_search;
                $outcomesQuery->where(function ($q) use ($search) {
                    $q->where('description', 'like', "%{$search}%")
                        ->orWhere('reference_number', 'like', "%{$search}%");
                });
            }

            if ($request->filled('outcome_status')) {
                $outcomesQuery->where('status', $request->outcome_status);
            }

            if ($request->filled('outcome_date_from')) {
                $outcomesQuery->whereDate('date', '>=', $request->outcome_date_from);
            }
            if ($request->filled('outcome_date_to')) {
                $outcomesQuery->whereDate('date', '<=', $request->outcome_date_to);
            }

            $outcomes = $outcomesQuery->latest('date')->paginate(10, ['*'], 'outcomes_page');
            $outcomes->appends($request->query());

            // Pass all 7 account permissions to frontend for UI control
            $permissions = [
                'view_account' => Auth::user()->can('view_account'),
                'view_any_account' => Auth::user()->can('view_any_account'),
                'create_account' => Auth::user()->can('create_account'),
                'update_account' => Auth::user()->can('update_account'),
                'delete_account' => Auth::user()->can('delete_account'),
                'restore_account' => Auth::user()->can('restore_account'),
                'force_delete_account' => Auth::user()->can('force_delete_account'),
            ];

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
                    'recent_incomes' => $account->incomes()->with('approvedBy')->latest()->take(5)->get(),
                    'recent_outcomes' => $account->outcomes()->with('user')->latest()->take(5)->get(),
                    'created_at' => $account->created_at,
                    'updated_at' => $account->updated_at,
                ],
                'incomes' => [
                    'data' => $incomes->items(),
                    'current_page' => $incomes->currentPage(),
                    'last_page' => $incomes->lastPage(),
                    'per_page' => $incomes->perPage(),
                    'total' => $incomes->total(),
                    'from' => $incomes->firstItem(),
                    'to' => $incomes->lastItem(),
                    'links' => $incomes->toArray()['links'] ?? [],
                ],
                'outcomes' => [
                    'data' => $outcomes->items(),
                    'current_page' => $outcomes->currentPage(),
                    'last_page' => $outcomes->lastPage(),
                    'per_page' => $outcomes->perPage(),
                    'total' => $outcomes->total(),
                    'from' => $outcomes->firstItem(),
                    'to' => $outcomes->lastItem(),
                    'links' => $outcomes->toArray()['links'] ?? [],
                ],
                'filters' => [
                    'income_search' => $request->get('income_search'),
                    'income_status' => $request->get('income_status'),
                    'income_date_from' => $request->get('income_date_from'),
                    'income_date_to' => $request->get('income_date_to'),
                    'outcome_search' => $request->get('outcome_search'),
                    'outcome_status' => $request->get('outcome_status'),
                    'outcome_date_from' => $request->get('outcome_date_from'),
                    'outcome_date_to' => $request->get('outcome_date_to'),
                ],
                'permissions' => $permissions,
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

        // Pass update permission to frontend
        $permissions = [
            'update_account' => Auth::user()->can('update_account'),
        ];

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
            'permissions' => $permissions,
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

    public function restore($id)
    {
        try {
            $account = Account::withTrashed()->findOrFail($id);
            $account->restore();

            return redirect()->route('admin.accounts.index')
                ->with('success', 'Account restored successfully.');
        } catch (\Exception $e) {
            Log::error('Error restoring account: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error restoring account: ' . $e->getMessage());
        }
    }

    public function forceDelete($id)
    {
        try {
            $account = Account::withTrashed()->findOrFail($id);

            // Check if account has any transactions
            if ($account->incomes()->count() > 0 || $account->outcomes()->count() > 0) {
                return redirect()->back()
                    ->with('error', 'Cannot permanently delete account with existing transactions.');
            }

            $account->forceDelete();

            return redirect()->route('admin.accounts.index')
                ->with('success', 'Account permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Error force deleting account: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error force deleting account: ' . $e->getMessage());
        }
    }
}