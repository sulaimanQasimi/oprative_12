<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, WareHouseUser, Product};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth, Gate, Hash, Log, DB};
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Admin\Warehouse\{OutcomeController, IncomeController, SaleController, TransferController};

class WarehouseController extends Controller
{
    use IncomeController;
    use OutcomeController;
    use SaleController;
    use TransferController;

    public function __construct()
    {
        $this->middleware('permission:view_any_warehouse')->only(['index']);
        $this->middleware('permission:view_warehouse')->only(['show']);
        $this->middleware('permission:create_warehouse')->only(['create', 'store']);
        $this->middleware('permission:update_warehouse')->only(['edit', 'update']);
        $this->middleware('permission:delete_warehouse')->only(['destroy']);
        $this->middleware('permission:restore_warehouse')->only(['restore']);
        $this->middleware('permission:force_delete_warehouse')->only(['forceDelete']);
    }

    public function index()
    {
        $warehouses = Warehouse::withCount(['users', 'items'])->latest()->get()->toArray();
        $permissions = [
            'can_create' => Gate::allows('create_warehouse'),
            'can_update' => Gate::allows('update_warehouse', Warehouse::class),
            'can_delete' => Gate::allows('delete_warehouse', Warehouse::class),
            'can_view' => Gate::allows('view_warehouse', Warehouse::class),
            'can_restore' => Gate::allows('restore_warehouse', Warehouse::class),
            'can_force_delete' => Gate::allows('force_delete_warehouse', Warehouse::class),
        ];

        return Inertia::render('Admin/Warehouse/Index', [
            'warehouses' => $warehouses,
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        $permissions = [
            'can_create' => Gate::allows('create_warehouse'),
        ];

        return Inertia::render('Admin/Warehouse/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses',
            'description' => 'nullable|string',
            'address' => 'nullable|string',
            'is_active' => 'boolean',
        ]);

        $warehouse = Warehouse::create([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'address' => $validated['address'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        // Create warehouse users

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse created successfully.');
    }

    public function edit(Warehouse $warehouse)
    {
        $warehouse->load('users.roles');
        $roles = Role::where('guard_name', 'warehouse_user')->get();

        $permissions = [
            'can_update' => Gate::allows('update_warehouse', $warehouse),
        ];

        return Inertia::render('Admin/Warehouse/Edit', [
            'warehouse' => $warehouse,
            'roles' => $roles,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Warehouse $warehouse)
    {
        // First validate the basic warehouse fields
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:50|unique:warehouses,code,' . $warehouse->id,
            'description' => 'nullable|string',
            'location' => 'nullable|string',
            'capacity' => 'nullable|integer|min:0',
            'is_active' => 'boolean',
        ]);


        $warehouse->update([
            'name' => $validated['name'],
            'code' => $validated['code'],
            'description' => $validated['description'] ?? null,
            'location' => $validated['location'] ?? null,
            'capacity' => $validated['capacity'] ?? null,
            'is_active' => $validated['is_active'] ?? true,
        ]);

        return redirect()->route('admin.warehouses.show', $warehouse->id)
            ->with('success', 'Warehouse updated successfully.');
    }

    public function destroy(Warehouse $warehouse)
    {
        // Delete associated users first
        $warehouse->users()->delete();

        $warehouse->delete();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse deleted successfully.');
    }

    /**
     * Restore the specified warehouse from trash
     *
     * @param Warehouse $warehouse
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore(Warehouse $warehouse)
    {
        $warehouse->restore();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse restored successfully.');
    }

    /**
     * Permanently delete the specified warehouse
     *
     * @param Warehouse $warehouse
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete(Warehouse $warehouse)
    {
        // Permanently delete associated users first
        $warehouse->users()->forceDelete();

        $warehouse->forceDelete();

        return redirect()->route('admin.warehouses.index')
            ->with('success', 'Warehouse permanently deleted.');
    }

    public function show(Warehouse $warehouse)
    {
        try {
            // Make sure to load the users relationship
            $warehouse = Warehouse::with(['users.roles.permissions'])->findOrFail($warehouse->id);

            // Check if users are loaded
            if ($warehouse->users === null) {
                Log::error('Users relationship not loaded for warehouse: ' . $warehouse->id);
            }

            $roles = Role::where('guard_name', 'warehouse_user')->with('permissions')->get();
            $permissions = \Spatie\Permission\Models\Permission::where('guard_name', 'warehouse_user')->get();

            // Pass permissions to the frontend
            $warehousePermissions = [
                'can_view' => Gate::allows('view_warehouse', $warehouse),
                'can_update' => Gate::allows('update_warehouse', $warehouse),
                'can_delete' => Gate::allows('delete_warehouse', $warehouse),
                'can_restore' => Gate::allows('restore_warehouse', $warehouse),
                'can_force_delete' => Gate::allows('force_delete_warehouse', $warehouse),
            ];

            return Inertia::render('Admin/Warehouse/Show', [
                'warehouse' => $warehouse,
                'roles' => $roles,
                'permissions' => $permissions,
                'warehousePermissions' => $warehousePermissions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.index')
                ->with('error', 'Error loading warehouse: ' . $e->getMessage());
        }
    }

    public function addUser(Request $request, Warehouse $warehouse)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:ware_house_users,email',
            'password' => 'required|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);

        try {
            // Create the user
            $user = WareHouseUser::create([
                'warehouse_id' => $warehouse->id,
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);

            // Assign role
            $role = Role::findByName($validated['role'], 'warehouse_user');
            $user->assignRole($role);

            // Assign additional permissions if any
            if (!empty($validated['permissions'])) {
                $user->givePermissionTo($validated['permissions']);
            }

            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('success', 'User added successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error adding user: ' . $e->getMessage());
        }
    }

    public function updateUser(Request $request, Warehouse $warehouse, WareHouseUser $user)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:ware_house_users,email,' . $user->id,
            'password' => 'nullable|string|min:8',
            'role' => 'required|string|exists:roles,name',
            'permissions' => 'nullable|array',
        ]);

        try {
            // Update user details
            $user->update([
                'name' => $validated['name'],
                'email' => $validated['email'],
            ]);

            // Update password if provided
            if (!empty($validated['password'])) {
                $user->update(['password' => Hash::make($validated['password'])]);
            }

            // Update role
            $role = Role::findByName($validated['role'], 'warehouse_user');
            $user->syncRoles([$role]);

            // Update permissions
            if (isset($validated['permissions'])) {
                $user->syncPermissions($validated['permissions']);
            }

            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('success', 'User updated successfully.');
        } catch (\Exception $e) {
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error updating user: ' . $e->getMessage());
        }
    }

    public function products(Warehouse $warehouse)
    {
        try {
            // Get warehouse basic info
            $warehouse = Warehouse::findOrFail($warehouse->id);

            // Get batch inventory data directly from the view without grouping
            $batchInventory = $warehouse->items()
                ->with(['batch', 'product'])
                ->orderBy('expire_date', 'asc')
                ->orderBy('batch_id', 'desc')
                ->where('remaining_qty', '>', 0)
                ->get()
                ->map(function ($batch) {
                    return [
                        'batch_id' => $batch->batch->id,
                        'batch_reference' => $batch->batch->reference_number,
                        'product_id' => $batch->product->id,
                        'product' => [
                            'id' => $batch->product->id ?? $batch->product_id,
                            'name' => $batch->product->name ?? $batch->product_name,
                            'barcode' => $batch->product->barcode ?? $batch->product_barcode,
                            'type' => $batch->product->type ?? 'Unknown',
                            'is_activated' => $batch->product->is_activated ?? true,
                            'is_in_stock' => $batch->product->is_in_stock ?? true,
                        ],
                        'warehouse_id' => $batch->warehouse_id,
                        'warehouse_name' => $batch->warehouse_name,
                        'issue_date' => $batch->issue_date,
                        'expire_date' => $batch->expire_date,
                        'batch_notes' => $batch->batch_notes,
                        'income_qty' => $batch->income_qty,
                        'outcome_qty' => $batch->outcome_qty,
                        'remaining_qty' => $batch->remaining_qty,
                        'total_income_value' => $batch->total_income_value,
                        'total_outcome_value' => $batch->total_outcome_value,
                        'expiry_status' => $batch->expiry_status,
                        'days_to_expiry' => $batch->days_to_expiry,
                        // Unit information from batch
                        'unit_type' => $batch->unit_type,
                        'unit_id' => $batch->unit_id,
                        'unit_amount' => $batch->unit_amount,
                        'unit_name' => $batch->unit_name,
                        // Calculate average price per unit
                        'avg_price_per_unit' => $batch->income_qty > 0 ? $batch->total_income_value / $batch->income_qty : 0,
                        // Calculate profit for this batch
                        'profit' => $batch->total_outcome_value - $batch->total_income_value,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                });

            return Inertia::render('Admin/Warehouse/Products', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'products' => $batchInventory,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse products: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse products: ' . $e->getMessage());
        }
    }

    // Wallet functionality methods
    public function wallet(Warehouse $warehouse)
    {
        try {
            // Get wallet balance and transactions using direct approach
            $wallet = $warehouse->wallet;
            // Get recent transactions with error handling
            $transactions = collect();
            try {
                $transactions = $wallet->transactions()
                    ->orderBy('created_at', 'desc')
                    ->limit(20)
                    ->get()
                    ->map(function ($transaction) {
                        return [
                            'id' => $transaction->id,
                            'uuid' => $transaction->uuid,
                            'type' => $transaction->type, // 'deposit' or 'withdraw'
                            'amount' => $transaction->amount,
                            'amount_formatted' => number_format($transaction->amount, 2),
                            'balance' => $transaction->balance,
                            'balance_formatted' => number_format($transaction->balance, 2),
                            'description' => $transaction->description,
                            'meta' => $transaction->meta,
                            'created_at' => $transaction->created_at,
                            'updated_at' => $transaction->updated_at,
                        ];
                    });
            } catch (\Exception $e) {
                Log::warning('Error loading transactions: ' . $e->getMessage());
                $transactions = collect();
            }

            // Get transaction statistics using the correct methods with error handling
            $totalDeposits = 0;
            $totalWithdrawals = 0;
            try {
                $totalDeposits = $wallet->transactions()
                    ->where('type', 'deposit')
                    ->sum('amount');
                $totalWithdrawals = $wallet->transactions()
                    ->where('type', 'withdraw')
                    ->sum('amount');
            } catch (\Exception $e) {
                Log::warning('Error calculating transaction statistics: ' . $e->getMessage());
            }

            $currentBalance = $wallet->balance;

            return Inertia::render('Admin/Warehouse/Wallet', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'wallet' => [
                    'id' => $wallet->id,
                    'name' => $wallet->name,
                    'slug' => $wallet->slug,
                    'balance' => $currentBalance,
                    'balance_formatted' => number_format($currentBalance, 2),
                ],
                'transactions' => $transactions,
                'statistics' => [
                    'total_deposits' => $totalDeposits,
                    'total_deposits_formatted' => number_format($totalDeposits, 2),
                    'total_withdrawals' => $totalWithdrawals,
                    'total_withdrawals_formatted' => number_format($totalWithdrawals, 2),
                    'current_balance' => $currentBalance,
                    'current_balance_formatted' => number_format($currentBalance, 2),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse wallet: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse wallet: ' . $e->getMessage());
        }
    }

    public function charts(Warehouse $warehouse)
    {
        try {
            // Get warehouse basic info
            $warehouse = Warehouse::findOrFail($warehouse->id);

            // Get batch inventory data for charts
            $batchInventory = DB::table('warehouse_batch_inventory')
                ->where('warehouse_id', $warehouse->id)
                ->where('remaining_qty', '>', 0)
                ->get();

            // Prepare chart data
            $chartData = [
                // Product distribution by remaining quantity
                'product_distribution' => $batchInventory
                    ->groupBy('product_name')
                    ->map(function ($products, $productName) {
                        $totalRemaining = $products->sum(function ($product) {
                            return $product->remaining_qty / ($product->unit_amount ?: 1);
                        });
                        $unitName = $products->first()->unit_name ?: 'Units';

                        return [
                            'product' => $productName,
                            'total_remaining' => round($totalRemaining, 2),
                            'total_remaining_formatted' => round($totalRemaining, 2) . ' ' . $unitName,
                            'total_value' => $products->sum('total_income_value'),
                            'unit_name' => $unitName,
                        ];
                    })
                    ->sortByDesc('total_remaining')
                    ->take(10)
                    ->values(),

                // Expiry status distribution
                'expiry_status' => $batchInventory
                    ->groupBy('expiry_status')
                    ->map(function ($items, $status) {
                        $totalQuantity = $items->sum(function ($item) {
                            return $item->remaining_qty / ($item->unit_amount ?: 1);
                        });

                        return [
                            'status' => $status,
                            'count' => $items->count(),
                            'total_quantity' => round($totalQuantity, 2),
                            'total_value' => $items->sum('total_income_value'),
                        ];
                    })
                    ->values(),

                // Monthly income vs outcome
                'monthly_comparison' => $batchInventory
                    ->groupBy(function ($item) {
                        return \Carbon\Carbon::parse($item->issue_date)->format('Y-m');
                    })
                    ->map(function ($items, $month) {
                        $incomeQuantity = $items->sum(function ($item) {
                            return $item->income_qty / ($item->unit_amount ?: 1);
                        });
                        $outcomeQuantity = $items->sum(function ($item) {
                            return $item->outcome_qty / ($item->unit_amount ?: 1);
                        });

                        return [
                            'month' => $month,
                            'income_quantity' => round($incomeQuantity, 2),
                            'outcome_quantity' => round($outcomeQuantity, 2),
                            'income_value' => $items->sum('total_income_value'),
                            'outcome_value' => $items->sum('total_outcome_value'),
                        ];
                    })
                    ->sortBy('month')
                    ->values(),

                // Top products by value
                'top_products_by_value' => $batchInventory
                    ->groupBy('product_name')
                    ->map(function ($products, $productName) {
                        return [
                            'product' => $productName,
                            'total_value' => $products->sum('total_income_value'),
                            'remaining_value' => $products->sum('total_income_value') - $products->sum('total_outcome_value'),
                            'profit' => $products->sum('total_outcome_value') - $products->sum('total_income_value'),
                        ];
                    })
                    ->sortByDesc('total_value')
                    ->take(10)
                    ->values(),

                // Unit type distribution
                'unit_distribution' => $batchInventory
                    ->groupBy('unit_name')
                    ->map(function ($items, $unitName) {
                        $totalQuantity = $items->sum(function ($item) {
                            return $item->remaining_qty / ($item->unit_amount ?: 1);
                        });

                        return [
                            'unit' => $unitName ?: 'Unknown',
                            'count' => $items->count(),
                            'total_quantity' => round($totalQuantity, 2),
                        ];
                    })
                    ->sortByDesc('total_quantity')
                    ->values(),

                // All batches with detailed information
                'all_batches' => $batchInventory->map(function ($item) {
                    return [
                        'batch_id' => $item->batch_id,
                        'product_id' => $item->product_id,
                        'product_name' => $item->product_name,
                        'product_barcode' => $item->product_barcode,
                        'batch_reference' => $item->batch_reference,
                        'issue_date' => $item->issue_date,
                        'expire_date' => $item->expire_date,
                        'batch_notes' => $item->batch_notes,
                        'remaining_qty' => $item->remaining_qty,
                        'remaining_qty_converted' => round($item->remaining_qty / ($item->unit_amount ?: 1), 2),
                        'total_income_value' => $item->total_income_value,
                        'total_outcome_value' => $item->total_outcome_value,
                        'unit_type' => $item->unit_type,
                        'unit_id' => $item->unit_id,
                        'unit_amount' => $item->unit_amount,
                        'unit_name' => $item->unit_name ?: 'Units',
                        'expiry_status' => $item->expiry_status,
                        'days_to_expiry' => $item->days_to_expiry,
                    ];
                })->sortBy('expire_date')->values(),

                // Summary statistics
                'summary' => [
                    'total_products' => $batchInventory->unique('product_id')->count(),
                    'total_batches' => $batchInventory->count(),
                    'total_remaining_quantity' => round($batchInventory->sum(function ($item) {
                        return $item->remaining_qty / ($item->unit_amount ?: 1);
                    }), 2),
                    'total_inventory_value' => $batchInventory->sum('total_income_value'),
                    'expired_items' => $batchInventory->where('expiry_status', 'expired')->count(),
                    'expiring_soon_items' => $batchInventory->where('expiry_status', 'expiring_soon')->count(),
                    'valid_items' => $batchInventory->where('expiry_status', 'valid')->count(),
                ],
            ];

            return Inertia::render('Admin/Warehouse/Charts', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'chartData' => $chartData,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse charts: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse charts: ' . $e->getMessage());
        }
    }
}
