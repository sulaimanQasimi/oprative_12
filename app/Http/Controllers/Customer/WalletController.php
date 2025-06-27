<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use App\Repositories\Customer\CustomerRepository;
use Carbon\Carbon;

class WalletController extends Controller
{

    public function __construct()
    {
        $this->middleware('permission:customer.view_wallet')->only(['wallet']);
        $this->middleware('permission:customer.withdraw_wallet')->only(['withdrawForm', 'withdraw']);
        $this->middleware('permission:customer.deposit_wallet')->only(['depositForm', 'deposit']);
    }

    public function wallet(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;

        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $wallet = $customer->wallet;
        if (!$wallet) {
            $wallet = $customer->createWallet([
                'name' => $customer->name . ' Wallet',
                'slug' => 'customer-' . $customer->id,
            ]);
        }

        // Pagination and filtering parameters
        $perPage = $request->get('per_page', 15);
        $search = $request->get('search', '');
        $type = $request->get('type', ''); // 'deposit', 'withdraw', or ''
        $dateFrom = $request->get('date_from', '');
        $dateTo = $request->get('date_to', '');
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');

        // Build transactions query with filters
        $transactionsQuery = $wallet->transactions()
            ->select([
                'id',
                'type',
                'amount',
                'meta',
                'created_at',
                'updated_at'
            ])
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('meta->description', 'like', "%{$search}%")
                        ->orWhere('amount', 'like', "%{$search}%")
                        ->orWhere('id', 'like', "%{$search}%");
                });
            })
            ->when($type, function ($query) use ($type) {
                return $query->where('type', $type);
            })
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy($sortBy, $sortOrder);

        // Get paginated transactions
        $transactions = $transactionsQuery->paginate($perPage);

        // Transform transactions for frontend
        $transactions->getCollection()->transform(function ($transaction) {
            return [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'description' => $transaction->meta['description'] ?? 'No description',
                'created_by' => $transaction->meta['created_by'] ?? null,
                'customer_id' => $transaction->meta['customer_id'] ?? null,
                'created_at' => $transaction->created_at->toISOString(),
                'formatted_date' => $transaction->created_at->format('M d, Y'),
                'formatted_time' => $transaction->created_at->format('h:i A'),
                'formatted_datetime' => $transaction->created_at->format('M d, Y \a\t h:i A'),
                'meta' => $transaction->meta,
            ];
        });

        // Calculate statistics
        $totalDeposits = $wallet->transactions()->where('type', 'deposit')->sum('amount');
        $totalWithdrawals = $wallet->transactions()->where('type', 'withdraw')->sum('amount');
        $currentBalance = $wallet->balance;

        // Monthly statistics
        $thisMonth = Carbon::now()->startOfMonth();
        $lastMonth = Carbon::now()->subMonth()->startOfMonth();

        $thisMonthDeposits = $wallet->transactions()
            ->where('type', 'deposit')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount');

        $thisMonthWithdrawals = $wallet->transactions()
            ->where('type', 'withdraw')
            ->where('created_at', '>=', $thisMonth)
            ->sum('amount');

        $lastMonthDeposits = $wallet->transactions()
            ->where('type', 'deposit')
            ->whereBetween('created_at', [$lastMonth, $thisMonth])
            ->sum('amount');

        // Transaction count by type
        $transactionCounts = $wallet->transactions()
            ->select('type', DB::raw('count(*) as count'))
            ->groupBy('type')
            ->pluck('count', 'type');

        // Recent activity (last 7 days)
        $recentActivity = $wallet->transactions()
            ->where('created_at', '>=', Carbon::now()->subDays(7))
            ->select('type', DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
            ->groupBy('type', 'date')
            ->orderBy('date')
            ->get();

        return Inertia::render('Customer/Wallet', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
                'permissions' => [
                    'view_wallet' => Auth::guard('customer_user')->user()->can('customer.view_wallet'),
                    'withdraw_wallet' => Auth::guard('customer_user')->user()->can('customer.withdraw_wallet'),
                    'deposit_wallet' => Auth::guard('customer_user')->user()->can('customer.deposit_wallet'),
                ]
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
                'this_month_deposits' => $thisMonthDeposits,
                'this_month_withdrawals' => $thisMonthWithdrawals,
                'last_month_deposits' => $lastMonthDeposits,
                'transaction_counts' => $transactionCounts,
                'recent_activity' => $recentActivity,
            ],
            'filters' => [
                'search' => $search,
                'type' => $type,
                'date_from' => $dateFrom,
                'date_to' => $dateTo,
                'sort_by' => $sortBy,
                'sort_order' => $sortOrder,
                'per_page' => $perPage,
            ],
        ]);
    }

    public function depositForm(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $wallet = $customer->wallet;

        // Get recent deposits for reference
        $recentDeposits = $wallet->transactions()
            ->where('type', 'deposit')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'amount' => $transaction->amount,
                    'description' => $transaction->meta['description'] ?? 'No description',
                    'created_at' => $transaction->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Customer/WalletDeposit', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $wallet->balance,
            ],
            'recent_deposits' => $recentDeposits,
        ]);
    }

    public function deposit(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:999999999.99',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $wallet = $customer->wallet;

            $wallet->deposit($validated['amount'], [
                'description' => $validated['description'] ?? 'Manual deposit',
                'created_by' => Auth::guard('customer_user')->id(),
                'customer_id' => $customer->id,
                'user_name' => Auth::guard('customer_user')->user()->name,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Log the activity
            Log::info('Customer wallet deposit completed', [
                'customer_id' => $customer->id,
                'wallet_id' => $wallet->id,
                'amount' => $validated['amount'],
                'user_id' => Auth::guard('customer_user')->id(),
                'description' => $validated['description'],
            ]);

            DB::commit();

            return redirect()->route('customer.wallet')
                ->with('success', 'Deposit of ' . number_format($validated['amount'], 2) . ' AFN completed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Customer wallet deposit failed', [
                'customer_id' => $customer->id,
                'amount' => $validated['amount'],
                'user_id' => Auth::guard('customer_user')->id(),
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()
                ->withErrors(['amount' => 'Deposit failed. Please try again.'])
                ->withInput();
        }
    }

    public function withdrawForm(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $wallet = $customer->wallet;

        // Get recent withdrawals for reference
        $recentWithdrawals = $wallet->transactions()
            ->where('type', 'withdraw')
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get()
            ->map(function ($transaction) {
                return [
                    'amount' => $transaction->amount,
                    'description' => $transaction->meta['description'] ?? 'No description',
                    'created_at' => $transaction->created_at->format('M d, Y'),
                ];
            });

        return Inertia::render('Customer/WalletWithdraw', [
            'customer' => [
                'id' => $customer->id,
                'name' => $customer->name,
                'email' => $customer->email,
            ],
            'wallet' => [
                'id' => $wallet->id,
                'name' => $wallet->name,
                'balance' => $wallet->balance,
            ],
            'recent_withdrawals' => $recentWithdrawals,
        ]);
    }

    public function withdraw(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01|max:999999999.99',
            'description' => 'nullable|string|max:1000',
        ]);

        try {
            DB::beginTransaction();

            $wallet = $customer->wallet;

            if ($wallet->balance < $validated['amount']) {
                return redirect()->back()->withErrors([
                    'amount' => 'Insufficient balance. Available: ' . number_format($wallet->balance, 2) . ' AFN'
                ])->withInput();
            }

            $wallet->withdraw($validated['amount'], [
                'description' => $validated['description'] ?? 'Manual withdrawal',
                'created_by' => Auth::guard('customer_user')->id(),
                'customer_id' => $customer->id,
                'user_name' => Auth::guard('customer_user')->user()->name,
                'ip_address' => $request->ip(),
                'user_agent' => $request->userAgent(),
            ]);

            // Log the activity
            Log::info('Customer wallet withdrawal completed', [
                'customer_id' => $customer->id,
                'wallet_id' => $wallet->id,
                'amount' => $validated['amount'],
                'user_id' => Auth::guard('customer_user')->id(),
                'description' => $validated['description'],
            ]);

            DB::commit();

            return redirect()->route('customer.wallet')
                ->with('success', 'Withdrawal of ' . number_format($validated['amount'], 2) . ' AFN completed successfully.');
        } catch (\Exception $e) {
            DB::rollBack();

            Log::error('Customer wallet withdrawal failed', [
                'customer_id' => $customer->id,
                'amount' => $validated['amount'],
                'user_id' => Auth::guard('customer_user')->id(),
                'error' => $e->getMessage(),
            ]);

            return redirect()->back()
                ->withErrors(['amount' => 'Withdrawal failed. Please try again.'])
                ->withInput();
        }
    }

    /**
     * Export transactions to CSV
     */
    public function exportTransactions(Request $request)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return redirect()->route('customer.dashboard')->with('error', 'No customer account found.');
        }

        $wallet = $customer->wallet;

        // Get all transactions with filters
        $search = $request->get('search', '');
        $type = $request->get('type', '');
        $dateFrom = $request->get('date_from', '');
        $dateTo = $request->get('date_to', '');

        $transactions = $wallet->transactions()
            ->when($search, function ($query) use ($search) {
                return $query->where(function ($q) use ($search) {
                    $q->where('meta->description', 'like', "%{$search}%")
                        ->orWhere('amount', 'like', "%{$search}%");
                });
            })
            ->when($type, function ($query) use ($type) {
                return $query->where('type', $type);
            })
            ->when($dateFrom, function ($query) use ($dateFrom) {
                return $query->whereDate('created_at', '>=', $dateFrom);
            })
            ->when($dateTo, function ($query) use ($dateTo) {
                return $query->whereDate('created_at', '<=', $dateTo);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        $filename = 'customer_wallet_transactions_' . $customer->id . '_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($transactions) {
            $file = fopen('php://output', 'w');

            // CSV Headers
            fputcsv($file, [
                'Transaction ID',
                'Type',
                'Amount (AFN)',
                'Description',
                'Created By',
                'Date',
                'Time'
            ]);

            // CSV Data
            foreach ($transactions as $transaction) {
                fputcsv($file, [
                    $transaction->id,
                    ucfirst($transaction->type),
                    number_format($transaction->amount, 2),
                    $transaction->meta['description'] ?? 'No description',
                    $transaction->meta['user_name'] ?? 'Unknown',
                    $transaction->created_at->format('Y-m-d'),
                    $transaction->created_at->format('H:i:s'),
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    /**
     * Get transaction details
     */
    public function getTransaction(Request $request, $transactionId)
    {
        $customerUser = Auth::guard('customer_user')->user();
        $customer = $customerUser->customer ?? null;
        
        if (!$customer) {
            return response()->json(['error' => 'No customer account found'], 403);
        }

        $wallet = $customer->wallet;
        $transaction = $wallet->transactions()->find($transactionId);

        if (!$transaction) {
            return response()->json(['error' => 'Transaction not found'], 404);
        }

        return response()->json([
            'transaction' => [
                'id' => $transaction->id,
                'type' => $transaction->type,
                'amount' => $transaction->amount,
                'description' => $transaction->meta['description'] ?? 'No description',
                'created_by' => $transaction->meta['created_by'] ?? null,
                'user_name' => $transaction->meta['user_name'] ?? 'Unknown',
                'customer_id' => $transaction->meta['customer_id'] ?? null,
                'ip_address' => $transaction->meta['ip_address'] ?? null,
                'user_agent' => $transaction->meta['user_agent'] ?? null,
                'created_at' => $transaction->created_at->toISOString(),
                'formatted_datetime' => $transaction->created_at->format('M d, Y \a\t h:i A'),
                'meta' => $transaction->meta,
            ]
        ]);
    }
} 