<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncomeController extends Controller
{
    /**
     * Display a listing of income records.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $income = $warehouse->warehouseIncome()->get()->map(function ($incomeRecord) {
            return [
                'id' => $incomeRecord->id,
                'reference' => $incomeRecord->reference_number,
                'amount' => (float) $incomeRecord->total,
                'quantity' => (float) $incomeRecord->quantity,
                'price' => (float) $incomeRecord->price,
                'date' => $incomeRecord->created_at->format('Y-m-d'),
                'source' => $incomeRecord->product ? $incomeRecord->product->name : 'Unknown',
                'notes' => $incomeRecord->notes ?? null,
                'created_at' => $incomeRecord->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Warehouse/Income', [
            'income' => $income,
        ]);
    }

    /**
     * Show the form for creating a new income record.
     */
    public function create()
    {
        // Implementation for create form
    }

    /**
     * Store a newly created income record in storage.
     */
    public function store(Request $request)
    {
        // Implementation for storing an income record
    }

    /**
     * Display the specified income record.
     */
    public function show($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $incomeRecord = $warehouse->warehouseIncome()->findOrFail($id);

        $income = [
            'id' => $incomeRecord->id,
            'reference' => $incomeRecord->reference_number,
            'amount' => (float) $incomeRecord->total,
            'quantity' => (float) $incomeRecord->quantity,
            'price' => (float) $incomeRecord->price,
            'date' => $incomeRecord->created_at->format('Y-m-d'),
            'created_at' => $incomeRecord->created_at->format('Y-m-d H:i:s'),
            'formatted_date' => $incomeRecord->created_at->diffForHumans(),
            'source' => $incomeRecord->product ? $incomeRecord->product->name : 'Unknown',
            'product_id' => $incomeRecord->product ? $incomeRecord->product->id : null,
            'product_details' => $incomeRecord->product ? [
                'id' => $incomeRecord->product->id,
                'name' => $incomeRecord->product->name,
                'sku' => $incomeRecord->product->sku,
                'category' => $incomeRecord->product->category ? $incomeRecord->product->category->name : null,
                'current_stock' => $incomeRecord->product->stock,
                'unit_price' => $incomeRecord->product->price,
            ] : null,
            'notes' => $incomeRecord->notes ?? null,
            'created_by' => $incomeRecord->user ? [
                'id' => $incomeRecord->user->id,
                'name' => $incomeRecord->user->name,
            ] : null,
            'updated_at' => $incomeRecord->updated_at->diffForHumans(),
        ];

        // Get related income records for the same product
        $relatedIncome = [];
        if ($incomeRecord->product) {
            $relatedIncome = $warehouse->warehouseIncome()
                ->where('product_id', $incomeRecord->product_id)
                ->where('id', '!=', $incomeRecord->id)
                ->latest()
                ->take(5)
                ->get()
                ->map(function ($record) {
                    return [
                        'id' => $record->id,
                        'reference' => $record->reference_number,
                        'amount' => (float) $record->total,
                        'quantity' => (float) $record->quantity,
                        'date' => $record->created_at->format('Y-m-d'),
                        'created_at' => $record->created_at->diffForHumans(),
                    ];
                });
        }

        return Inertia::render('Warehouse/IncomeDetails', [
            'income' => $income,
            'relatedIncome' => $relatedIncome,
        ]);
    }

    /**
     * Show the form for editing the specified income record.
     */
    public function edit($id)
    {
        // Implementation for edit form
    }

    /**
     * Update the specified income record in storage.
     */
    public function update(Request $request, $id)
    {
        // Implementation for updating an income record
    }

    /**
     * Remove the specified income record from storage.
     */
    public function destroy($id)
    {
        // Implementation for deleting an income record
    }
}
