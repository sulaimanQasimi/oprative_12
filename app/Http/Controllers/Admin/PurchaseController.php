<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use App\Models\PurchaseHasAddionalCosts;
use App\Models\PurchasePayment;
use App\Models\Supplier;
use App\Models\Currency;
use App\Models\Product;
use App\Models\Batch;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class PurchaseController extends Controller
{
    /**
     * Display a listing of purchases.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Purchase::class);

        $query = Purchase::with(['supplier', 'currency', 'user', 'purchaseItems']);

        // Search functionality
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('invoice_number', 'like', "%{$search}%")
                    ->orWhereHas('supplier', function ($supplierQuery) use ($search) {
                        $supplierQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Status filter
        if ($request->filled('status') && $request->status !== 'all') {
            $query->where('status', $request->status);
        }

        // Supplier filter
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        // Sorting
        $sortField = $request->input('sort_field', 'invoice_date');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $purchases = $query->paginate($perPage);
        $purchases->appends($request->query());

        // Get filter options
        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();

        // Calculate summary statistics
        $totalPurchases = Purchase::count();
        // Calculate total amount using relationships since total_amount column doesn't exist
        $totalAmount = Purchase::with(['purchaseItems', 'additional_costs'])->get()->sum(function ($purchase) {
            return $purchase->purchaseItems->sum('total_price') + $purchase->additional_costs->sum('amount');
        });
        $suppliersCount = Supplier::count();

        // Get permissions
        $permissions = [
            'can_view' => Auth::user()->can('view_purchase'),
            'can_create' => Auth::user()->can('create_purchase'),
            'can_update' => Auth::user()->can('update_purchase'),
            'can_delete' => Auth::user()->can('delete_purchase'),
            'can_export' => Auth::user()->can('view_purchase'),
        ];

        return Inertia::render('Admin/Purchase/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'supplier_id', 'sort_field', 'sort_direction', 'per_page']),
            'stats' => [
                'total_purchases' => $totalPurchases,
                'total_amount' => $totalAmount,
                'suppliers_count' => $suppliersCount,
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new purchase.
     */
    public function create()
    {
        $this->authorize('create', Purchase::class);

        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();
        $currencies = Currency::select('id', 'name', 'code')->orderBy('name')->get();

        // Generate invoice number
        $lastPurchase = Purchase::latest()->first();
        $invoiceNumber = 'PUR-' . date('Y') . '-' . str_pad(($lastPurchase ? $lastPurchase->id + 1 : 1), 6, '0', STR_PAD_LEFT);

        return Inertia::render('Admin/Purchase/Create', [
            'suppliers' => $suppliers,
            'currencies' => $currencies,
            'invoiceNumber' => $invoiceNumber,
        ]);
    }

    /**
     * Store a newly created purchase.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Purchase::class);

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'currency_id' => 'required|exists:currencies,id',
            'invoice_number' => 'required|string|max:255|unique:purchases',
            'invoice_date' => 'required|date',
            'currency_rate' => 'required|string|max:255',
            'status' => 'required|in:purchase,onway,on_border,on_plan,on_ship,arrived,warehouse_moved,return',
        ]);

        try {
            DB::beginTransaction();

            $purchase = Purchase::create([
                'user_id' => Auth::id(),
                'supplier_id' => $validated['supplier_id'],
                'currency_id' => $validated['currency_id'],
                'invoice_number' => $validated['invoice_number'],
                'invoice_date' => $validated['invoice_date'],
                'currency_rate' => $validated['currency_rate'],
                'status' => $validated['status'],
            ]);

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Purchase created successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error creating purchase: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error creating purchase: ' . $e->getMessage()]);
        }
    }

    /**
     * Display the specified purchase.
     */
    public function show(Purchase $purchase)
    {
        $this->authorize('view', $purchase);

        try {
            $purchase->load([
                'supplier',
                'currency',
                'user',
                'warehouse',
                'purchaseItems.product.unit',
                'payments.supplier',
                'payments.currency',
                'payments.user',
                'additional_costs'
            ]);

            // Calculate totals using model accessors
            $itemsTotal = $purchase->purchaseItems->sum('total_price');
            $additionalCostsTotal = $purchase->additional_costs->sum('amount');
            $totalAmount = $itemsTotal + $additionalCostsTotal;
            $paidAmount = $purchase->payments->sum('amount');
            $dueAmount = $totalAmount - $paidAmount;

            // Get warehouses for transfer (only active warehouses)
            $warehouses = \App\Models\Warehouse::select('id', 'name', 'code')
                ->where('is_active', true)
                ->orderBy('name')
                ->get();

            // Get permissions for this purchase
            $permissions = [
                'can_view' => Auth::user()->can('view', $purchase),
                'can_update' => Auth::user()->can('update', $purchase),
                'can_delete' => Auth::user()->can('delete', $purchase),
                'can_manage_items' => Auth::user()->can('manageItems', $purchase),
                'can_create_items' => Auth::user()->can('createItems', $purchase),
                'can_delete_items' => Auth::user()->can('deleteItems', $purchase),
                'can_manage_payments' => Auth::user()->can('managePayments', $purchase),
                'can_create_payments' => Auth::user()->can('createPayments', $purchase),
                'can_delete_payments' => Auth::user()->can('deletePayments', $purchase),
                'can_manage_additional_costs' => Auth::user()->can('manageAdditionalCosts', $purchase),
                'can_create_additional_costs' => Auth::user()->can('createAdditionalCosts', $purchase),
                'can_delete_additional_costs' => Auth::user()->can('deleteAdditionalCosts', $purchase),
                'can_warehouse_transfer' => Auth::user()->can('warehouseTransfer', $purchase),
            ];

            return Inertia::render('Admin/Purchase/Show', [
                'purchase' => [
                    'id' => $purchase->id,
                    'invoice_number' => $purchase->invoice_number,
                    'invoice_date' => $purchase->invoice_date,
                    'status' => $purchase->status,
                    'currency_rate' => $purchase->currency_rate,
                    'warehouse_id' => $purchase->warehouse_id,
                    'is_moved_to_warehouse' => $purchase->is_moved_to_warehouse,
                    'supplier' => $purchase->supplier,
                    'currency' => $purchase->currency,
                    'user' => $purchase->user,
                    'warehouse' => $purchase->warehouse,
                    'items_total' => $itemsTotal,
                    'additional_costs_total' => $additionalCostsTotal,
                    'total_amount' => $totalAmount,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'created_at' => $purchase->created_at,
                    'updated_at' => $purchase->updated_at,
                ],
                'purchaseItems' => $purchase->purchaseItems()->with('batch')->get()->toArray(),
                'payments' => $purchase->payments,
                'additionalCosts' => $purchase->additional_costs,
                'warehouses' => $warehouses,
                'permissions' => $permissions,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading purchase: ' . $e->getMessage());
            return redirect()->route('admin.purchases.index')
                ->with('error', 'Error loading purchase: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for editing the specified purchase.
     */
    public function edit(Purchase $purchase)
    {
        $this->authorize('update', $purchase);

        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();
        $currencies = Currency::select('id', 'name', 'code')->orderBy('name')->get();

        return Inertia::render('Admin/Purchase/Edit', [
            'purchase' => [
                'id' => $purchase->id,
                'supplier_id' => $purchase->supplier_id,
                'currency_id' => $purchase->currency_id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency_rate' => $purchase->currency_rate,
                'status' => $purchase->status,
            ],
            'suppliers' => $suppliers,
            'currencies' => $currencies,
        ]);
    }

    /**
     * Update the specified purchase.
     */
    public function update(Request $request, Purchase $purchase)
    {
        $this->authorize('update', $purchase);

        $validated = $request->validate([
            'supplier_id' => 'required|exists:suppliers,id',
            'currency_id' => 'required|exists:currencies,id',
            'invoice_number' => 'required|string|max:255|unique:purchases,invoice_number,' . $purchase->id,
            'invoice_date' => 'required|date',
            'currency_rate' => 'required|string|max:255',
            'status' => 'required|in:purchase,onway,on_border,on_plan,on_ship,arrived,warehouse_moved,return',
        ]);

        try {
            $purchase->update($validated);

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Purchase updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating purchase: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating purchase: ' . $e->getMessage()]);
        }
    }

    /**
     * Remove the specified purchase.
     */
    public function destroy(Purchase $purchase)
    {
        $this->authorize('delete', $purchase);

        try {
            $purchase->delete();

            return redirect()->route('admin.purchases.index')
                ->with('success', 'Purchase deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting purchase: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting purchase: ' . $e->getMessage());
        }
    }

    /**
     * Manage purchase items.
     */
    public function items(Purchase $purchase)
    {
        $purchase->load(['purchaseItems.product.unit', 'supplier', 'currency']);
        $products = Product::with(['unit'])
            ->select('id', 'name', 'barcode', 'category_id', 'unit_id', 'type', 'status')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Purchase/Items', [
            'purchase' => $purchase,
            'purchaseItems' => $purchase->purchaseItems,
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new purchase item.
     */
    public function createItem(Purchase $purchase)
    {
        $this->authorize('createItems', $purchase);

        $units = Unit::select('id', 'name', 'code')->orderBy('name')->get();
        $products = Product::with(['unit'])
            ->select('id', 'name', 'barcode', 'category_id', 'unit_id', 'type', 'status')
            ->orderBy('name')
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'stock_quantity' => 0, // Will be calculated from warehouse data
                    'purchase_price' => 0, // No longer stored in products table
                    'wholesale_price' => 0, // No longer stored in products table
                    'retail_price' => 0, // No longer stored in products table
                    'whole_sale_unit_amount' => 1, // Default value
                    'retails_sale_unit_amount' => 1, // Default value
                    'available_stock' => 0, // Will be calculated from warehouse data
                    'unit' => [
                        'id' => $product->unit_id,
                        'name' => $product->unit->name,
                        'code' => $product->unit->code,
                    ],
                ];
            });

        $permissions = [
            'can_create_items' => Auth::user()->can('createItems', $purchase),
        ];

        return Inertia::render('Admin/Purchase/CreateItem', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'products' => $products,
            'units' => $units,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store purchase item.
     */
    public function storeItem(Request $request, Purchase $purchase)
    {
        $this->authorize('createItems', $purchase);

        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'unit_id' => 'required|exists:units,id',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'total_price' => 'required|numeric|min:0',
                'unit_amount' => 'required|numeric|min:1',
                'is_wholesale' => 'required|boolean',
                'unit_type' => 'nullable|string|in:wholesale,retail',
                'notes' => 'nullable|string|max:1000', // Notes for purchase item (will be stored in batch)
                // Batch validation rules
                'batch.issue_date' => 'nullable|date',
                'batch.expire_date' => 'nullable|date|after_or_equal:batch.issue_date',
                'batch.wholesale_price' => 'nullable|numeric|min:0',
                'batch.retail_price' => 'nullable|numeric|min:0',
                'batch.purchase_price' => 'nullable|numeric|min:0',
                'batch.notes' => 'nullable|string|max:1000',
            ]);

            // Set default unit_type if not provided
            if (!isset($validated['unit_type'])) {
                $validated['unit_type'] = 'wholesale';
            }

            DB::beginTransaction();

            // Get the product and unit information
            $product = Product::findOrFail($validated['product_id']);
            $unit = Unit::findOrFail($validated['unit_id']);

            // Calculate unit details
            $isWholesale = $validated['is_wholesale'];
            $unitId = $validated['unit_id'];
            $unitAmount = $validated['unit_amount'];
            $unitName = $unit->name;

            // Use the quantity as provided by the frontend (already calculated)
            $qty = $validated['quantity'] * $unitAmount;

            // Create the purchase item record
            $item = PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $validated['product_id'],
                'quantity' => $qty,
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
                'unit_amount' => $unitAmount,
                'is_wholesale' => $isWholesale,
            ]);

            // Create batch record if batch data is provided or notes are provided
            if ((isset($validated['batch']) && !empty(array_filter($validated['batch']))) || !empty($validated['notes'])) {
                Batch::create([
                    'product_id' => $validated['product_id'],
                    'purchase_id' => $purchase->id,
                    'purchase_item_id' => $item->id,
                    'issue_date' => $validated['batch']['issue_date'] ?? null,
                    'expire_date' => $validated['batch']['expire_date'] ?? null,
                    'quantity' => $qty,
                    'price' => $validated['price'],
                    'wholesale_price' => $validated['batch']['wholesale_price'] ?? null,
                    'retail_price' => $validated['batch']['retail_price'] ?? null,
                    'purchase_price' => $validated['batch']['purchase_price'] ?? null,
                    'total' => $validated['total_price'],
                    'unit_type' => $validated['unit_type'],
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'notes' => $validated['batch']['notes'] ?? $validated['notes'] ?? null,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Purchase item added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding purchase item: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete purchase item.
     */
    public function destroyItem(Purchase $purchase, PurchaseItem $item)
    {
        $this->authorize('deleteItems', $purchase);

        try {
            DB::beginTransaction();
            $item->batch()->delete();
            $item->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Purchase item deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting purchase item: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new additional cost.
     */
    public function createAdditionalCost(Purchase $purchase)
    {
        $this->authorize('createAdditionalCosts', $purchase);

        $permissions = [
            'can_create_additional_costs' => Auth::user()->can('createAdditionalCosts', $purchase),
        ];

        return Inertia::render('Admin/Purchase/CreateAdditionalCost', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store additional cost.
     */
    public function storeAdditionalCost(Request $request, Purchase $purchase)
    {
        $this->authorize('createAdditionalCosts', $purchase);

        try {
            $validated = $request->validate([
                'name' => 'required|string|max:255',
                'amount' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Create the additional cost record
            $cost = PurchaseHasAddionalCosts::create([
                'purchase_id' => $purchase->id,
                'name' => $validated['name'],
                'amount' => $validated['amount'],
                // Note: description is not supported by the existing model
            ]);

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Additional cost added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding additional cost: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete additional cost.
     */
    public function destroyAdditionalCost(Purchase $purchase, PurchaseHasAddionalCosts $cost)
    {
        $this->authorize('deleteAdditionalCosts', $purchase);

        try {
            DB::beginTransaction();

            $cost->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Additional cost deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting additional cost: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting additional cost: ' . $e->getMessage());
        }
    }

    /**
     * Show the form for creating a new payment.
     */
    public function createPayment(Purchase $purchase)
    {
        $this->authorize('createPayments', $purchase);

        $purchase->load(['supplier', 'currency']);
        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();
        $currencies = Currency::select('id', 'name', 'code')->orderBy('name')->get();

        $permissions = [
            'can_create_payments' => Auth::user()->can('createPayments', $purchase),
        ];

        return Inertia::render('Admin/Purchase/CreatePayment', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'supplier' => $purchase->supplier,
                'currency' => $purchase->currency,
            ],
            'suppliers' => $suppliers,
            'currencies' => $currencies,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store payment.
     */
    public function storePayment(Request $request, Purchase $purchase)
    {
        $this->authorize('createPayments', $purchase);

        try {
            $validated = $request->validate([
                'supplier_id' => 'required|exists:suppliers,id',
                'currency_id' => 'required|exists:currencies,id',
                'amount' => 'required|numeric|min:0.01',
                'payment_method' => 'required|in:cash,bank_transfer,check,credit_card,other',
                'reference_number' => 'nullable|string|max:255',
                'bank_name' => 'nullable|string|max:255',
                'bank_account' => 'nullable|string|max:255',
                'payment_date' => 'required|date',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Create the payment record
            $payment = PurchasePayment::create([
                'purchase_id' => $purchase->id,
                'user_id' => Auth::id(),
                'supplier_id' => $validated['supplier_id'],
                'currency_id' => $validated['currency_id'],
                'amount' => $validated['amount'],
                'payment_method' => $validated['payment_method'],
                'reference_number' => $validated['reference_number'],
                'bank_name' => $validated['bank_name'],
                'bank_account' => $validated['bank_account'],
                'payment_date' => $validated['payment_date'],
                'notes' => $validated['notes'],
            ]);

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Payment added successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error adding payment: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error adding payment: ' . $e->getMessage()]);
        }
    }

    /**
     * Delete payment.
     */
    public function destroyPayment(Purchase $purchase, PurchasePayment $payment)
    {
        $this->authorize('deletePayments', $purchase);

        try {
            DB::beginTransaction();

            $payment->delete();

            DB::commit();

            return redirect()->back()
                ->with('success', 'Payment deleted successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error deleting payment: ' . $e->getMessage());
            return redirect()->back()
                ->with('error', 'Error deleting payment: ' . $e->getMessage());
        }
    }

    /**
     * Show warehouse transfer form.
     */
    public function warehouseTransfer(Purchase $purchase)
    {
        $this->authorize('warehouseTransfer', $purchase);

        $warehouses = \App\Models\Warehouse::select('id', 'name', 'code')->where('is_active', true)->orderBy('name')->get();

        return Inertia::render('Admin/Purchase/WarehouseTransfer', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'status' => $purchase->status,
                'supplier' => $purchase->supplier,
                'currency' => $purchase->currency,
                'is_moved_to_warehouse' => $purchase->is_moved_to_warehouse,
            ],
            'warehouses' => $warehouses,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Store warehouse transfer.
     */
    public function storeWarehouseTransfer(Request $request, Purchase $purchase)
    {
        $this->authorize('warehouseTransfer', $purchase);

        try {
            $validated = $request->validate([
                'warehouse_id' => 'required|exists:warehouses,id',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Load purchase items
            $purchase->load('purchaseItems.product');

            // Check if purchase has items
            if ($purchase->purchaseItems->count() === 0) {
                return redirect()->back()
                    ->with('error', 'Cannot transfer purchase with no items to warehouse.');
            }

            // Generate reference number for warehouse income
            $referenceNumber = 'PUR-' . $purchase->invoice_number . '-WH-' . date('Y-m-d-H-i-s');

            // Create warehouse income records for each purchase item
            foreach ($purchase->purchaseItems as $item) {
                // Find the batch for this purchase item
                $batch = Batch::where('purchase_item_id', $item->id)->first();
                \App\Models\WarehouseIncome::create([
                    'reference_number' => $referenceNumber,
                    'warehouse_id' => $validated['warehouse_id'],
                    'product_id' => $item->product_id,
                    'batch_id' => $batch ? $batch->id : null,
                    'quantity' => $item->quantity,
                    'price' => $item->price,
                    'total' => $item->total_price,
                    'model_type' => 'App\\Models\\Purchase',
                    'model_id' => $purchase->id,
                    'unit_type' => $item->unit_type,
                    'is_wholesale' => $item->is_wholesale,
                    'unit_id' => $batch->unit_id,
                    'unit_amount' => $batch->unit_amount,
                    'unit_name' => $batch->unit_name,
                ]);
            }

            // Update purchase status and warehouse assignment
            $purchase->update([
                'warehouse_id' => $validated['warehouse_id'],
                'is_moved_to_warehouse' => true,
                'status' => 'warehouse_moved'
            ]);

            DB::commit();

            return redirect()->route('admin.purchases.show', $purchase->id)
                ->with('success', 'Purchase items successfully transferred to warehouse.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error transferring purchase to warehouse: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error transferring purchase to warehouse: ' . $e->getMessage()]);
        }
    }
}
