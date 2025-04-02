<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class ProductController extends Controller
{
    /**
     * Display a listing of products.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $products = $warehouse->products()->with(['category'])->get()->map(function ($product) {
            return [
                'id' => $product->id,
                'name' => $product->name,
                'sku' => $product->sku,
                'quantity' => $product->pivot->quantity,
                'minimum_quantity' => $product->pivot->minimum_quantity,
                'maximum_quantity' => $product->pivot->maximum_quantity,
                'is_active' => $product->pivot->is_active,
                'price' => $product->price,
                'category' => $product->category ? $product->category->name : 'Uncategorized',
            ];
        });

        return Inertia::render('Warehouse/Products', [
            'products' => $products,
        ]);
    }

    /**
     * Show the form for creating a new product.
     */
    public function create()
    {
        // Implementation for create form
    }

    /**
     * Store a newly created product in storage.
     */
    public function store(Request $request)
    {
        // Implementation for storing a product
    }

    /**
     * Display the specified product.
     */
    public function show($id)
    {
        // Implementation for showing a product
    }

    /**
     * Show the form for editing the specified product.
     */
    public function edit($id)
    {
        // Implementation for edit form
    }

    /**
     * Update the specified product in storage.
     */
    public function update(Request $request, $id)
    {
        // Implementation for updating a product
    }

    /**
     * Remove the specified product from storage.
     */
    public function destroy($id)
    {
        // Implementation for deleting a product
    }
}
