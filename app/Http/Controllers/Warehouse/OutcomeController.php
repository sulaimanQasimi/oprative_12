<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutcomeController extends Controller
{
    /**
     * Display a listing of outcome records with pagination and filtering.
     */
    public function index(Request $request)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $query = $warehouse->warehouseOutcome()->with('product');

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('notes', 'like', "%{$search}%")
                  ->orWhereHas('product', function($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%");
                  });
            });
        }

        // Apply date filters
        if ($request->filled('date_from')) {
            $query->whereDate('created_at', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('created_at', '<=', $request->date_to);
        }

        // Apply sorting
        $sortBy = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');
        
        // Validate sort column
        $allowedSorts = ['created_at', 'reference_number', 'total', 'quantity', 'price'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }

        // Validate direction
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }

        $query->orderBy($sortBy, $direction);

        // Get per page value
        $perPage = $request->get('per_page', 10);
        if (!in_array($perPage, [10, 25, 50, 100])) {
            $perPage = 10;
        }

        // Paginate results
        $outcomeRecords = $query->paginate($perPage)->withQueryString();

        // Transform the data
        $outcome = $outcomeRecords->getCollection()->map(function ($outcomeRecord) {
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
                'created_at_raw' => $outcomeRecord->created_at->toISOString(), // For Jalali conversion
            ];
        });

        // Replace the collection in the paginator
        $outcomeRecords->setCollection($outcome);

        // Prepare pagination data
        $pagination = [
            'current_page' => $outcomeRecords->currentPage(),
            'last_page' => $outcomeRecords->lastPage(),
            'per_page' => $outcomeRecords->perPage(),
            'total' => $outcomeRecords->total(),
            'from' => $outcomeRecords->firstItem(),
            'to' => $outcomeRecords->lastItem(),
        ];

        // Prepare filters data
        $filters = [
            'search' => $request->search,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'sort' => $sortBy,
            'direction' => $direction,
            'per_page' => $perPage,
        ];

        return Inertia::render('Warehouse/Outcome', [
            'outcome' => $outcome,
            'pagination' => $pagination,
            'filters' => $filters,
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
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        // Get the specific outcome record
        $outcomeRecord = $warehouse->warehouseOutcome()->findOrFail($id);

        // Format the outcome data
        $outcome = [
            'id' => $outcomeRecord->id,
            'reference' => $outcomeRecord->reference_number,
            'amount' => (float) $outcomeRecord->total,
            'quantity' => (float) $outcomeRecord->quantity,
            'price' => (float) $outcomeRecord->price,
            'date' => $outcomeRecord->created_at->format('Y-m-d'),
            'destination' => $outcomeRecord->product ? $outcomeRecord->product->name : 'Unknown',
            'notes' => $outcomeRecord->notes ?? null,
            'created_at' => $outcomeRecord->created_at->diffForHumans(),
            'formatted_date' => $outcomeRecord->created_at->format('d M Y, h:i A'),
        ];

        // Add product details if available
        if ($outcomeRecord->product) {
            $outcome['product_details'] = [
                'name' => $outcomeRecord->product->name,
                'sku' => $outcomeRecord->product->sku ?? 'N/A',
                'category' => $outcomeRecord->product->category->name ?? 'Uncategorized',
                'current_stock' => $outcomeRecord->product->stock ?? 0,
                'unit_price' => $outcomeRecord->product->price ?? 0,
            ];
        }

        // Get related outcome records (other outcomes for the same product)
        $relatedOutcome = [];
        if ($outcomeRecord->product) {
            $relatedOutcome = $warehouse->warehouseOutcome()
                ->where('id', '!=', $id)
                ->where('product_id', $outcomeRecord->product_id)
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

        return Inertia::render('Warehouse/OutcomeDetails', [
            'outcome' => $outcome,
            'relatedOutcome' => $relatedOutcome,
        ]);
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
