<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\CustomerStockOutcome;
use App\Models\Customer;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Str;
use Inertia\Inertia;
use Spatie\Activitylog\Facades\LogBatch;
use Spatie\Activitylog\Models\Activity;

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
            ->with(['product', 'unit'])
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

        // Get paginated results with enhanced data mapping
        $stockOutcomes = $query->paginate(10)
            ->through(function ($outcome) {
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
                    'unit_type' => $outcome->unit_type ?? 'retail',
                    'is_wholesale' => $outcome->is_wholesale ?? false,
                    'unit_id' => $outcome->unit_id,
                    'unit_amount' => $outcome->unit_amount ?? 1,
                    'unit_name' => $outcome->unit_name,
                    'unit' => $outcome->unit ? [
                        'id' => $outcome->unit->id,
                        'name' => $outcome->unit->name,
                        'code' => $outcome->unit->code,
                        'symbol' => $outcome->unit->symbol,
                    ] : null,
                    'notes' => $outcome->notes,
                    'description' => $outcome->description,
                    'reason' => $outcome->reason,
                    'status' => $outcome->status,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
                ];
            })
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
     * Search for products by name or barcode
     */
    public function searchProducts(Request $request)
    {
        $search = $request->input('search');

        $products = Product::with(['wholesaleUnit', 'retailUnit'])
            ->where('is_activated', true)
            ->where(function($query) use ($search) {
                $query->where('name', 'like', "%{$search}%")
                      ->orWhere('barcode', 'like', "%{$search}%");
            })
            ->limit(10)
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'barcode' => $product->barcode,
                    'type' => $product->type,
                    'purchase_price' => $product->purchase_price,
                    'wholesale_price' => $product->wholesale_price,
                    'retail_price' => $product->retail_price,
                    'whole_sale_unit_amount' => $product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $product->retails_sale_unit_amount,
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

        return response()->json($products);
    }

}
