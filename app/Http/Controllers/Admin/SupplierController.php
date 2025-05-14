<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Supplier;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class SupplierController extends Controller
{
    /**
     * Display the supplier management page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get all suppliers
        $suppliers = Supplier::orderBy('name')->get();

        return Inertia::render('Admin/Supplier/Index', [
            'suppliers' => $suppliers
        ]);
    }

    /**
     * Display the create supplier page
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Supplier/Create');
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
     * @param int $id
     * @return \Inertia\Response
     */
    public function show($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

            return Inertia::render('Admin/Supplier/Show', [
                'supplier' => $supplier
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        }
    }

    /**
     * Display the edit supplier page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

            return Inertia::render('Admin/Supplier/Edit', [
                'supplier' => $supplier
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        }
    }

    /**
     * Update the specified supplier
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $supplier = Supplier::findOrFail($id);

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
                'supplier_id' => $id,
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
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $supplier->delete();

            return redirect()->route('admin.suppliers.index')->with('success', 'Supplier deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        } catch (\Exception $e) {
            Log::error('Error deleting supplier', [
                'supplier_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.suppliers.index')->with('error', 'An error occurred while deleting the supplier.');
        }
    }

    /**
     * Display the supplier payments page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function payments($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $payments = $supplier->payments()->orderBy('payment_date', 'desc')->get();

            return Inertia::render('Admin/Supplier/Payments', [
                'supplier' => $supplier,
                'payments' => $payments
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        }
    }

    /**
     * Display the supplier purchases page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function purchases($id)
    {
        try {
            $supplier = Supplier::findOrFail($id);
            $purchases = $supplier->purchases()->orderBy('invoice_date', 'desc')->get();

            return Inertia::render('Admin/Supplier/Purchases', [
                'supplier' => $supplier,
                'purchases' => $purchases
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.suppliers.index')->with('error', 'Supplier not found.');
        }
    }
}
