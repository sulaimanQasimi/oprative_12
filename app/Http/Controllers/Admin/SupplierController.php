<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SupplierController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:view_any_supplier')->only(['index']);
        $this->middleware('can:view_supplier,supplier')->only(['show']);
        $this->middleware('can:create_supplier')->only(['create', 'store']);
        $this->middleware('can:update_supplier,supplier')->only(['edit', 'update']);
        $this->middleware('can:delete_supplier,supplier')->only(['destroy']);
        $this->middleware('can:restore_supplier,supplier')->only(['restore']);
        $this->middleware('can:force_delete_supplier,supplier')->only(['forceDelete']);
    }
    /**
     * Display the supplier management page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get all suppliers
        $suppliers = Supplier::orderBy('name')->get();

        // Pass permissions to the frontend
        $permissions = [
            'can_create' => Gate::allows('create_supplier'),
            'can_update' => Gate::allows('update_supplier', Supplier::class),
            'can_delete' => Gate::allows('delete_supplier', Supplier::class),
            'can_view' => Gate::allows('view_supplier', Supplier::class),
        ];

        return Inertia::render('Admin/Supplier/Index', [
            'suppliers' => $suppliers,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display the create supplier page
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        $permissions = [
            'can_create' => Gate::allows('create_supplier'),
        ];

        return Inertia::render('Admin/Supplier/Create', [
            'permissions' => $permissions,
        ]);
    }

    /**
     * Store a newly created supplier
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'contact_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'state' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:50',
                'id_number' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Create new supplier
            $supplier = new Supplier();
            $supplier->name = $request->name;
            $supplier->contact_name = $request->contact_name;
            $supplier->email = $request->email;
            $supplier->phone = $request->phone;
            $supplier->address = $request->address;
            $supplier->city = $request->city;
            $supplier->state = $request->state;
            $supplier->country = $request->country;
            $supplier->postal_code = $request->postal_code;
            $supplier->id_number = $request->id_number;
            $supplier->save();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating supplier', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while creating the supplier.')->withInput();
        }
    }

    /**
     * Display the supplier details page
     *
     * @param Supplier $supplier
     * @return \Inertia\Response
     */
    public function show(Supplier $supplier)
    {
        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
            'can_update' => Gate::allows('update_supplier', $supplier),
            'can_delete' => Gate::allows('delete_supplier', $supplier),
        ];

        return Inertia::render('Admin/Supplier/Show', [
            'supplier' => $supplier,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display the edit supplier page
     *
     * @param Supplier $supplier
     * @return \Inertia\Response
     */
    public function edit(Supplier $supplier)
    {
        $permissions = [
            'can_update' => Gate::allows('update_supplier', $supplier),
        ];

        return Inertia::render('Admin/Supplier/Edit', [
            'supplier' => $supplier,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Update the specified supplier
     *
     * @param Request $request
     * @param Supplier $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, Supplier $supplier)
    {
        try {

            // Validate request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:255',
                'contact_name' => 'nullable|string|max:255',
                'email' => 'nullable|email|max:255',
                'phone' => 'nullable|string|max:255',
                'address' => 'nullable|string|max:500',
                'city' => 'nullable|string|max:255',
                'state' => 'nullable|string|max:255',
                'country' => 'nullable|string|max:255',
                'postal_code' => 'nullable|string|max:50',
                'id_number' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Update supplier
            $supplier->name = $request->name;
            $supplier->contact_name = $request->contact_name;
            $supplier->email = $request->email;
            $supplier->phone = $request->phone;
            $supplier->address = $request->address;
            $supplier->city = $request->city;
            $supplier->state = $request->state;
            $supplier->country = $request->country;
            $supplier->postal_code = $request->postal_code;
            $supplier->id_number = $request->id_number;
            $supplier->save();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier updated successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while updating the supplier.')->withInput();
        }
    }

    /**
     * Delete the specified supplier
     *
     * @param Supplier $supplier
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy(Supplier $supplier)
    {
        try {
            $supplier->delete();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier deleted successfully.');
        } catch (\Exception $e) {
            Log::error('Error deleting supplier', [
                'supplier_id' => $supplier->id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')->with('error', 'An error occurred while deleting the supplier.');
        }
    }

    /**
     * Restore the specified supplier
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function restore($id)
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id);
            $supplier->restore();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier restored successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        } catch (\Exception $e) {
            Log::error('Error restoring supplier', [
                'supplier_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')->with('error', 'An error occurred while restoring the supplier.');
        }
    }

    /**
     * Force delete the specified supplier
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function forceDelete($id)
    {
        try {
            $supplier = Supplier::withTrashed()->findOrFail($id);
            $supplier->forceDelete();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier permanently deleted.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        } catch (\Exception $e) {
            Log::error('Error force deleting supplier', [
                'supplier_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')->with('error', 'An error occurred while permanently deleting the supplier.');
        }
    }

    /**
     * Display the supplier payments page
     *
     * @param Supplier $supplier
     * @return \Inertia\Response
     */
    public function payments(Supplier $supplier)
    {
        $payments = $supplier->payments()->orderBy('payment_date', 'desc')->get();

        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
        ];

        return Inertia::render('Admin/Supplier/Payments', [
            'supplier' => $supplier,
            'payments' => $payments,
            'permissions' => $permissions,
        ]);
    }

    /**
     * Display the supplier purchases page
     *
     * @param Supplier $supplier
     * @return \Inertia\Response
     */
    public function purchases(Supplier $supplier)
    {
        $purchases = $supplier->purchases()->orderBy('invoice_date', 'desc')->get();

        $permissions = [
            'can_view' => Gate::allows('view_supplier', $supplier),
        ];

        return Inertia::render('Admin/Supplier/Purchases', [
            'supplier' => $supplier,
            'purchases' => $purchases,
            'permissions' => $permissions,
        ]);
    }
}
