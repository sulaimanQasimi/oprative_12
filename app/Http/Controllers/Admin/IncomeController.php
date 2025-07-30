<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, Product, Batch, WarehouseIncome, WarehouseOutcome};
use App\Models\WarehouseProduct;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

class IncomeController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = WarehouseIncome::with(['warehouse', 'product', 'batch']);

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
            $incomeRecords = $query->paginate($perPage);

            // Transform the data
            $incomes = $incomeRecords->map(function ($incomeRecord) {
                return [
                    'id' => $incomeRecord->id,
                    'reference_number' => $incomeRecord->reference_number,
                    'warehouse' => [
                        'id' => $incomeRecord->warehouse->id,
                        'name' => $incomeRecord->warehouse->name,
                        'code' => $incomeRecord->warehouse->code,
                    ],
                    'product' => [
                        'id' => $incomeRecord->product->id,
                        'name' => $incomeRecord->product->name,
                        'barcode' => $incomeRecord->product->barcode,
                        'type' => $incomeRecord->product->type,
                    ],
                    'batch' => $incomeRecord->batch ? [
                        'id' => $incomeRecord->batch->id,
                        'reference_number' => $incomeRecord->batch->reference_number,
                        'expire_date' => $incomeRecord->batch->expire_date,
                        'unit_amount' => $incomeRecord->batch->unit_amount,
                        'unit_name' => $incomeRecord->batch->unit_name,
                    ] : null,
                    'quantity' => $incomeRecord->quantity,
                    'price' => $incomeRecord->price,
                    'total' => $incomeRecord->total,
                    'unit_type' => $incomeRecord->unit_type,
                    'unit_name' => $incomeRecord->unit_name,
                    'unit_amount' => $incomeRecord->unit_amount,
                    'model_type' => $incomeRecord->model_type,
                    'model_id' => $incomeRecord->model_id,
                    'created_at' => $incomeRecord->created_at,
                    'updated_at' => $incomeRecord->updated_at,
                ];
            });

            // Get available warehouses for filter
            $availableWarehouses = Warehouse::where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get available products for filter
            $availableProducts = Product::select('id', 'name', 'barcode', 'type')->get();

            // Calculate statistics
            $stats = [
                'total_incomes' => $incomeRecords->total(),
                'total_amount' => $incomeRecords->sum('total'),
                'total_quantity' => $incomeRecords->sum('quantity'),
                'average_price' => $incomeRecords->avg('price'),
            ];

            return Inertia::render('Admin/Warehouse/IncomeIndex', [
                'incomes' => $incomes,
                'pagination' => [
                    'current_page' => $incomeRecords->currentPage(),
                    'last_page' => $incomeRecords->lastPage(),
                    'per_page' => $incomeRecords->perPage(),
                    'total' => $incomeRecords->total(),
                    'from' => $incomeRecords->firstItem(),
                    'to' => $incomeRecords->lastItem(),
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
            Log::error('Error loading warehouse incomes: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading warehouse incomes');
        }
    }

    public function showIncome(WarehouseIncome $income)
    {
        try {
            $income->load([
                'warehouse',
                'product',
                'batch'
            ]);

            return Inertia::render('Admin/Warehouse/ShowIncome', [
                'income' => [
                    'id' => $income->id,
                    'reference_number' => $income->reference_number,
                    'warehouse' => [
                        'id' => $income->warehouse->id,
                        'name' => $income->warehouse->name,
                        'code' => $income->warehouse->code,
                    ],
                    'product' => [
                        'id' => $income->product->id,
                        'name' => $income->product->name,
                        'barcode' => $income->product->barcode,
                        'type' => $income->product->type,
                    ],
                    'batch' => $income->batch ? [
                        'id' => $income->batch->id,
                        'reference_number' => $income->batch->reference_number,
                        'expire_date' => $income->batch->expire_date,
                    ] : null,
                    'quantity' => $income->quantity,
                    'price' => $income->price,
                    'total' => $income->total,
                    'unit_type' => $income->unit_type,
                    'unit_name' => $income->unit_name,
                    'unit_amount' => $income->unit_amount,
                    'model_type' => $income->model_type,
                    'model_id' => $income->model_id,
                    'created_at' => $income->created_at,
                    'updated_at' => $income->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading income details: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading income details');
        }
    }

    public function printIncomeDocument(WarehouseIncome $income)
    {
        try {
            $income->load([
                'warehouse',
                'product',
                'batch'
            ]);

            return view('warehouse.income-document', [
                'income' => $income,
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating income document: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error generating income document');
        }
    }
} 