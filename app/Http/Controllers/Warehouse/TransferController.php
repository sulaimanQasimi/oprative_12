<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\WarehouseTransfer;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class TransferController extends Controller
{
    public function __construct()
    {
        $this->middleware('permission:warehouse.view_transfers');
    }

    /**
     * Display a listing of warehouse transfers with pagination and filtering.
     */
    public function index(Request $request)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $query = WarehouseTransfer::where(function ($q) use ($warehouse) {
            $q->where('from_warehouse_id', $warehouse->id)
                ->orWhere('to_warehouse_id', $warehouse->id);
        })
            ->with(['fromWarehouse', 'toWarehouse', 'creator', 'transferItems.product', 'transferItems.batch']);

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('reference_number', 'like', "%{$search}%")
                    ->orWhere('notes', 'like', "%{$search}%")
                    ->orWhereHas('fromWarehouse', function ($warehouseQuery) use ($search) {
                        $warehouseQuery->where('name', 'like', "%{$search}%");
                    })
                    ->orWhereHas('toWarehouse', function ($warehouseQuery) use ($search) {
                        $warehouseQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply date filters
        if ($request->filled('date_from')) {
            $query->whereDate('transfer_date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->whereDate('transfer_date', '<=', $request->date_to);
        }

        // Apply status filter
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        // Apply sorting
        $sortBy = $request->get('sort', 'created_at');
        $direction = $request->get('direction', 'desc');

        // Validate sort column
        $allowedSorts = ['created_at', 'reference_number', 'transfer_date', 'status', 'total_quantity'];
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
        $transfers = $query->paginate($perPage)->withQueryString();

        // Transform the data
        $transfersData = $transfers->getCollection()->map(function ($transfer) use ($warehouse) {
            $isOutgoing = $transfer->from_warehouse_id === $warehouse->id;
            $isIncoming = $transfer->to_warehouse_id === $warehouse->id;

            return [
                'id' => $transfer->id,
                'reference' => $transfer->reference_number,
                'type' => $isOutgoing ? 'outgoing' : 'incoming',
                'from_warehouse' => $transfer->fromWarehouse ? $transfer->fromWarehouse->name : 'Unknown',
                'to_warehouse' => $transfer->toWarehouse ? $transfer->toWarehouse->name : 'Unknown',
                'status' => $transfer->status,
                'transfer_date' => $transfer->transfer_date ? $transfer->transfer_date->format('Y-m-d') : null,
                'notes' => $transfer->notes,
                'created_at' => $transfer->created_at->diffForHumans(),
                'created_at_raw' => $transfer->created_at->toISOString(),
                'creator' => $transfer->creator ? $transfer->creator->name : 'Unknown',
                'items_count' => $transfer->transferItems->count(),
            ];
        });

        // Replace the collection in the paginatorz
        $transfers->setCollection($transfersData);

        // Prepare pagination data
        $pagination = [
            'current_page' => $transfers->currentPage(),
            'last_page' => $transfers->lastPage(),
            'per_page' => $transfers->perPage(),
            'total' => $transfers->total(),
            'from' => $transfers->firstItem(),
            'to' => $transfers->lastItem(),
        ];

        // Prepare filters data
        $filters = [
            'search' => $request->search,
            'date_from' => $request->date_from,
            'date_to' => $request->date_to,
            'status' => $request->status,
            'sort' => $sortBy,
            'direction' => $direction,
            'per_page' => $perPage,
        ];

        return Inertia::render('Warehouse/Transfer', [
            'transfers' => $transfersData,
            'pagination' => $pagination,
            'filters' => $filters,
        ]);
    }

    /**
     * Display the specified transfer.
     */
    public function show($id)
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $transfer = WarehouseTransfer::where('id', $id)
            ->where(function ($query) use ($warehouse) {
                $query->where('from_warehouse_id', $warehouse->id)
                    ->orWhere('to_warehouse_id', $warehouse->id);
            })
            ->with([
                'fromWarehouse',
                'toWarehouse',
                'creator',
                'transferItems.product',
                'transferItems.batch',
                'transferItems.unit'
            ])
            ->firstOrFail();

        // Transform transfer items
        $transferItems = $transfer->transferItems->map(function ($item) {
            return [
                'id' => $item->id,
                'product' => [
                    'id' => $item->product->id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'unit_name' => $item->unit ? $item->unit->name : 'Unknown',
                ],
                'batch' => $item->batch ? [
                    'id' => $item->batch->id,
                    'name' => $item->batch->name,
                    'code' => $item->batch->code,
                    'expiry_date' => $item->batch->expiry_date ? $item->batch->expiry_date->format('Y-m-d') : null,
                    'manufacturing_date' => $item->batch->manufacturing_date ? $item->batch->manufacturing_date->format('Y-m-d') : null,
                ] : null,
                'quantity' => (float) $item->quantity/$item->batch->unit_amount,
                'unit_name' => $item->batch->unit->name,
                'unit_price' => (float) $item->unit_price,
                'total_price' => (float) $item->total_price,
                'unit_type' => $item->unit_type,
                'notes' => $item->notes,
            ];
        });

        // Determine transfer type
        $isOutgoing = $transfer->from_warehouse_id === $warehouse->id;
        $isIncoming = $transfer->to_warehouse_id === $warehouse->id;

        // Format transfer data
        $transferData = [
            'id' => $transfer->id,
            'reference' => $transfer->reference_number,
            'type' => $isOutgoing ? 'outgoing' : 'incoming',
            'from_warehouse' => [
                'id' => $transfer->fromWarehouse->id,
                'name' => $transfer->fromWarehouse->name,
                'address' => $transfer->fromWarehouse->address,
                'phone' => $transfer->fromWarehouse->phone,
                'email' => $transfer->fromWarehouse->email,
            ],
            'to_warehouse' => [
                'id' => $transfer->toWarehouse->id,
                'name' => $transfer->toWarehouse->name,
                'address' => $transfer->toWarehouse->address,
                'phone' => $transfer->toWarehouse->phone,
                'email' => $transfer->toWarehouse->email,
            ],
            'status' => $transfer->status,
            'transfer_date' => $transfer->transfer_date ? $transfer->transfer_date->format('Y-m-d') : null,
            'completed_at' => $transfer->completed_at ? $transfer->completed_at->format('Y-m-d H:i:s') : null,
            'notes' => $transfer->notes,
            'total_quantity' => $transfer->total_quantity,
            'total_amount' => $transfer->total_amount,
            'created_at' => $transfer->created_at->diffForHumans(),
            'created_at_raw' => $transfer->created_at->toISOString(),
            'creator' => [
                'id' => $transfer->creator->id,
                'name' => $transfer->creator->name,
                'email' => $transfer->creator->email,
            ],
            'items_count' => $transfer->transferItems->count(),
            'transfer_items' => $transferItems,
        ];

        // Pass permissions to the frontend
        $permissions = [
            'view_transfers' => Auth::guard('warehouse_user')->user()->can('warehouse.view_transfers'),
            'view_transfer_details' => Auth::guard('warehouse_user')->user()->can('warehouse.view_transfer_details'),
        ];

        return Inertia::render('Warehouse/ShowTransfer', [
            'transfer' => $transferData,
            'permissions' => $permissions,
            'auth' => [
                'user' => Auth::guard('warehouse_user')->user()->load('warehouse')
            ]
        ]);
    }
}