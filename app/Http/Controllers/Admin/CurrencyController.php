<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Database\Eloquent\ModelNotFoundException;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class CurrencyController extends Controller
{
    /**
     * Display the currency management page
     *
     * @return \Inertia\Response
     */
    public function index()
    {
        // Get all currencies
        $currencies = Currency::orderBy('name')->get();

        return Inertia::render('Admin/Currency/Index', [
            'currencies' => $currencies
        ]);
    }

    /**
     * Display the create currency page
     *
     * @return \Inertia\Response
     */
    public function create()
    {
        return Inertia::render('Admin/Currency/Create');
    }

    /**
     * Store a newly created currency
     *
     * @param Request $request
     * @return \Illuminate\Http\RedirectResponse
     */
    public function store(Request $request)
    {
        try {
            // Validate request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'code' => 'required|string|max:10|unique:currencies,code',
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Create new currency
            $currency = new Currency();
            $currency->name = $request->name;
            $currency->code = $request->code;
            $currency->save();

            return redirect()->route('admin.currencies.index')->with('success', 'Currency created successfully.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error creating currency', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while creating the currency.')->withInput();
        }
    }

    /**
     * Display the edit currency page
     *
     * @param int $id
     * @return \Inertia\Response
     */
    public function edit($id)
    {
        try {
            $currency = Currency::findOrFail($id);

            return Inertia::render('Admin/Currency/Edit', [
                'currency' => $currency
            ]);
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.currencies.index')->with('error', 'Currency not found.');
        }
    }

    /**
     * Update the specified currency
     *
     * @param Request $request
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function update(Request $request, $id)
    {
        try {
            $currency = Currency::findOrFail($id);

            // Validate request data
            $validator = Validator::make($request->all(), [
                'name' => 'required|string|max:100',
                'code' => 'required|string|max:10|unique:currencies,code,' . $id,
            ]);

            if ($validator->fails()) {
                return redirect()->back()->withErrors($validator)->withInput();
            }

            // Update currency
            $currency->name = $request->name;
            $currency->code = $request->code;
            $currency->save();

            return redirect()->route('admin.currencies.index')->with('success', 'Currency updated successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.currencies.index')->with('error', 'Currency not found.');
        } catch (ValidationException $e) {
            return redirect()->back()->withErrors($e->errors())->withInput();
        } catch (\Exception $e) {
            Log::error('Error updating currency', [
                'currency_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->back()->with('error', 'An error occurred while updating the currency.')->withInput();
        }
    }

    /**
     * Delete the specified currency
     *
     * @param int $id
     * @return \Illuminate\Http\RedirectResponse
     */
    public function destroy($id)
    {
        try {
            $currency = Currency::findOrFail($id);
            $currency->delete();

            return redirect()->route('admin.currencies.index')->with('success', 'Currency deleted successfully.');
        } catch (ModelNotFoundException $e) {
            return redirect()->route('admin.currencies.index')->with('error', 'Currency not found.');
        } catch (\Exception $e) {
            Log::error('Error deleting currency', [
                'currency_id' => $id,
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::id(),
            ]);

            return redirect()->route('admin.currencies.index')->with('error', 'An error occurred while deleting the currency.');
        }
    }
}
