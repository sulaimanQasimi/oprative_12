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
use Spatie\Activitylog\Facades\LogBatch;
use Spatie\Activitylog\Models\Activity;

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
        $stockIncomes = $query->paginate(10)
            ->through(function ($income) {
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
                    'unit_type' => $income->unit_type ?? 'retail',
                    'is_wholesale' => $income->is_wholesale ?? false,
                    'unit_id' => $income->unit_id,
                    'unit_amount' => $income->unit_amount ?? 1,
                    'unit_name' => $income->unit_name,
                    'unit' => $income->unit ? [
                        'id' => $income->unit->id,
                        'name' => $income->unit->name,
                        'code' => $income->unit->code,
                        'symbol' => $income->unit->symbol,
                    ] : null,
                    'notes' => $income->notes,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ];
            })
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
        $stockIncome->load(['product', 'unit']);

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

        // Get all products with their units and pricing information (similar to warehouse)
        $products = Product::with(['wholesaleUnit', 'retailUnit'])
            ->where('is_activated', true)
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

    /**
     * Store a newly created stock income
     */
    public function store(Request $request)
    {
        // Enhanced validation with unit type support
        $validated = $request->validate([
            'product_id' => 'required|exists:products,id,is_activated,1',
            'reference_number' => 'required|string|max:255|unique:customer_stock_incomes,reference_number',
            'unit_type' => 'required|in:wholesale,retail',
            'quantity' => 'required|numeric|min:0.01',
            'price' => 'required|numeric|min:0|max:9999999.99',
            'notes' => 'nullable|string|max:1000',
        ], [
            'product_id.required' => 'لطفاً یک محصول را انتخاب کنید.',
            'product_id.exists' => 'محصول انتخاب شده معتبر نیست یا فعال نمی باشد.',
            'reference_number.required' => 'شماره مرجع الزامی است.',
            'reference_number.unique' => 'این شماره مرجع قبلاً استفاده شده است.',
            'unit_type.required' => 'نوع واحد را انتخاب کنید.',
            'unit_type.in' => 'نوع واحد انتخاب شده معتبر نیست.',
            'quantity.required' => 'مقدار را وارد کنید.',
            'quantity.min' => 'مقدار باید حداقل 0.01 باشد.',
            'price.required' => 'قیمت را وارد کنید.',
            'price.min' => 'قیمت نمی‌تواند منفی باشد.',
            'price.max' => 'قیمت وارد شده بیش از حد مجاز است.',
        ]);

        // Get the product with unit information
        $product = Product::with(['wholesaleUnit', 'retailUnit'])->findOrFail($validated['product_id']);

        if (!$product->is_activated) {
            return redirect()->back()
                ->withErrors(['product_id' => 'محصول انتخاب شده غیرفعال است.'])
                ->withInput();
        }

        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;
        $user = Auth::guard('customer_user')->user();

        // Calculate actual quantity and total based on unit type (similar to warehouse logic)
        $actualQuantity = $validated['quantity'];
        $unitPrice = $validated['price'];
        $isWholesale = $validated['unit_type'] === 'wholesale';
        $unitId = null;
        $unitAmount = 1;
        $unitName = null;
        $total = 0;

        if ($isWholesale && $product->wholesaleUnit) {
            // If wholesale unit is selected, multiply by unit amount
            $actualQuantity = $validated['quantity'] * $product->whole_sale_unit_amount;
            $unitId = $product->wholesaleUnit->id;
            $unitAmount = $product->whole_sale_unit_amount;
            $unitName = $product->wholesaleUnit->name;
            $total = $validated['quantity'] * $unitPrice;
        } elseif (!$isWholesale && $product->retailUnit) {
            // For retail unit
            $unitId = $product->retailUnit->id;
            $unitAmount = $product->retails_sale_unit_amount ?? 1;
            $unitName = $product->retailUnit->name;
            $total = $actualQuantity * $unitPrice;
        } else {
            // Fallback if no unit is configured
            $total = $actualQuantity * $unitPrice;
        }

        // Start a log batch to group related activities
        LogBatch::startBatch();

        // Create stock income with enhanced unit data
        $stockIncome = CustomerStockIncome::create([
            'customer_id' => $customer->id,
            'product_id' => $validated['product_id'],
            'reference_number' => $validated['reference_number'],
            'quantity' => $actualQuantity,
            'price' => $unitPrice,
            'total' => $total,
            'unit_type' => $validated['unit_type'],
            'is_wholesale' => $isWholesale,
            'unit_id' => $unitId,
            'unit_amount' => $unitAmount,
            'unit_name' => $unitName,
            'notes' => $validated['notes'] ?? null,
        ]);

        // Log the stock income creation with detailed information
        activity()
            ->causedBy($user)
            ->performedOn($stockIncome)
            ->withProperties([
                'product_name' => $product->name,
                'quantity' => $actualQuantity,
                'unit_type' => $validated['unit_type'],
                'unit_name' => $unitName,
                'price' => $unitPrice,
                'total' => $total,
                'customer_name' => $customer->name,
            ])
            ->log('ثبت ورود موجودی جدید: ' . $actualQuantity . ' ' . $product->name . ' با مبلغ ' . $total);

        // Log a separate customer activity
        activity()
            ->causedBy($user)
            ->performedOn($customer)
            ->log('افزودن موجودی ' . $product->name . ' به مقدار ' . $actualQuantity . ' واحد');

        // Complete the batch
        LogBatch::endBatch();

        return redirect()->route('customer.stock-incomes.index')
            ->with('success', 'ورودی موجودی با موفقیت ثبت شد.');
    }
}
