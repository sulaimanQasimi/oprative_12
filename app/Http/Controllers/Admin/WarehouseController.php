<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, WareHouseUser, Product};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{Auth, Gate, Hash, Log, DB};
use Spatie\Permission\Models\Role;
use App\Http\Controllers\Admin\Warehouse\{OutcomeController, IncomeController, SaleController};

class WarehouseController extends Controller
{
    use IncomeController;
    use OutcomeController;

    use SaleController;
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
        $warehouses = Warehouse::with('users')->latest()->get();

        // Pass permissions to the frontend
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

            // Get batch inventory data from the view for this warehouse
            $batchInventory = DB::table('warehouse_batch_inventory')
                ->where('warehouse_id', $warehouse->id)
                ->get();

            // Group by product and calculate totals
            $products = collect();
            $productGroups = $batchInventory->groupBy('product_id');

            foreach ($productGroups as $productId => $batches) {
                // Get product details from first batch
                $firstBatch = $batches->first();
                
                // Calculate totals across all batches for this product
                $totalIncomeQty = $batches->sum('income_qty');
                $totalOutcomeQty = $batches->sum('outcome_qty');
                $remainingQty = $batches->sum('remaining_qty');
                $totalIncomeValue = $batches->sum('total_income_value');
                $totalOutcomeValue = $batches->sum('total_outcome_value');
                
                // Calculate profit (simplified calculation)
                $profit = $totalOutcomeValue - $totalIncomeValue;

                // Get product details from database
                $product = Product::with(['wholesaleUnit', 'retailUnit'])->find($productId);
                
                if ($product) {
                    $products->push([
                        'id' => $productId,
                        'product_id' => $productId,
                        'product' => [
                            'id' => $product->id,
                            'name' => $product->name,
                            'barcode' => $product->barcode,
                            'type' => $product->type,
                            'purchase_price' => $product->purchase_price,
                            'wholesale_price' => $product->wholesale_price,
                            'retail_price' => $product->retail_price,
                            'wholesaleUnit' => $product->wholesaleUnit ? [
                                'id' => $product->wholesaleUnit->id,
                                'name' => $product->wholesaleUnit->name,
                                'code' => $product->wholesaleUnit->code,
                                'symbol' => $product->wholesaleUnit->symbol,
                            ] : null,
                            'retailUnit' => $product->retailUnit ? [
                                'id' => $product->retailUnit->id,
                                'name' => $product->retailUnit->name,
                                'code' => $product->retailUnit->code,
                                'symbol' => $product->retailUnit->symbol,
                            ] : null,
                            'is_activated' => $product->is_activated,
                            'is_in_stock' => $product->is_in_stock,
                        ],
                        'income_quantity' => $totalIncomeQty,
                        'income_total' => $totalIncomeValue,
                        'outcome_quantity' => $totalOutcomeQty,
                        'outcome_total' => $totalOutcomeValue,
                        'net_quantity' => $remainingQty,
                        'net_total' => $totalIncomeValue, // Using income value as net total
                        'profit' => $profit,
                        'batches' => $batches->map(function ($batch) {
                            return [
                                'batch_id' => $batch->batch_id,
                                'batch_reference' => $batch->batch_reference,
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
                            ];
                        }),
                        'created_at' => $firstBatch->created_at ?? now(),
                        'updated_at' => $firstBatch->updated_at ?? now(),
                    ]);
                }
            }

            return Inertia::render('Admin/Warehouse/Products', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse products: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse products: ' . $e->getMessage());
        }
    }



    public function transfers(Warehouse $warehouse)
    {
        try {
            $warehouse->load([
                'warehouseTransfers.product',
                'warehouseTransfers.fromWarehouse',
                'warehouseTransfers.toWarehouse'
            ]);

            // Get available warehouses (excluding current warehouse)
            $availableWarehouses = Warehouse::where('id', '!=', $warehouse->id)
                ->where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get all products
            $products = Product::select('id', 'name', 'barcode', 'type')->get();

            $transfers = $warehouse->warehouseTransfers->map(function ($transfer) {
                return [
                    'id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                    'product' => [
                        'id' => $transfer->product->id,
                        'name' => $transfer->product->name,
                        'barcode' => $transfer->product->barcode,
                        'type' => $transfer->product->type,
                    ],
                    'from_warehouse' => [
                        'id' => $transfer->fromWarehouse->id,
                        'name' => $transfer->fromWarehouse->name,
                        'code' => $transfer->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transfer->toWarehouse->id,
                        'name' => $transfer->toWarehouse->name,
                        'code' => $transfer->toWarehouse->code,
                    ],
                    'quantity' => $transfer->quantity,
                    'price' => $transfer->price,
                    'total' => $transfer->total,
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                    'created_at' => $transfer->created_at,
                    'updated_at' => $transfer->updated_at,
                ];
            });

            return Inertia::render('Admin/Warehouse/Transfers', [
                'warehouse' => $warehouse,
                'transfers' => $transfers,
                'availableWarehouses' => $availableWarehouses,
                'products' => $products,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse transfers: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading warehouse transfers');
        }
    }

    public function createTransfer(Warehouse $warehouse)
    {
        try {
            // Get available warehouses (excluding current warehouse)
            $availableWarehouses = Warehouse::where('id', '!=', $warehouse->id)
                ->where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get warehouse products with stock quantities
            $warehouseProducts = $warehouse->items()->with('product')->get()->map(function ($item) {
                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'type' => $item->product->type,
                    'stock_quantity' => $item->net_quantity ?? 0, // Available stock in warehouse
                    'purchase_price' => $item->product->purchase_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'retail_price' => $item->product->retail_price,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $item->product->retails_sale_unit_amount,
                    'available_stock' => $item->net_quantity ?? 0,
                    'wholesaleUnit' => $item->product->wholesaleUnit ? [
                        'id' => $item->product->wholesaleUnit->id,
                        'name' => $item->product->wholesaleUnit->name,
                        'code' => $item->product->wholesaleUnit->code,
                        'symbol' => $item->product->wholesaleUnit->symbol,
                    ] : null,
                    'retailUnit' => $item->product->retailUnit ? [
                        'id' => $item->product->retailUnit->id,
                        'name' => $item->product->retailUnit->name,
                        'code' => $item->product->retailUnit->code,
                        'symbol' => $item->product->retailUnit->symbol,
                    ] : null,
                ];
            })->filter(function ($product) {
                return $product['stock_quantity'] > 0; // Only show products with stock
            });

            return Inertia::render('Admin/Warehouse/CreateTransfer', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'warehouses' => $availableWarehouses,
                'warehouseProducts' => $warehouseProducts,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create transfer page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading create transfer page');
        }
    }

    public function storeTransfer(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'to_warehouse_id' => 'required|exists:warehouses,id|different:from_warehouse_id',
                'quantity' => 'required|numeric|min:1',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Check if product exists in warehouse and has sufficient stock
            $warehouseProduct = $warehouse->items()->where('product_id', $validated['product_id'])->first();

            if (!$warehouseProduct) {
                return redirect()->back()
                    ->with('error', 'Product not found in this warehouse')
                    ->withInput();
            }

            $availableStock = $warehouseProduct->net_quantity ?? 0;

            if ($validated['quantity'] > $availableStock) {
                return redirect()->back()
                    ->with('error', "Insufficient stock. Available: {$availableStock} units")
                    ->withInput();
            }

            DB::beginTransaction();

            // Generate reference number
            $referenceNumber = 'TRF-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Calculate total
            $total = $validated['quantity'] * $validated['price'];

            // Create transfer record
            $transfer = \App\Models\WarehouseTransfer::create([
                'reference_number' => $referenceNumber,
                'from_warehouse_id' => $warehouse->id,
                'to_warehouse_id' => $validated['to_warehouse_id'],
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $total,
                'status' => 'completed',
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
                'transfer_date' => now(),
            ]);

            // Create outcome record for source warehouse
            \App\Models\WarehouseOutcome::create([
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'reference_number' => $referenceNumber,
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $total,
                'model_type' => 'transfer',
                'model_id' => $transfer->id,
            ]);

            // Create income record for destination warehouse
            \App\Models\WarehouseIncome::create([
                'warehouse_id' => $validated['to_warehouse_id'],
                'product_id' => $validated['product_id'],
                'reference_number' => $referenceNumber,
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $total,
            ]);

            DB::commit();

            return redirect()->route('admin.warehouses.transfers', $warehouse->id)
                ->with('success', 'Transfer created successfully');
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating warehouse transfer: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error creating transfer: ' . $e->getMessage())
                ->withInput();
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
}
