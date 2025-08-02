<?php
namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Customer;

class CustomerController extends Controller
{
    /**
     * @group Customer Management
     *
     * APIs for selecting customers
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     *
     * @queryParam search string Search for customers by name or email.
     *
     */
    public function select(Request $request)
    {
        $customers = Customer::select('id', 'name', 'email')
            ->where('name', 'like', '%' . $request->search . '%')
            ->when($request->has('except'), function ($query) use ($request) {
                $query->whereNot('id',  $request->except);
            })
            ->get()->map( fn($customer)=> [
                    'value' => $customer->id,
                    'label' => $customer->name . ' (' . $customer->email . ')',
                    'subtitle' => $customer->email,
                ]
            );
        return response()->json($customers);
    }
}