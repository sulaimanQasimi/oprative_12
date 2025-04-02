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
     * Display a listing of sales.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sales = Sale::where('warehouse_id', $warehouse->id)
            ->with(['customer', 'currency'])
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'reference' => $sale->reference,
                    'amount' => (float) $sale->total_amount,
                    'date' => $sale->date->format('Y-m-d'),
                    'status' => $sale->status,
                    'customer' => $sale->customer ? $sale->customer->name : 'Unknown',
                    'notes' => $sale->notes ?? null,
                    'created_at' => $sale->created_at->diffForHumans(),
                    'currency' => $sale->currency ? $sale->currency->code : null,
                    'paid_amount' => (float) $sale->paid_amount,
                    'due_amount' => (float) $sale->due_amount,
                    'items_count' => $sale->saleItems->count(),
                ];
            });

        return Inertia::render('Warehouse/Sale', [
            'sales' => $sales,
        ]);
    }

    /**
     * Show the form for creating a new sale.
     */
    public function create()
    {
        // Implementation for create form
        return Inertia::render('Warehouse/CreateSale');
    }

    /**
     * Store a newly created sale in storage.
     */
    public function store(Request $request)
    {
        // Implementation for storing a sale
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'reference' => 'required|string|max:255',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:0.01',
            'items.*.price' => 'required|numeric|min:0.01',
        ]);

        // Implementation for creating a sale record
        return redirect()->route('warehouse.sales')->with('success', 'Sale created successfully.');
    }

    /**
     * Display the specified sale.
     */
    public function show($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->with(['customer', 'currency', 'saleItems.product'])
            ->firstOrFail();

        return Inertia::render('Warehouse/ShowSale', [
            'sale' => $sale,
        ]);
    }

    /**
     * Show the form for editing the specified sale.
     */
    public function edit($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->with(['customer', 'currency', 'saleItems.product'])
            ->firstOrFail();

        return Inertia::render('Warehouse/EditSale', [
            'sale' => $sale,
        ]);
    }

    /**
     * Update the specified sale in storage.
     */
    public function update(Request $request, $id)
    {
        // Implementation for updating a sale
        $validated = $request->validate([
            'customer_id' => 'required|exists:customers,id',
            'reference' => 'required|string|max:255',
            'date' => 'required|date',
            'notes' => 'nullable|string',
            'status' => 'required|in:pending,completed,cancelled',
        ]);

        // Implementation for updating the sale record
        return redirect()->route('warehouse.sales')->with('success', 'Sale updated successfully.');
    }

    /**
     * Remove the specified sale from storage.
     */
    public function destroy($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $sale = Sale::where('id', $id)
            ->where('warehouse_id', $warehouse->id)
            ->firstOrFail();

        // Delete the sale
        $sale->delete();

        return redirect()->route('warehouse.sales')->with('success', 'Sale deleted successfully.');
    }
}
