<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WareHouseUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Models\Product;
use App\Models\WarehouseIncome;
use App\Models\WarehouseProduct;
use App\Models\WarehouseOutcome;
use App\Models\Sale;
use App\Http\Controllers\Admin\Warehouse\IncomeController;
use App\Http\Controllers\Admin\Warehouse\OutcomeController;
use Bavix\Wallet\Models\Transaction;

class WarehouseController extends Controller
{
    use IncomeController;
    use OutcomeController;
    /**
     * Constructor to apply middleware
     */
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
            // Load warehouse with its products and related data
            $warehouse = Warehouse::with([
                'items.product.wholesaleUnit',
                'items.product.retailUnit'
            ])->findOrFail($warehouse->id);

            // Get warehouse products with calculated fields
            $products = $warehouse->items->map(function ($item) {
                return [
                    'id' => $item->id,
                    'product_id' => $item->product_id,
                    'product' => [
                        'id' => $item->product->id,
                        'name' => $item->product->name,
                        'barcode' => $item->product->barcode,
                        'type' => $item->product->type,
                        'purchase_price' => $item->product->purchase_price,
                        'wholesale_price' => $item->product->wholesale_price,
                        'retail_price' => $item->product->retail_price,
                        'wholesale_unit' => $item->product->wholesaleUnit,
                        'retail_unit' => $item->product->retailUnit,
                        'is_activated' => $item->product->is_activated,
                        'is_in_stock' => $item->product->is_in_stock,
                    ],
                    'income_quantity' => $item->income_quantity ?? 0,
                    'income_total' => $item->income_total ?? 0,
                    'outcome_quantity' => $item->outcome_quantity ?? 0,
                    'outcome_total' => $item->outcome_total ?? 0,
                    'net_quantity' => $item->net_quantity ?? 0,
                    'net_total' => $item->net_total ?? 0,
                    'profit' => $item->profit ?? 0,
                    'created_at' => $item->created_at,
                    'updated_at' => $item->updated_at,
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

    public function sales(Warehouse $warehouse)
    {
        try {
            // Load warehouse sales with their relationships
            $sales = Sale::where('warehouse_id', $warehouse->id)
                ->with([
                    'customer:id,name,email,phone',
                    'saleItems.product:id,name,barcode,type',
                    'currency:id,name,code'
                ])
                ->orderBy('created_at', 'desc')
                ->get()
                ->map(function ($sale) {
                    return [
                        'id' => $sale->id,
                        'reference' => $sale->reference,
                        'date' => $sale->date,
                        'status' => $sale->status,
                        'notes' => $sale->notes,
                        'customer' => $sale->customer ? [
                            'id' => $sale->customer->id,
                            'name' => $sale->customer->name,
                            'email' => $sale->customer->email,
                            'phone' => $sale->customer->phone,
                        ] : null,
                        'currency' => $sale->currency ? [
                            'id' => $sale->currency->id,
                            'name' => $sale->currency->name,
                            'code' => $sale->currency->code,
                        ] : null,
                        'sale_items' => $sale->saleItems->map(function ($item) {
                            return [
                                'id' => $item->id,
                                'product_id' => $item->product_id,
                                'product' => $item->product ? [
                                    'id' => $item->product->id,
                                    'name' => $item->product->name,
                                    'barcode' => $item->product->barcode,
                                    'type' => $item->product->type,
                                ] : null,
                                'quantity' => $item->quantity,
                                'unit_price' => $item->unit_price,
                                'total_price' => $item->total_price,
                                'discount_amount' => $item->discount_amount ?? 0,
                                'tax_amount' => $item->tax_amount ?? 0,
                            ];
                        }),
                        'total_amount' => $sale->total_amount ?? $sale->saleItems->sum('total_price'),
                        'tax_amount' => $sale->tax_amount ?? 0,
                        'discount_amount' => $sale->discount_amount ?? 0,
                        'paid_amount' => $sale->paid_amount ?? 0,
                        'due_amount' => $sale->due_amount ?? 0,
                        'confirmed_by_warehouse' => $sale->confirmed_by_warehouse,
                        'confirmed_by_shop' => $sale->confirmed_by_shop,
                        'created_at' => $sale->created_at,
                        'updated_at' => $sale->updated_at,
                    ];
                });

            return Inertia::render('Admin/Warehouse/Sales', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'sales' => $sales,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse sales: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse sales: ' . $e->getMessage());
        }
    }

    public function createSale(Warehouse $warehouse)
    {
        try {
            // Get customers
            $customers = \App\Models\Customer::select('id', 'name', 'email', 'phone')->get();

            // Get warehouse products with stock quantities
            $warehouseProducts = $warehouse->items()->with(['product.wholesaleUnit', 'product.retailUnit'])->get()->map(function ($item) {
                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'type' => $item->product->type,
                    'stock_quantity' => $item->net_quantity ?? 0,
                    'purchase_price' => $item->product->purchase_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'retail_price' => $item->product->retail_price,
                    'wholesale_unit_id' => $item->product->wholesale_unit_id,
                    'retail_unit_id' => $item->product->retail_unit_id,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $item->product->retails_sale_unit_amount,
                    'wholesaleUnit' => $item->product->wholesaleUnit ? [
                        'id' => $item->product->wholesaleUnit->id,
                        'name' => $item->product->wholesaleUnit->name,
                        'code' => $item->product->wholesaleUnit->code,
                    ] : null,
                    'retailUnit' => $item->product->retailUnit ? [
                        'id' => $item->product->retailUnit->id,
                        'name' => $item->product->retailUnit->name,
                        'code' => $item->product->retailUnit->code,
                    ] : null,
                ];
            })->filter(function ($product) {
                return $product['stock_quantity'] > 0;
            });

            return Inertia::render('Admin/Warehouse/CreateSale', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'customers' => $customers,
                'warehouseProducts' => $warehouseProducts,

            ]);
        } catch (\Exception $e) {
            Log::error('Error loading create store movement page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading create store movement page');
        }
    }

    public function storeSale(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'sale_items' => 'required|array|min:1',
                'sale_items.*.product_id' => 'required|exists:products,id',
                'sale_items.*.quantity' => 'required|numeric|min:1',
                'sale_items.*.unit_price' => 'required|numeric|min:0',
                'sale_items.*.total_price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
            ]);

            // Validate stock for all items
            foreach ($validated['sale_items'] as $index => $item) {
                $warehouseProduct = $warehouse->items()->where('product_id', $item['product_id'])->first();

                if (!$warehouseProduct) {
                    return redirect()->back()
                        ->with('error', "Product ID {$item['product_id']} not found in this warehouse")
                        ->withInput()
                        ->withErrors(["sale_items.{$index}.product_id" => 'Product not found in this warehouse']);
                }

                $availableStock = $warehouseProduct->net_quantity ?? 0;

                if ($item['quantity'] > $availableStock) {
                    return redirect()->back()
                        ->with('error', "Insufficient stock for product ID {$item['product_id']}. Available: {$availableStock} units")
                        ->withInput()
                        ->withErrors(["sale_items.{$index}.quantity" => "Quantity cannot exceed available stock of {$availableStock} units"]);
                }

                if ($item['quantity'] <= 0) {
                    return redirect()->back()
                        ->with('error', 'Quantity must be greater than 0')
                        ->withInput()
                        ->withErrors(["sale_items.{$index}.quantity" => 'Quantity must be greater than 0']);
                }
            }

            DB::beginTransaction();

            // Generate reference number
            $referenceNumber = 'SALE-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Calculate total sale amount
            $totalSaleAmount = collect($validated['sale_items'])->sum('total_price');

            // Create Sale record
            $sale = \App\Models\Sale::create([
                'warehouse_id' => $warehouse->id,
                'customer_id' => $validated['customer_id'],
                'currency_id' => 1, // Default currency
                'reference' => $referenceNumber,
                'status' => 'pending',
                'date' => now()->toDateString(),
                'confirmed_by_warehouse' => false,
                'confirmed_by_shop' => false,
                'notes' => $validated['notes'] ?? null,
            ]);

            // Create SaleItem records and tracking records for each item
            foreach ($validated['sale_items'] as $item) {
                // Create SaleItem record
                \App\Models\SaleItem::create([
                    'sale_id' => $sale->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $item['quantity'],
                    'unit_price' => $item['unit_price'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                ]);

                // Create warehouse outcome record for inventory tracking
                \App\Models\WarehouseOutcome::create([
                    'warehouse_id' => $warehouse->id,
                    'product_id' => $item['product_id'],
                    'reference_number' => $referenceNumber,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'model_type' => 'customer_sale',
                    'model_id' => $validated['customer_id'],
                ]);

                // Create customer income record for customer tracking
                \App\Models\CustomerStockIncome::create([
                    'customer_id' => $validated['customer_id'],
                    'product_id' => $item['product_id'],
                    'reference_number' => $referenceNumber,
                    'quantity' => $item['quantity'],
                    'price' => $item['unit_price'],
                    'total' => $item['total_price'],
                    'model_id' => $warehouse->id,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.warehouses.sales', $warehouse->id)
                ->with('success', 'Sale with ' . count($validated['sale_items']) . ' items created successfully');
        } catch (\Illuminate\Validation\ValidationException $e) {
            return redirect()->back()
                ->withErrors($e->errors())
                ->withInput();
        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating sale: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error creating sale: ' . $e->getMessage())
                ->withInput();
        }
    }

    public function showSale(Warehouse $warehouse, $saleId)
    {
        try {
            $sale = \App\Models\Sale::with([
                'customer:id,name,email,phone',
                'currency:id,name,code',
                'saleItems.product:id,name,barcode'
            ])
            ->where('warehouse_id', $warehouse->id)
            ->findOrFail($saleId);

            return Inertia::render('Admin/Warehouse/ShowSale', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'address' => $warehouse->address,
                    'is_active' => $warehouse->is_active,
                ],
                'sale' => $sale,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading sale details: ' . $e->getMessage());
            
            return redirect()->route('admin.warehouses.sales', $warehouse->id)
                ->with('error', 'Sale not found or error loading sale details.');
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
