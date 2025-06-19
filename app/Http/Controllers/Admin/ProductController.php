<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProductController extends Controller
{
    use AuthorizesRequests;
    public function index(Request $request)
    {
        $this->authorize('view_any_product');

        $query = Product::with(['wholesaleUnit', 'retailUnit']);

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->has('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            switch ($status) {
                case 'active':
                    $query->where('is_activated', true);
                    break;
                case 'inactive':
                    $query->where('is_activated', false);
                    break;
                case 'in_stock':
                    $query->where('is_in_stock', true);
                    break;
                case 'trending':
                    $query->where('is_trend', true);
                    break;
            }
        }

        // Apply type filter
        if ($request->has('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $products = $query->paginate(10)->withQueryString();

        // Get unique product types for filter
        $productTypes = Product::distinct()->pluck('type')->filter();

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status', 'type', 'sort_field', 'sort_direction']),
            'productTypes' => $productTypes,
            'permissions' => [
                'create_product' => Auth::user()->can('create_product'),
                'update_product' => Auth::user()->can('update_product'),
                'delete_product' => Auth::user()->can('delete_product'),
                'view_product' => Auth::user()->can('view_product'),
            ]
        ]);
    }

    public function create()
    {
        $this->authorize('create_product');

        $units = Unit::all();
        return Inertia::render('Admin/Product/Create', [
            'units' => $units,
            'permissions' => [
                'create_product' => true, // Already authorized
            ]
        ]);
    }

    public function store(Request $request)
    {
        $this->authorize('create_product');

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
            'whole_sale_unit_amount' => 'nullable|numeric|min:0',
            'retails_sale_unit_amount' => 'nullable|numeric|min:0',
        ]);

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    public function edit(Product $product)
    {
        $this->authorize('view_product', $product);

        $units = Unit::all();
        return Inertia::render('Admin/Product/Edit', [
            'product' => $product->load(['wholesaleUnit', 'retailUnit']),
            'units' => $units,
            'auth' => [
                'user' => Auth::guard('web')->user()
            ],
            'permissions' => [
                'view_product' => true, // Already authorized
                'update_product' => Auth::user()->can('update_product', $product),
                'delete_product' => Auth::user()->can('delete_product', $product),
            ]
        ]);
    }

    public function update(Request $request, Product $product)
    {
        $this->authorize('update_product', $product);

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
            'whole_sale_unit_amount' => 'nullable|numeric|min:0',
            'retails_sale_unit_amount' => 'nullable|numeric|min:0',
        ]);

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    public function destroy(Product $product)
    {
        $this->authorize('delete_product', $product);

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    public function restore($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $this->authorize('restore_product', $product);

        $product->restore();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product restored successfully.');
    }

    public function forceDelete($id)
    {
        $product = Product::withTrashed()->findOrFail($id);
        $this->authorize('force_delete_product', $product);

        $product->forceDelete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product permanently deleted.');
    }
}
