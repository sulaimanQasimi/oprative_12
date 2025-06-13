<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Warehouse;
use App\Models\Customer;
use App\Models\Unit;
use Inertia\Inertia;

class DashboardController extends Controller
{
    /**
     * Display the admin dashboard.
     */
    public function index()
    {
        // Get stats for dashboard
        $stats = [
            'products' => Product::count(),
            'warehouses' => Warehouse::count(),
            'shops' => Customer::count(), // Assuming customers are shops
            'units' => Unit::count(),
        ];

        // Recent activity data
        $recentProducts = Product::query()
            ->latest()
            ->take(5)
            ->get();

        $recentWarehouses = Warehouse::latest()
            ->take(5)
            ->get();

        $recentCustomers = Customer::latest()
            ->take(5)
            ->get();

        return Inertia::render('Admin/Dashboard', [
            'stats' => $stats,
            'recentProducts' => $recentProducts,
            'recentWarehouses' => $recentWarehouses,
            'recentCustomers' => $recentCustomers,
        ]);
    }
} 