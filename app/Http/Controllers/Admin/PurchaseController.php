<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Purchase;
use App\Models\PurchaseItem;
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
                'purchaseItems.product',
                'payments',
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
            ->select('id', 'name', 'purchase_price', 'wholesale_price', 'retail_price', 'whole_sale_unit_amount', 'wholesale_unit_id', 'retail_unit_id', 'barcode')
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
     * Store purchase item.
     */
    public function storeItem(Request $request, Purchase $purchase)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_type' => 'nullable|string|in:wholesale,retail',
            'price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            PurchaseItem::create([
                'purchase_id' => $purchase->id,
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
            ]);

            DB::commit();

            return redirect()->back()
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
     * Update purchase item.
     */
    public function updateItem(Request $request, Purchase $purchase, PurchaseItem $item)
    {
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'quantity' => 'required|numeric|min:0.01',
            'unit_type' => 'nullable|string|in:wholesale,retail',
            'price' => 'required|numeric|min:0',
            'total_price' => 'required|numeric|min:0',
        ]);

        try {
            DB::beginTransaction();

            $item->update([
                'product_id' => $validated['product_id'],
                'quantity' => $validated['quantity'],
                'unit_type' => $validated['unit_type'],
                'price' => $validated['price'],
                'total_price' => $validated['total_price'],
            ]);

            DB::commit();

            return redirect()->back()
                ->with('success', 'Purchase item updated successfully.');
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error updating purchase item: ' . $e->getMessage());
            return redirect()->back()
                ->withInput()
                ->withErrors(['error' => 'Error updating purchase item: ' . $e->getMessage()]);
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
} 