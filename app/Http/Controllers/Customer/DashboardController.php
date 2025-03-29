<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        // Get the authenticated customer user
        $user = auth('customer_user')->user();

        // You can add more data here as needed
        $data = [
            'user' => $user,
            // Add any additional data you want to pass to the frontend
        ];

        return Inertia::render('Customer/Dashboard', $data);
    }
} 