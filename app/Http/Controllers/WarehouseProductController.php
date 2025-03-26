<?php

namespace App\Http\Controllers;

use App\Models\WarehouseProduct;
use Illuminate\Http\Request;

class WarehouseProductController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = WarehouseProduct::with(['product', 'warehouse'])
                ->orderBy('net_quantity', 'desc');

            $perPage = 9; // Number of products per page
            $products = $query->paginate($perPage);

            if ($request->ajax()) {
                $view = view('partials.warehouse-products', compact('products'))->render();
                return response()->json([
                    'html' => $view,
                    'hasMorePages' => $products->hasMorePages()
                ]);
            }

            // For both landing page and warehouse-products endpoint
            return view('landing', compact('products'));
        } catch (\Exception $e) {
            \Log::error('Error in WarehouseProductController: ' . $e->getMessage());
            return view('landing', ['products' => collect([])]);
        }
    }
}
