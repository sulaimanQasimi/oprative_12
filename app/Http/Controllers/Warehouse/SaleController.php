<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;
use App\Models\Sale;

class SaleController extends Controller
{
    /**
     * Constructor to apply middleware for all sale permissions
     */
    public function __construct()
    {
        $this->middleware('permission:warehouse.view_sales', ['guard' => 'warehouse_user'])->only(['index']);
        $this->middleware('permission:warehouse.view_sale_details', ['guard' => 'warehouse_user'])->only(['show']);
        $this->middleware('permission:warehouse.generate_invoice', ['guard' => 'warehouse_user'])->only(['invoice']);
        $this->middleware('permission:warehouse.confirm_sales', ['guard' => 'warehouse_user'])->only(['confirm']);
    }
    /**
     * Display a listing of sales.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sales = Sale::where('warehouse_id', $warehouse->id)
            ->with(['customer', 'currency', 'saleItems'])
            ->latest()
            ->get()
            ->map(function ($sale) {
                // Calculate total from sale items if the sale total is 0
                $calculatedTotal = $sale->total > 0 ? $sale->total : $sale->saleItems->sum('total');
                
                return [
                    'id' => $sale->id,
                    'reference' => $sale->reference,
                    'amount' => (float) $calculatedTotal,
                    'date' => $sale->date->format('Y-m-d'),
                    'status' => $sale->status,
                    'customer' => $sale->customer ? $sale->customer->name : 'Unknown',
                    'notes' => $sale->notes ?? null,
                    'created_at' => $sale->created_at->diffForHumans(),
                    'currency' => $sale->currency ? $sale->currency->code : null,
                    'paid_amount' => (float) ($sale->paid_amount ?: $calculatedTotal),
                    'due_amount' => (float) $sale->due_amount,
                    'items_count' => $sale->saleItems->count(),
                    'confirmed_by_warehouse' => (bool) $sale->confirmed_by_warehouse,
                    'detail_url' => route('warehouse.sales.show', $sale->id),
                    'edit_url' => route('warehouse.sales.edit', $sale->id),
                    'invoice_url' => route('warehouse.sales.invoice', $sale->id),
                ];
            });
        // Pass permissions to the frontend
        $permissions = [
            'view_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sales'),
            'view_sale_details' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sale_details'),
            'generate_invoice' => Auth::guard('warehouse_user')->user()->can('warehouse.generate_invoice'),
            'confirm_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.confirm_sales'),
        ];

        return Inertia::render('Warehouse/Sale', [
            'sales' => $sales,
            'permissions' => $permissions,
            'auth' => [
                'user' => Auth::guard('warehouse_user')->user()->load('warehouse')
            ]
        ]);
    }

    /**
     * Display the specified sale.
     */
    public function show($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->with([
                'customer',
                'currency',
                'warehouse',
                'saleItems.product.wholesaleUnit',
                'saleItems.product.retailUnit',
                'payments' // Load payment history
            ])
            ->firstOrFail();

        // Transform sale items to include product details with wholesale and retail units
        $saleItems = $sale->saleItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $item->product->retails_sale_unit_amount,
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
                ],
                'unit' => $item->unit,
                'quantity' => (float) $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total' => (float) $item->total
            ];
        });

        // Transform payments (if any)
        $payments = $sale->payments ? $sale->payments->map(function ($payment) {
                return [
                    'id' => $payment->id,
                    'payment_date' => $payment->payment_date->format('Y-m-d'),
                    'amount' => (float) $payment->amount,
                    'payment_method' => $payment->payment_method,
                    'reference' => $payment->reference,
                    'notes' => $payment->notes,
                    'currency' => $payment->currency ? $payment->currency->code : null
                ];
            }) : [];

        // Transform customer data
        $customer = [
            'id' => $sale->customer->id,
            'name' => $sale->customer->name,
            'email' => $sale->customer->email,
            'phone' => $sale->customer->phone,
            'address' => $sale->customer->address,
            'tax_number' => $sale->customer->tax_number ?? null
        ];

        // Calculate total from sale items if the sale total is 0
        $calculatedTotal = $sale->total > 0 ? $sale->total : $sale->saleItems->sum('total');

        // Format sale data for the view
        $saleData = [
            'id' => $sale->id,
            'reference' => $sale->reference,
            'date' => $sale->date->format('Y-m-d'),
            'status' => $sale->status,
            'notes' => $sale->notes,
            'customer' => $customer,
            'currency' => $sale->currency ? $sale->currency->code : null,
            'total_amount' => (float) $calculatedTotal,
            'paid_amount' => (float) ($sale->paid_amount ?: $calculatedTotal),
            'due_amount' => 0,
            'tax_percentage' => 0,
            'tax_amount' => 0,
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'created_at' => $sale->created_at->diffForHumans(),
            'items_count' => $sale->saleItems->count(),
            'sale_items' => $saleItems,
            'payments' => $payments,
            'confirmed_by_warehouse' => (bool) $sale->confirmed_by_warehouse,
            'warehouse' => [
                'id' => $sale->warehouse->id,
                'name' => $sale->warehouse->name,
                'address' => $sale->warehouse->address,
                'phone' => $sale->warehouse->phone,
                'email' => $sale->warehouse->email
            ]
        ];

        // Pass permissions to the frontend
        $permissions = [
            'view_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sales'),
            'view_sale_details' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sale_details'),
            'generate_invoice' => Auth::guard('warehouse_user')->user()->can('warehouse.generate_invoice'),
            'confirm_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.confirm_sales'),
        ];

        return Inertia::render('Warehouse/ShowSale', [
            'sale' => $saleData,
            'permissions' => $permissions,
            'auth' => [
                'user' => Auth::guard('warehouse_user')->user()->load('warehouse')
            ]
        ]);
    }


    /**
     * Confirm a sale by warehouse.
     */
    public function confirm($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->firstOrFail();

        // Update the confirmed_by_warehouse status
        $sale->confirmed_by_warehouse = true;
        $sale->save();

        return redirect()->route('warehouse.sales.show', $sale->id)
            ->with('success', 'Sale has been confirmed successfully.');
    }

    /**
     * Generate a PDF invoice for the sale.
     */
    public function invoice($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->with([
                'customer',
                'currency',
                'warehouse',
                'saleItems.product.wholesaleUnit',
                'saleItems.product.retailUnit',
                'payments'
            ])
            ->firstOrFail();

        // Transform sale items to include product details with wholesale and retail units
        $saleItems = $sale->saleItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $item->product->retails_sale_unit_amount,
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
                ],
                'unit' => $item->unit,
                'quantity' => (float) $item->quantity,
                'unit_price' => (float) $item->unit_price,
                'total' => (float) $item->total
            ];
        });

        // Transform payments
        $payments = $sale->payments->map(function ($payment) {
            return [
                'id' => $payment->id,
                'payment_date' => $payment->payment_date->format('Y-m-d'),
                'amount' => (float) $payment->amount,
                'payment_method' => $payment->payment_method,
                'reference' => $payment->reference,
                'notes' => $payment->notes,
                'currency' => $payment->currency ? $payment->currency->code : null
            ];
        });

        // Transform customer data
        $customer = [
            'id' => $sale->customer->id,
            'name' => $sale->customer->name,
            'email' => $sale->customer->email,
            'phone' => $sale->customer->phone,
            'address' => $sale->customer->address,
            'tax_number' => $sale->customer->tax_number
        ];

        // Calculate total from sale items if the sale total is 0
        $calculatedTotal = $sale->total > 0 ? $sale->total : $sale->saleItems->sum('total');

        // Format sale data for the view
        $saleData = [
            'id' => $sale->id,
            'reference' => $sale->reference,
            'date' => $sale->date->format('Y-m-d'),
            'status' => $sale->status,
            'notes' => $sale->notes,
            'customer' => $customer,
            'currency' => $sale->currency ? $sale->currency->code : null,
            'total_amount' => (float) $calculatedTotal,
            'paid_amount' => (float) ($sale->paid_amount ?: $calculatedTotal),
            'due_amount' => 0,
            'tax_percentage' => 0,
            'tax_amount' => 0,
            'discount_percentage' => 0,
            'discount_amount' => 0,
            'shipping_cost' => 0,
            'created_at' => $sale->created_at->diffForHumans(),
            'items_count' => $sale->saleItems->count(),
            'sale_items' => $saleItems,
            'payments' => $payments,
            'confirmed_by_warehouse' => (bool) $sale->confirmed_by_warehouse,
            'warehouse' => [
                'id' => $sale->warehouse->id,
                'name' => $sale->warehouse->name,
                'address' => $sale->warehouse->address,
                'phone' => $sale->warehouse->phone,
                'email' => $sale->warehouse->email
            ]
        ];

        // Company info for the invoice
        $company = [
            'name' => 'Your Company Name',
            'address' => 'Company Address',
            'phone' => '+1 123 456 7890',
            'email' => 'info@company.com',
            'website' => 'www.company.com',
            'tax_number' => 'TAX-123456',
            'logo' => '/logo.png',
            'footer_text' => 'Invoice generated by Company ERP System'
        ];

        // Pass permissions to the frontend
        $permissions = [
            'view_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sales'),
            'view_sale_details' => Auth::guard('warehouse_user')->user()->can('warehouse.view_sale_details'),
            'generate_invoice' => Auth::guard('warehouse_user')->user()->can('warehouse.generate_invoice'),
            'confirm_sales' => Auth::guard('warehouse_user')->user()->can('warehouse.confirm_sales'),
        ];

        return Inertia::render('Warehouse/SaleInvoice', [
            'sale' => $saleData,
            'company' => $company,
            'permissions' => $permissions,
            'auth' => [
                'user' => Auth::guard('warehouse_user')->user()->load('warehouse')
            ]
        ]);
    }
}
