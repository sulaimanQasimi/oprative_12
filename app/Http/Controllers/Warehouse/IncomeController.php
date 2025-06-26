<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class IncomeController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:warehouse.view_income');
    }

    /**
     * Display a listing of import records with pagination and filtering.
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
                'created_at_raw' => $incomeRecord->created_at->toISOString(), // For Jalali conversion
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

    // Note: All other methods (create, store, show, edit, update, destroy) have been removed
    // as this controller now only supports read-only listing functionality
}
