<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MarketOrder;
use Illuminate\Http\Request;

class InvoiceController extends Controller
{
    public function __invoke(MarketOrder $order)
    {
        // Ensure the order belongs to the authenticated customer
        if ($order->customer_id !== auth()->guard('customer')->id()) {
            abort(403);
        }

        return view('customer.invoice', compact('order'));
    }
}