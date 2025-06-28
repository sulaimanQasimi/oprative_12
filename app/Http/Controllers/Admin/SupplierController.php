<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Supplier\StoreSupplierRequest;
use App\Http\Requests\Admin\Supplier\UpdateSupplierRequest;
use App\Models\Supplier;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\DB;

/**
 * Supplier Controller with comprehensive permissions implementation
 *
 * This controller implements 7 core permissions for supplier management:
 *
 * 1. view_any_supplier - View the supplier list/index page
 * 2. view_supplier - View individual supplier details, payments, and purchases
 * 3. create_supplier - Create new suppliers
 * 4. update_supplier - Edit/update existing suppliers
 * 5. delete_supplier - Soft delete suppliers
 * 6. restore_supplier - Restore soft-deleted suppliers
 * 7. force_delete_supplier - Permanently delete suppliers
 *
 * All methods are protected by middleware and pass appropriate permissions to frontend
 */
class SupplierController extends Controller
{
    /**
     * Display a listing of the resource with filtering and pagination.
     */
    public function index(Request $request): Response
    {
        $this->authorize('view_any_supplier');

        $query = Supplier::query();

        // Filtering
        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Status filter (active, trashed, all)
        $status = $request->input('status', 'active');
        if ($status === 'trashed') {
            $query->onlyTrashed();
        } elseif ($status === 'all') {
            $query->withTrashed();
        }
        // else default is active (no trashed)

        // Sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Pagination
        $perPage = $request->input('per_page', 10);
        $suppliers = $query->paginate($perPage);

        $permissions = [
            'can_view_any' => Gate::allows('view_any_supplier'),
            'can_view' => Gate::allows('view_supplier', Supplier::class),
            'can_create' => Gate::allows('create_supplier'),
            'can_update' => Gate::allows('update_supplier', Supplier::class),
            'can_delete' => Gate::allows('delete_supplier', Supplier::class),
            'can_restore' => Gate::allows('restore_supplier', Supplier::class),
            'can_force_delete' => Gate::allows('force_delete_supplier', Supplier::class),
        ];

        return Inertia::render('Admin/Supplier/Index', [
            'suppliers' => $suppliers,
            'filters' => $request->only(['search', 'status', 'sort_field', 'sort_direction', 'per_page']),
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
    {
        $this->authorize('create_supplier');
        $permissions = [
            'can_create' => Gate::allows('create_supplier'),
            'can_view_any' => Gate::allows('view_any_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreSupplierRequest $request): RedirectResponse
    {
        $this->authorize('create_supplier');
        try {
            $validated = $request->validated();

            Supplier::create($validated);

            return redirect()->route('admin.suppliers.index')
                ->with('success', 'Supplier created successfully.');
        } catch (\Exception $e) {
            Log::error('Error creating supplier', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'An error occurred while creating the supplier.')
                ->withInput();
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(Supplier $supplier): Response
    {
        $this->authorize('view_supplier', $supplier);
        // Get paginated purchases with essential data only
        $purchases = $supplier->purchases()
            ->select('id', 'supplier_id', 'invoice_number', 'invoice_date', 'status', 'created_at')
            ->with(['purchaseItems:purchase_id,total_price', 'payments:purchase_id,amount'])
            ->orderBy('invoice_date', 'desc')
            ->paginate(10, ['*'], 'purchases_page');

        // Get paginated payments with essential data only
        $payments = $supplier->payments()
            ->select('id', 'supplier_id', 'amount', 'payment_method', 'reference_number', 'bank_name', 'payment_date', 'notes')
            ->orderBy('payment_date', 'desc')
            ->paginate(10, ['*'], 'payments_page');

        // Add calculated totals to purchases for display
        $purchases->getCollection()->transform(function ($purchase) {
            $purchase->total_amount = $purchase->purchaseItems->sum('total_price');
            $purchase->paid_amount = $purchase->payments->sum('amount');
            return $purchase;
        });

        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
            'can_update' => Gate::allows('update_supplier', $supplier),
            'can_delete' => Gate::allows('delete_supplier', $supplier),
            'can_restore' => Gate::allows('restore_supplier', $supplier),
            'can_force_delete' => Gate::allows('force_delete_supplier', $supplier),
            'can_create' => Gate::allows('create_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Show', [
            'supplier' => $supplier,
            'purchases' => $purchases,
            'payments' => $payments,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Supplier $supplier): Response
    {
        $this->authorize('update_supplier', $supplier);
        $permissions = [
            'can_update' => Gate::allows('update_supplier', $supplier),
            'can_view' => Gate::allows('view_supplier', $supplier),
            'can_view_any' => Gate::allows('view_any_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Edit', [
            'supplier' => $supplier,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateSupplierRequest $request, Supplier $supplier): RedirectResponse
    {
        $this->authorize('update_supplier', $supplier);
        try {
            $validated = $request->validated();

            $supplier->update($validated);

            return redirect()->route('admin.suppliers.index')
                ->with('success', 'Supplier updated successfully.');
        } catch (\Exception $e) {
            Log::error('Error updating supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()
                ->with('error', 'An error occurred while updating the supplier.')
                ->withInput();
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Supplier $supplier): RedirectResponse
    {
        $this->authorize('delete_supplier', $supplier);
        try {
            $supplier->delete();

            return redirect()->route('admin.suppliers.index')
                ->with('success', 'Supplier deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')
                ->with('error', 'An error occurred while deleting the supplier.');
        }
    }

    /**
     * Restore the specified soft deleted resource.
     */
    public function restore(Supplier $supplier): RedirectResponse
    {
        $this->authorize('restore_supplier', $supplier);
        try {
            $supplier->restore();

            return redirect()->route('admin.suppliers.index')
                ->with('success', 'Supplier restored successfully.');
        } catch (\Exception $e) {
            Log::error('Error restoring supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')
                ->with('error', 'An error occurred while restoring the supplier.');
        }
    }

    /**
     * Permanently delete the specified resource.
     */
    public function forceDelete(Supplier $supplier): RedirectResponse
    {
        $this->authorize('force_delete_supplier', $supplier);
        try {
            $supplier->forceDelete();

            return redirect()->route('admin.suppliers.index')
                ->with('success', 'Supplier permanently deleted.');
        } catch (\Exception $e) {
            Log::error('Error force deleting supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')
                ->with('error', 'An error occurred while permanently deleting the supplier.');
        }
    }

    /**
     * Display the supplier payments page.
     */
    public function payments(Supplier $supplier): Response
    {
        $this->authorize('view_supplier', $supplier);
        $payments = $supplier->payments()
            ->orderBy('payment_date', 'desc')
            ->get();

        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
            'can_create' => Gate::allows('create_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Payments', [
            'supplier' => $supplier,
            'payments' => $payments,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display the supplier purchases page.
     */
    public function purchases(Supplier $supplier): Response
    {
        $this->authorize('view_supplier', $supplier);
        $purchases = $supplier->purchases()
            ->orderBy('invoice_date', 'desc')
            ->get();

        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
            'can_create' => Gate::allows('create_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Purchases', [
            'supplier' => $supplier,
            'purchases' => $purchases,
            'permissions' => $permissions,
        ]);
    }
}
