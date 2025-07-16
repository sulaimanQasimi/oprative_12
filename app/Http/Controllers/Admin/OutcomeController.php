<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\WarehouseOutcome;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class OutcomeController extends Controller
{
    public function __construct()
    {
        // $this->middleware('permission:admin.view_warehouse_outcome');
    }

    /**
     * Display a listing of warehouse outcome records with filtering, sorting, and pagination.
     */
    public function index(Request $request)
    {
        $query = WarehouseOutcome::with(['warehouse', 'product']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                  ->orWhere('id', 'like', "%{$search}%")
                  ->orWhereHas('warehouse', function ($warehouseQuery) use ($search) {
                      $warehouseQuery->where('name', 'like', "%{$search}%")
                                    ->orWhere('code', 'like', "%{$search}%");
                  })
                  ->orWhereHas('product', function ($productQuery) use ($search) {
                      $productQuery->where('name', 'like', "%{$search}%")
                                  ->orWhere('barcode', 'like', "%{$search}%");
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
        $allowedSorts = ['created_at', 'reference_number', 'total', 'quantity', 'price', 'id'];
        if (!in_array($sortBy, $allowedSorts)) {
            $sortBy = 'created_at';
        }
        if (!in_array($direction, ['asc', 'desc'])) {
            $direction = 'desc';
        }
        $query->orderBy($sortBy, $direction);

        // Get per page value
        $perPage = $request->get('per_page', 15);
        if (!in_array($perPage, [10, 15, 25, 50, 100])) {
            $perPage = 15;
        }

        // Paginate results
        $outcomeRecords = $query->paginate($perPage);

        // Transform the data by mapping the paginated items array
        $outcomes = array_map(function ($outcomeRecord) {
            return [
                'id' => $outcomeRecord->id,
                'reference' => $outcomeRecord->reference_number,
                'amount' => (float) $outcomeRecord->total,
                'quantity' => (float) $outcomeRecord->quantity,
                'price' => (float) $outcomeRecord->price,
                'date' => $outcomeRecord->created_at->format('Y-m-d'),
                'warehouse' => $outcomeRecord->warehouse ? $outcomeRecord->warehouse->name : 'Unknown',
                'product' => $outcomeRecord->product ? $outcomeRecord->product->name : 'Unknown',
                'barcode' => $outcomeRecord->product ? $outcomeRecord->product->barcode : null,
                'created_at' => $outcomeRecord->created_at->diffForHumans(),
                'created_at_raw' => $outcomeRecord->created_at->toISOString(),
            ];
        }, $outcomeRecords->items());

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

        return Inertia::render('Admin/Warehouse/OutcomeIndex', [
            'outcomes' => $outcomes,
            'pagination' => $pagination,
            'filters' => $filters,
        ]);
    }
} 