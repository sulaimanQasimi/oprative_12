<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Warehouse;
use App\Models\WareHouseUser;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Spatie\Permission\Models\Role;
use Illuminate\Support\Facades\DB;
use App\Models\Product;

class WarehouseController extends Controller
{
    public function index()
    {
        $warehouses = Warehouse::with('users')->latest()->get();
        return Inertia::render('Admin/Warehouse/Index', [
            'warehouses' => $warehouses,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Warehouse/Create', [
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
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

        return Inertia::render('Admin/Warehouse/Edit', [
            'warehouse' => $warehouse,
            'roles' => $roles,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
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

            return Inertia::render('Admin/Warehouse/Show', [
                'warehouse' => $warehouse,
                'roles' => $roles,
                'permissions' => $permissions,
                'auth' => [
                    'user' => Auth::guard('web')->user()
                ]
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
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse products: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse products: ' . $e->getMessage());
        }
    }

    public function income(Warehouse $warehouse)
    {
        try {
            // Load warehouse with income records and related data
            $warehouse = Warehouse::with([
                'warehouseIncome.product',
                'warehouseIncome.purchase'
            ])->findOrFail($warehouse->id);

            // Get warehouse income records
            $incomes = $warehouse->warehouseIncome->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference_number' => $income->reference_number,
                    'product' => [
                        'id' => $income->product->id,
                        'name' => $income->product->name,
                        'barcode' => $income->product->barcode,
                        'type' => $income->product->type,
                    ],
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'purchase_id' => $income->purchase_id,
                    'purchase' => $income->purchase ? [
                        'id' => $income->purchase->id,
                        'reference_number' => $income->purchase->reference_number,
                    ] : null,
                    'date' => $income->date,
                    'notes' => $income->notes,
                    'status' => $income->status,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ];
            });

            return Inertia::render('Admin/Warehouse/Income', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'incomes' => $incomes,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse income: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse income: ' . $e->getMessage());
        }
    }

    public function outcome(Warehouse $warehouse)
    {
        try {
            // Load warehouse with outcome records and related data
            $warehouse = Warehouse::with([
                'warehouseOutcome.product'
            ])->findOrFail($warehouse->id);

            // Get warehouse outcome records
            $outcomes = $warehouse->warehouseOutcome->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'model_type' => $outcome->model_type,
                    'model_id' => $outcome->model_id,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
                ];
            });

            return Inertia::render('Admin/Warehouse/Outcome', [
                'warehouse' => [
                    'id' => $warehouse->id,
                    'name' => $warehouse->name,
                    'code' => $warehouse->code,
                    'description' => $warehouse->description,
                    'is_active' => $warehouse->is_active,
                ],
                'outcomes' => $outcomes,
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse outcome: ' . $e->getMessage());
            return redirect()->route('admin.warehouses.show', $warehouse->id)
                ->with('error', 'Error loading warehouse outcome: ' . $e->getMessage());
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
                'auth' => [
                    'user' => Auth::user()
                ]
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
                'auth' => [
                    'user' => Auth::user()
                ]
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
                'total' => $total, ]);

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
            // Load warehouse with sales records (customer incomes)
            $warehouse->load(['warehouseOutcome.product']);

            // Filter only sales-related outcomes (to customers)
            $sales = $warehouse->warehouseOutcome->filter(function ($outcome) {
                return $outcome->model_type === 'sale' || $outcome->model_type === 'customer_sale';
            })->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'customer_id' => $outcome->model_id,
                    'sale_date' => $outcome->created_at,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
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
                'sales' => $sales->values(),
                'auth' => [
                    'user' => Auth::user()
                ]
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
            $warehouseProducts = $warehouse->items()->with('product')->get()->map(function ($item) {
                return [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'type' => $item->product->type,
                    'stock_quantity' => $item->net_quantity ?? 0,
                    'purchase_price' => $item->product->purchase_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'retail_price' => $item->product->retail_price,
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
                'auth' => [
                    'user' => Auth::user()
                ]
            ]);

        } catch (\Exception $e) {
            Log::error('Error loading create sale page: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading create sale page');
        }
    }

    public function storeSale(Request $request, Warehouse $warehouse)
    {
        try {
            $validated = $request->validate([
                'customer_id' => 'required|exists:customers,id',
                'product_id' => 'required|exists:products,id',
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
            $referenceNumber = 'SALE-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Calculate total
            $total = $validated['quantity'] * $validated['price'];

            // Create warehouse outcome record
            \App\Models\WarehouseOutcome::create([
                'warehouse_id' => $warehouse->id,
                'product_id' => $validated['product_id'],
                'reference_number' => $referenceNumber,
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $total,
                'model_type' => 'customer_sale',
                'model_id' => $validated['customer_id'],
            ]);

            // Create customer income record
            \App\Models\CustomerIncome::create([
                'customer_id' => $validated['customer_id'],
                'product_id' => $validated['product_id'],
                'reference_number' => $referenceNumber,
                'quantity' => $validated['quantity'],
                'price' => $validated['price'],
                'total' => $total,
                'warehouse_id' => $warehouse->id,
                'sale_date' => now(),
                'notes' => $validated['notes'],
                'created_by' => Auth::id(),
            ]);

            DB::commit();

            return redirect()->route('admin.warehouses.sales', $warehouse->id)
                ->with('success', 'Sale created successfully');

        } catch (\Exception $e) {
            DB::rollback();
            Log::error('Error creating warehouse sale: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error creating sale: ' . $e->getMessage())
                ->withInput();
        }
    }
}

