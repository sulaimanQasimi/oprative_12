<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerStockIncome;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;

class StockIncomeController extends Controller
{
    /**
     * Display a listing of stock incomes
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'product', 'date_from', 'date_to']);

        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        $query = CustomerStockIncome::where('customer_id', $customer->id)
            ->with(['product', 'model'])
            ->latest();

        // Apply filters
        if (!empty($filters['search'])) {
            $query->where('reference_number', 'like', '%' . $filters['search'] . '%');
        }

        if (!empty($filters['product'])) {
            $query->where('product_id', $filters['product']);
        }

        if (!empty($filters['date_from'])) {
            $query->whereDate('created_at', '>=', $filters['date_from']);
        }

        if (!empty($filters['date_to'])) {
            $query->whereDate('created_at', '<=', $filters['date_to']);
        }

        // Get paginated results
        $stockIncomes = $query->paginate(10)
            ->appends($request->query());

        // Get product list for filter
        $products = Product::whereHas('customerStockIncomes', function ($q) use ($customer) {
            $q->where('customer_id', $customer->id);
        })->get(['id', 'name']);

        return Inertia::render('Customer/StockIncomes/Index', [
            'stockIncomes' => $stockIncomes,
            'filters' => $filters,
            'products' => $products,
            'statistics' => [
                'total' => CustomerStockIncome::where('customer_id', $customer->id)->count(),
                'total_quantity' => CustomerStockIncome::where('customer_id', $customer->id)->sum('quantity'),
                'total_value' => CustomerStockIncome::where('customer_id', $customer->id)->sum('total'),
            ]
        ]);
    }

    /**
     * Display the specified stock income
     */
    public function show(CustomerStockIncome $stockIncome)
    {
        // Ensure the stock income belongs to the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        if ($stockIncome->customer_id !== $customer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Load relationships
        $stockIncome->load(['product', 'model']);

        return Inertia::render('Customer/StockIncomes/Show', [
            'stockIncome' => $stockIncome
        ]);
    }

    /**
     * Show the form for creating a new stock income
     */
    public function create()
    {
        $customer = Auth::guard('customer_user')->user()->customer;

        // Get available products with name and barcode for searching
        $products = Product::select('id', 'name', 'barcode', 'purchase_price')
            ->where('is_activated', true)
            ->get();

        return Inertia::render('Customer/StockIncomes/Create', [
            'products' => $products,
            'reference' => 'INC-' . strtoupper(Str::random(8))
        ]);
    }

    /**
     * Search for products by name or barcode
     */
    public function searchProducts(Request $request)
    {
        $search = $request->input('search');

        $products = Product::select('id', 'name', 'barcode', 'purchase_price')
            ->where('is_activated', true)
            ->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get();

        return response()->json($products);
    }

    /**
     * Store a newly created stock income
     */
    public function store(Request $request)
    {
        // Validate request
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id',
            'reference_number' => 'required|string|max:255|unique:customer_stock_incomes',
            'quantity' => 'required|integer|min:1',
            'price' => 'required|numeric|min:0',
        ]);

        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        // Calculate total
        $total = $validated['quantity'] * $validated['price'];

        // Create stock income
        $stockIncome = CustomerStockIncome::create([
            'customer_id' => $customer->id,
            'product_id' => $validated['product_id'],
            'reference_number' => $validated['reference_number'],
            'quantity' => $validated['quantity'],
            'price' => $validated['price'],
            'total' => $total,
        ]);

        return redirect()->route('customer.stock-incomes.index')
            ->with('success', 'Stock income created successfully!');
    }
}
