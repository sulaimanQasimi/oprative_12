<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\WarehouseIncome;
use Illuminate\Support\Facades\Auth;

class IncomeController extends Controller
{
    public function __construct()
    {
        // $this->middleware('permission:admin.view_warehouse_income');
    }

    /**
     * Display a listing of warehouse income records with filtering, sorting, and pagination.
     */
    public function index(Request $request)
    {
        $query = WarehouseIncome::with(['warehouse', 'product']);

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
        $incomeRecords = $query->paginate($perPage);

        // Transform the data by mapping the paginated items array
        $income = array_map(function ($incomeRecord) {
            return [
                'id' => $incomeRecord->id,
                'reference' => $incomeRecord->reference_number,
                'amount' => (float) $incomeRecord->total,
                'quantity' => (float) $incomeRecord->quantity,
                'price' => (float) $incomeRecord->price,
                'date' => $incomeRecord->created_at->format('Y-m-d'),
                'warehouse' => $incomeRecord->warehouse ? $incomeRecord->warehouse->name : 'Unknown',
                'product' => $incomeRecord->product ? $incomeRecord->product->name : 'Unknown',
                'barcode' => $incomeRecord->product ? $incomeRecord->product->barcode : null,
                'created_at' => $incomeRecord->created_at->diffForHumans(),
                'created_at_raw' => $incomeRecord->created_at->toISOString(),
            ];
        }, $incomeRecords->items());

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

        return Inertia::render('Admin/Warehouse/IncomeIndex', [
            'income' => $income,
            'pagination' => $pagination,
            'filters' => $filters,
        ]);
    }
} 