<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutcomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:warehouse.view_outcome');
    }

    /**
     * Display a listing of outcome records with pagination and filtering using optimized queries.
     */
    public function index(Request $request)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        // Start with base query
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

        // Apply date range filters
        if ($request->filled('from_date')) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->filled('to_date')) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        // Legacy date filters (keep for backward compatibility)
        if ($request->filled('year') && !$request->filled('from_date') && !$request->filled('to_date')) {
            $query->whereYear('created_at', $request->year);
        }

        if ($request->filled('month') && $request->filled('year') && !$request->filled('from_date') && !$request->filled('to_date')) {
            $query->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
        }

        if ($request->filled('day') && $request->filled('month') && $request->filled('year') && !$request->filled('from_date') && !$request->filled('to_date')) {
            $query->whereDay('created_at', $request->day)
                  ->whereMonth('created_at', $request->month)
                  ->whereYear('created_at', $request->year);
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

        // Paginate results with optimized query
        $outcomeRecords = $query->paginate($perPage)->withQueryString();

        // Transform the data
        $outcome = $outcomeRecords->getCollection()->map(function ($outcomeRecord) {
            return [
                'id' => $outcomeRecord->id,
                'reference' => $outcomeRecord->reference_number,
                'amount' => (float) $outcomeRecord->total,
                'quantity' => (float) $outcomeRecord->quantity/$outcomeRecord->batch->unit_amount,
                'unit_name' => $outcomeRecord->batch->unit->name,
                'batch' => $outcomeRecord->batch,
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
            'from_date' => $request->from_date,
            'to_date' => $request->to_date,
            'year' => $request->year,
            'month' => $request->month,
            'day' => $request->day,
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


}
