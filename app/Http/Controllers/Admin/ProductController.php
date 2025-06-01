<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::with(['wholesaleUnit', 'retailUnit'])->latest()->get();
        return Inertia::render('Admin/Product/Index', [
            'products' => $products
        ]);
    }

    public function create()
    {
        $units = Unit::all();
        return Inertia::render('Admin/Product/Create', [
            'units' => $units
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'wholesale_price' => 'required|numeric|min:0',
            'retail_price' => 'required|numeric|min:0',
            'is_activated' => 'boolean',
            'is_in_stock' => 'boolean',
            'is_shipped' => 'boolean',
            'is_trend' => 'boolean',
            'wholesale_unit_id' => 'required|exists:units,id',
            'retail_unit_id' => 'required|exists:units,id',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $units = Unit::all();
        return Inertia::render('Admin/Product/Edit', [
            'product' => $product->load(['wholesaleUnit', 'retailUnit']),
            'units' => $units,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ]
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $validated = $request->validate([
            'type' => 'required|string',
            'name' => 'required|string|max:255',
            'barcode' => 'nullable|string|max:255',
            'purchase_price' => 'required|numeric|min:0',
            'wholesale_price' => 'required|numeric|min:0',
            'retail_price' => 'required|numeric|min:0',
            'is_activated' => 'boolean',
            'is_in_stock' => 'boolean',
            'is_shipped' => 'boolean',
            'is_trend' => 'boolean',
            'wholesale_unit_id' => 'required|exists:units,id',
            'retail_unit_id' => 'required|exists:units,id',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }
}
