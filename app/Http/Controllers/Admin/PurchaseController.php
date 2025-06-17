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
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Supplier filter
        if ($request->filled('supplier_id')) {
            $query->where('supplier_id', $request->supplier_id);
        }

        $purchases = $query->latest()->paginate(10);
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

        return Inertia::render('Admin/Purchase/Index', [
            'purchases' => $purchases,
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'supplier_id']),
            'stats' => [
                'total_purchases' => $totalPurchases,
                'total_amount' => $totalAmount,
                'suppliers_count' => $suppliersCount,
            ],
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Show the form for creating a new purchase.
     */
    public function create()
    {
        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();
        $currencies = Currency::select('id', 'name', 'code')->orderBy('name')->get();

        // Generate invoice number
        $lastPurchase = Purchase::latest()->first();
        $invoiceNumber = 'PUR-' . date('Y') . '-' . str_pad(($lastPurchase ? $lastPurchase->id + 1 : 1), 6, '0', STR_PAD_LEFT);

        return Inertia::render('Admin/Purchase/Create', [
            'suppliers' => $suppliers,
            'currencies' => $currencies,
            'invoiceNumber' => $invoiceNumber,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Store a newly created purchase.
     */
    public function store(Request $request)
    {
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
        try {
            $purchase->load([
                'supplier',
                'currency',
                'user',
                'purchaseItems.product.wholesaleUnit',
                'purchaseItems.product.retailUnit',
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

            return Inertia::render('Admin/Purchase/Show', [
                'purchase' => [
                    'id' => $purchase->id,
                    'invoice_number' => $purchase->invoice_number,
                    'invoice_date' => $purchase->invoice_date,
                    'status' => $purchase->status,
                    'currency_rate' => $purchase->currency_rate,
                    'supplier' => $purchase->supplier,
                    'currency' => $purchase->currency,
                    'user' => $purchase->user,
                    'items_total' => $itemsTotal,
                    'additional_costs_total' => $additionalCostsTotal,
                    'total_amount' => $totalAmount,
                    'paid_amount' => $paidAmount,
                    'due_amount' => $dueAmount,
                    'created_at' => $purchase->created_at,
                    'updated_at' => $purchase->updated_at,
                ],
                'purchaseItems' => $purchase->purchaseItems,
                'payments' => $purchase->payments,
                'additionalCosts' => $purchase->additional_costs,
                'auth' => [
                    'user' => Auth::guard('web')->user()
                ]
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
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Update the specified purchase.
     */
    public function update(Request $request, Purchase $purchase)
    {
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
        try {
            // Check if purchase has items or payments
            if ($purchase->purchaseItems()->count() > 0) {
                return redirect()->back()
                    ->with('error', 'Cannot delete purchase with existing items.');
            }

            if ($purchase->payments()->count() > 0) {
                return redirect()->back()
                    ->with('error', 'Cannot delete purchase with existing payments.');
            }

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
        $purchase->load(['purchaseItems.product.wholesaleUnit', 'purchaseItems.product.retailUnit', 'supplier', 'currency']);
        $products = Product::with(['wholesaleUnit', 'retailUnit'])
            ->select('id', 'name', 'purchase_price', 'wholesale_price', 'retail_price', 'whole_sale_unit_amount', 'retails_sale_unit_amount', 'wholesale_unit_id', 'retail_unit_id', 'barcode')
            ->orderBy('name')
            ->get();

        return Inertia::render('Admin/Purchase/Items', [
            'purchase' => $purchase,
            'purchaseItems' => $purchase->purchaseItems,
            'products' => $products,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Show the form for creating a new purchase item.
     */
    public function createItem(Purchase $purchase)
    {
        $products = Product::with(['wholesaleUnit', 'retailUnit'])
            ->select('id', 'name', 'purchase_price', 'wholesale_price', 'retail_price', 'whole_sale_unit_amount', 'retails_sale_unit_amount', 'wholesale_unit_id', 'retail_unit_id', 'barcode')
            ->orderBy('name')
            ->get()->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'stock_quantity' => $product->net_quantity ?? 0, // Available stock in warehouse
                    'purchase_price' => $product->purchase_price,
                    'wholesale_price' => $product->wholesale_price,
                    'retail_price' => $product->retail_price,
                    'whole_sale_unit_amount' => $product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $product->retails_sale_unit_amount,
                    'available_stock' => $product->net_quantity ?? 0,
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
                ];
            });
        return Inertia::render('Admin/Purchase/CreateItem', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'products' => $products,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Store purchase item.
     */
    public function storeItem(Request $request, Purchase $purchase)
    {
        try {
            $validated = $request->validate([
                'product_id' => 'required|exists:products,id',
                'unit_type' => 'required|in:wholesale,retail',
                'quantity' => 'required|numeric|min:0.01',
                'price' => 'required|numeric|min:0',
                'notes' => 'nullable|string|max:1000',
                'total_price' => 'required|numeric|min:0',
            ]);

            DB::beginTransaction();

            // Create the purchase item record
            $item = PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
            ]);

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
        try {
            DB::beginTransaction();

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
        return Inertia::render('Admin/Purchase/CreateAdditionalCost', [
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'invoice_date' => $purchase->invoice_date,
                'currency' => $purchase->currency,
            ],
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Store additional cost.
     */
    public function storeAdditionalCost(Request $request, Purchase $purchase)
    {
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
        $purchase->load(['supplier', 'currency']);
        $suppliers = Supplier::select('id', 'name')->orderBy('name')->get();
        $currencies = Currency::select('id', 'name', 'code')->orderBy('name')->get();

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
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    /**
     * Store payment.
     */
    public function storePayment(Request $request, Purchase $purchase)
    {
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
}
