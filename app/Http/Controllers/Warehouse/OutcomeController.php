<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutcomeController extends Controller
{
    /**
     * Display a listing of outcome records.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $outcome = $warehouse->warehouseOutcome()->get()->map(function ($outcomeRecord) {
            return [
                'id' => $outcomeRecord->id,
                'reference' => $outcomeRecord->reference_number,
                'amount' => (float) $outcomeRecord->total,
                'quantity' => (float) $outcomeRecord->quantity,
                'price' => (float) $outcomeRecord->price,
                'date' => $outcomeRecord->created_at->format('Y-m-d'),
                'destination' => $outcomeRecord->product ? $outcomeRecord->product->name : 'Unknown',
                'notes' => $outcomeRecord->notes ?? null,
                'created_at' => $outcomeRecord->created_at->diffForHumans(),
            ];
        });
        return Inertia::render('Warehouse/Outcome', [
            'outcome' => $outcome,
        ]);
    }

    /**
     * Show the form for creating a new outcome record.
     */
    public function create()
    {
        // Implementation for create form
    }

    /**
     * Store a newly created outcome record in storage.
     */
    public function store(Request $request)
    {
        // Implementation for storing an outcome record
    }

    /**
     * Display the specified outcome record.
     */
    public function show($id)
    {
        // Implementation for showing an outcome record
    }

    /**
     * Show the form for editing the specified outcome record.
     */
    public function edit($id)
    {
        // Implementation for edit form
    }

    /**
     * Update the specified outcome record in storage.
     */
    public function update(Request $request, $id)
    {
        // Implementation for updating an outcome record
    }

    /**
     * Remove the specified outcome record from storage.
     */
    public function destroy($id)
    {
        // Implementation for deleting an outcome record
    }
}
