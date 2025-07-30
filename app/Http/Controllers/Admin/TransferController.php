<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Warehouse, Product, Batch, WarehouseTransfer, TransferItem};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

class TransferController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = WarehouseTransfer::with(['fromWarehouse', 'toWarehouse', 'transferItems.product', 'transferItems.batch', 'creator']);

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                      ->orWhere('id', 'like', "%{$search}%")
                      ->orWhereHas('fromWarehouse', function ($warehouseQuery) use ($search) {
                          $warehouseQuery->where('name', 'like', "%{$search}%")
                                        ->orWhere('code', 'like', "%{$search}%");
                      })
                      ->orWhereHas('toWarehouse', function ($warehouseQuery) use ($search) {
                          $warehouseQuery->where('name', 'like', "%{$search}%")
                                        ->orWhere('code', 'like', "%{$search}%");
                      })
                      ->orWhereHas('transferItems.product', function ($productQuery) use ($search) {
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

            // Apply warehouse filters
            if ($request->filled('from_warehouse_id')) {
                $query->where('from_warehouse_id', $request->from_warehouse_id);
            }
            if ($request->filled('to_warehouse_id')) {
                $query->where('to_warehouse_id', $request->to_warehouse_id);
            }

            // Apply product filter
            if ($request->filled('product_id')) {
                $query->whereHas('transferItems', function ($q) use ($request) {
                    $q->where('product_id', $request->product_id);
                });
            }

            // Apply status filter
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Apply sorting
            $sortBy = $request->get('sort', 'created_at');
            $direction = $request->get('direction', 'desc');
            $allowedSorts = ['created_at', 'reference_number', 'total_amount', 'total_quantity', 'status', 'id'];
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
            $transferRecords = $query->paginate($perPage);

            // Transform the data
            $transfers = $transferRecords->map(function ($transferRecord) {
                return [
                    'id' => $transferRecord->id,
                    'reference_number' => $transferRecord->reference_number,
                    'from_warehouse' => [
                        'id' => $transferRecord->fromWarehouse->id,
                        'name' => $transferRecord->fromWarehouse->name,
                        'code' => $transferRecord->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transferRecord->toWarehouse->id,
                        'name' => $transferRecord->toWarehouse->name,
                        'code' => $transferRecord->toWarehouse->code,
                    ],
                    'status' => $transferRecord->status,
                    'notes' => $transferRecord->notes,
                    'created_by' => $transferRecord->creator ? [
                        'id' => $transferRecord->creator->id,
                        'name' => $transferRecord->creator->name,
                    ] : null,
                    'transfer_date' => $transferRecord->transfer_date,
                    'completed_at' => $transferRecord->completed_at,
                    'total_amount' => $transferRecord->total_amount,
                    'total_quantity' => $transferRecord->total_quantity,
                    'items_count' => $transferRecord->transferItems->count(),
                    'transfer_items' => $transferRecord->transferItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'barcode' => $item->product->barcode,
                                'type' => $item->product->type,
                            ],
                            'batch' => $item->batch ? [
                                'id' => $item->batch->id,
                                'reference_number' => $item->batch->reference_number,
                                'expire_date' => $item->batch->expire_date,
                            ] : null,
                            'quantity' => $item->quantity,
                            'unit_type' => $item->unit_type,
                            'unit_name' => $item->unit_name,
                            'unit_amount' => $item->unit_amount,
                        ];
                    }),
                    'created_at' => $transferRecord->created_at,
                    'updated_at' => $transferRecord->updated_at,
                ];
            });

            // Get available warehouses for filter
            $availableWarehouses = Warehouse::where('is_active', true)
                ->get(['id', 'name', 'code']);

            // Get available products for filter
            $availableProducts = Product::select('id', 'name', 'barcode', 'type')->get();

            // Calculate statistics
            $stats = [
                'total_transfers' => $transferRecords->total(),
                'total_amount' => $transferRecords->sum('total_amount'),
                'total_quantity' => $transferRecords->sum('total_quantity'),
                'pending_transfers' => $transferRecords->where('status', 'pending')->count(),
                'completed_transfers' => $transferRecords->where('status', 'completed')->count(),
            ];

            return Inertia::render('Admin/Warehouse/TransferIndex', [
                'transfers' => $transfers,
                'pagination' => [
                    'current_page' => $transferRecords->currentPage(),
                    'last_page' => $transferRecords->lastPage(),
                    'per_page' => $transferRecords->perPage(),
                    'total' => $transferRecords->total(),
                    'from' => $transferRecords->firstItem(),
                    'to' => $transferRecords->lastItem(),
                ],
                'filters' => [
                    'search' => $request->search,
                    'date_from' => $request->date_from,
                    'date_to' => $request->date_to,
                    'from_warehouse_id' => $request->from_warehouse_id,
                    'to_warehouse_id' => $request->to_warehouse_id,
                    'product_id' => $request->product_id,
                    'status' => $request->status,
                    'sort' => $sortBy,
                    'direction' => $direction,
                    'per_page' => $perPage,
                ],
                'availableWarehouses' => $availableWarehouses,
                'availableProducts' => $availableProducts,
                'stats' => $stats,
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading warehouse transfers: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading warehouse transfers');
        }
    }

    public function showTransfer(WarehouseTransfer $transfer)
    {
        try {
            $transfer->load([
                'fromWarehouse',
                'toWarehouse',
                'transferItems.product',
                'transferItems.batch',
                'creator'
            ]);

            return Inertia::render('Admin/Warehouse/ShowTransfer', [
                'transfer' => [
                    'id' => $transfer->id,
                    'reference_number' => $transfer->reference_number,
                    'from_warehouse' => [
                        'id' => $transfer->fromWarehouse->id,
                        'name' => $transfer->fromWarehouse->name,
                        'code' => $transfer->fromWarehouse->code,
                    ],
                    'to_warehouse' => [
                        'id' => $transfer->toWarehouse->id,
                        'name' => $transfer->toWarehouse->name,
                        'code' => $transfer->toWarehouse->code,
                    ],
                    'status' => $transfer->status,
                    'notes' => $transfer->notes,
                    'created_by' => $transfer->creator ? [
                        'id' => $transfer->creator->id,
                        'name' => $transfer->creator->name,
                    ] : null,
                    'transfer_date' => $transfer->transfer_date,
                    'completed_at' => $transfer->completed_at,
                    'total_amount' => $transfer->total_amount,
                    'total_quantity' => $transfer->total_quantity,
                    'transfer_items' => $transfer->transferItems->map(function ($item) {
                        return [
                            'id' => $item->id,
                            'product' => [
                                'id' => $item->product->id,
                                'name' => $item->product->name,
                                'barcode' => $item->product->barcode,
                                'type' => $item->product->type,
                            ],
                            'batch' => $item->batch ? [
                                'id' => $item->batch->id,
                                'reference_number' => $item->batch->reference_number,
                                'expire_date' => $item->batch->expire_date,
                            ] : null,
                            'quantity' => $item->quantity,
                            'unit_type' => $item->unit_type,
                            'unit_name' => $item->unit_name,
                            'unit_amount' => $item->unit_amount,
                        ];
                    }),
                    'created_at' => $transfer->created_at,
                    'updated_at' => $transfer->updated_at,
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error loading transfer details: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error loading transfer details');
        }
    }

    public function printTransferDocument(WarehouseTransfer $transfer)
    {
        try {
            $transfer->load([
                'fromWarehouse',
                'toWarehouse',
                'transferItems.product',
                'transferItems.batch',
                'creator'
            ]);

            return view('warehouse.transfer-document', [
                'transfer' => $transfer,
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating transfer document: ' . $e->getMessage());
            return redirect()->back()->with('error', 'Error generating transfer document');
        }
    }
} 