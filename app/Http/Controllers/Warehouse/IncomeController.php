<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncomeController extends Controller
{
    /**
     * Display a listing of income records with pagination and filtering.
     */
    public function index(Request $request)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $query = $warehouse->warehouseIncome()->with('product');

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
        $incomeRecords = $query->paginate($perPage)->withQueryString();

        // Transform the data
        $income = $incomeRecords->getCollection()->map(function ($incomeRecord) {
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

        // Replace the collection in the paginator
        $incomeRecords->setCollection($income);

        // Prepare pagination data
        $pagination = [
            'current_page' => $incomeRecords->currentPage(),
            'last_page' => $incomeRecords->lastPage(),
            'per_page' => $incomeRecords->perPage(),
            'total' => $incomeRecords->total(),
            'from' => $incomeRecords->firstItem(),
            'to' => $incomeRecords->lastItem(),
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

        return Inertia::render('Warehouse/Income', [
            'income' => $income,
            'pagination' => $pagination,
            'filters' => $filters,
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

        $incomeRecord = $warehouse->warehouseIncome()->with('product')->findOrFail($id);

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
