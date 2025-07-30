<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, Product, Batch, WarehouseIncome, WarehouseOutcome};
use App\Models\WarehouseProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

class OutcomeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = WarehouseOutcome::with(['warehouse', 'product', 'batch']);

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

            // Apply warehouse filter
            if ($request->filled('warehouse_id')) {
                $query->where('warehouse_id', $request->warehouse_id);
            }

            // Apply product filter
            if ($request->filled('product_id')) {
                $query->where('product_id', $request->product_id);
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

            // Transform the data
            $outcomes = $outcomeRecords->map(function ($outcomeRecord) {
                return [
                    'id' => $outcomeRecord->id,
                    'reference_number' => $outcomeRecord->reference_number,
                    'warehouse' => [
                        'id' => $outcomeRecord->warehouse->id,
                        'name' => $outcomeRecord->warehouse->name,
                        'code' => $outcomeRecord->warehouse->code,
                    ],
                    'product' => [
                        'id' => $outcomeRecord->product->id,
                        'name' => $outcomeRecord->product->name,
                        'barcode' => $outcomeRecord->product->barcode,
                        'type' => $outcomeRecord->product->type,
                    ],
                    'batch' => $outcomeRecord->batch ? [
                        'id' => $outcomeRecord->batch->id,
                        'reference_number' => $outcomeRecord->batch->reference_number,
                        'expire_date' => $outcomeRecord->batch->expire_date,
                        'unit_amount' => $outcomeRecord->batch->unit_amount,
                        'unit_name' => $outcomeRecord->batch->unit_name,
                    ] : null,
                    'quantity' => $outcomeRecord->quantity,
                    'price' => $outcomeRecord->price,
                    'total' => $outcomeRecord->total,
                    'unit_type' => $outcomeRecord->unit_type,
                    'unit_name' => $outcomeRecord->unit_name,
                    'unit_amount' => $outcomeRecord->unit_amount,
                    'model_type' => $outcomeRecord->model_type,
                    'model_id' => $outcomeRecord->model_id,
                    'created_at' => $outcomeRecord->created_at,
                    'updated_at' => $outcomeRecord->updated_at,
                ];
            });

            // Get available warehouses for filter
            $availableWarehouses = Warehouse::where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get available products for filter
            $availableProducts = Product::select('id', 'name', 'barcode', 'type')->get();

            // Calculate statistics
            $stats = [
                'total_outcomes' => $outcomeRecords->total(),
                'total_amount' => $outcomeRecords->sum('total'),
                'total_quantity' => $outcomeRecords->sum('quantity'),
                'average_price' => $outcomeRecords->avg('price'),
            ];

            return Inertia::render('Admin/Warehouse/OutcomeIndex', [
                'outcomes' => $outcomes,
                'pagination' => [
                    'current_page' => $outcomeRecords->currentPage(),
                    'last_page' => $outcomeRecords->lastPage(),
                    'per_page' => $outcomeRecords->perPage(),
                    'total' => $outcomeRecords->total(),
                    'from' => $outcomeRecords->firstItem(),
                    'to' => $outcomeRecords->lastItem(),
                ],
                'filters' => [
                    'search' => $request->search,
                    'date_from' => $request->date_from,
                    'date_to' => $request->date_to,
                    'warehouse_id' => $request->warehouse_id,
                    'product_id' => $request->product_id,
                    'sort' => $sortBy,
                    'direction' => $direction,
                    'per_page' => $perPage,
                ],
                'availableWarehouses' => $availableWarehouses,
                'availableProducts' => $availableProducts,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse outcomes: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading warehouse outcomes');
        }
    }

    public function showOutcome(WarehouseOutcome $outcome)
    {
        try {
            $outcome->load([
                'warehouse',
                'product',
                'batch'
            ]);

            return Inertia::render('Admin/Warehouse/ShowOutcome', [
                'outcome' => [
                    'id' => $outcome->id,
                    'reference_number' => $outcome->reference_number,
                    'warehouse' => [
                        'id' => $outcome->warehouse->id,
                        'name' => $outcome->warehouse->name,
                        'code' => $outcome->warehouse->code,
                    ],
                    'product' => [
                        'id' => $outcome->product->id,
                        'name' => $outcome->product->name,
                        'barcode' => $outcome->product->barcode,
                        'type' => $outcome->product->type,
                    ],
                    'batch' => $outcome->batch ? [
                        'id' => $outcome->batch->id,
                        'reference_number' => $outcome->batch->reference_number,
                        'expire_date' => $outcome->batch->expire_date,
                        'unit_amount' => $outcome->batch->unit_amount,
                        'unit_name' => $outcome->batch->unit_name,
                    ] : null,
                    'quantity' => $outcome->quantity,
                    'price' => $outcome->price,
                    'total' => $outcome->total,
                    'unit_type' => $outcome->unit_type,
                    'unit_name' => $outcome->unit_name,
                    'unit_amount' => $outcome->unit_amount,
                    'model_type' => $outcome->model_type,
                    'model_id' => $outcome->model_id,
                    'created_at' => $outcome->created_at,
                    'updated_at' => $outcome->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading outcome details: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading outcome details');
        }
    }

    public function printOutcomeDocument(WarehouseOutcome $outcome)
    {
        try {
            $outcome->load([
                'warehouse',
                'product',
                'batch'
            ]);

            return view('warehouse.outcome-document', [
                'outcome' => $outcome,
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating outcome document: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error generating outcome document');
        }
    }
} 