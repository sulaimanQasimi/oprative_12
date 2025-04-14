<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerStockOutcome;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class StockOutcomeController extends Controller
{
    /**
     * Display a listing of stock outcomes
     */
    public function index(Request $request)
    {
        $filters = $request->only(['search', 'product', 'date_from', 'date_to']);

        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        $query = CustomerStockOutcome::where('customer_id', $customer->id)
            ->with(['product'])
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
        $stockOutcomes = $query->paginate(10)
            ->appends($request->query());

        // Get product list for filter
        $products = Product::whereHas('customerStockOutcomes', function ($q) use ($customer) {
            $q->where('customer_id', $customer->id);
        })->get(['id', 'name']);

        return Inertia::render('Customer/StockOutcomes/Index', [
            'stockOutcomes' => $stockOutcomes,
            'filters' => $filters,
            'products' => $products,
            'statistics' => [
                'total' => CustomerStockOutcome::where('customer_id', $customer->id)->count(),
                'total_quantity' => CustomerStockOutcome::where('customer_id', $customer->id)->sum('quantity'),
                'total_value' => CustomerStockOutcome::where('customer_id', $customer->id)->sum('total'),
            ]
        ]);
    }

    /**
     * Display the specified stock outcome
     */
    public function show(CustomerStockOutcome $stockOutcome)
    {
        // Ensure the stock outcome belongs to the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;

        if ($stockOutcome->customer_id !== $customer->id) {
            abort(403, 'Unauthorized action.');
        }

        // Load relationships
        $stockOutcome->load(['product']);

        return Inertia::render('Customer/StockOutcomes/Show', [
            'stockOutcome' => $stockOutcome
        ]);
    }
}
