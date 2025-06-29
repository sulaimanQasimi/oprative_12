<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Requests\Admin\Product\StoreProductRequest;
use App\Http\Requests\Admin\Product\UpdateProductRequest;
use App\Models\Product;
use App\Models\Unit;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\View\View;
use Inertia\Inertia;
use Inertia\Response;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class ProductController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request): Response
    {
        $this->authorize('view_any_product');

        $query = Product::with(['wholesaleUnit', 'retailUnit']);

        // Include trashed products if requested
        if ($request->input('show_trashed') === 'true') {
            $query->withTrashed();
        } elseif ($request->input('show_trashed') === 'only') {
            $query->onlyTrashed();
        }

        // Apply search filter
        if ($request->filled('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhere('barcode', 'like', "%{$search}%")
                    ->orWhere('type', 'like', "%{$search}%");
            });
        }

        // Apply status filter
        if ($request->filled('status') && $request->input('status') !== 'all') {
            $status = $request->input('status');
            match ($status) {
                'active' => $query->where('is_activated', true),
                'inactive' => $query->where('is_activated', false),
                'in_stock' => $query->where('is_in_stock', true),
                'trending' => $query->where('is_trend', true),
                default => null,
            };
        }

        // Apply type filter
        if ($request->filled('type') && $request->input('type') !== 'all') {
            $query->where('type', $request->input('type'));
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $products = $query->paginate(10);

        // Get unique product types for filter
        $productTypes = Product::distinct()->pluck('type')->filter();

        return Inertia::render('Admin/Product/Index', [
            'products' => $products,
            'filters' => $request->only(['search', 'status', 'type', 'sort_field', 'sort_direction', 'show_trashed']),
            'productTypes' => $productTypes,
            'permissions' => [
                'create_product' => Auth::user()->can('create_product'),
                'update_product' => Auth::user()->can('update_product'),
                'delete_product' => Auth::user()->can('delete_product'),
                'view_product' => Auth::user()->can('view_product'),
                'restore_product' => Auth::user()->can('restore_product'),
                'force_delete_product' => Auth::user()->can('force_delete_product'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create(): Response
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

    /**
     * Store a newly created resource in storage.
     */
    public function store(StoreProductRequest $request): RedirectResponse
    {
        $validated = $request->validated();

        Product::create($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product created successfully.');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Product $product): Response
    {
        $this->authorize('update_product', $product);

        $units = Unit::all();

        return Inertia::render('Admin/Product/Edit', [
            'product' => $product->load(['wholesaleUnit', 'retailUnit']),
            'units' => $units,
            'permissions' => [
                'view_product' => Auth::user()->can('view_product', $product),
                'update_product' => true, // Already authorized
                'delete_product' => Auth::user()->can('delete_product', $product),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(UpdateProductRequest $request, Product $product): RedirectResponse
    {
        $validated = $request->validated();

        $product->update($validated);

        return redirect()->route('admin.products.index')
            ->with('success', 'Product updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Product $product): RedirectResponse
    {
        $this->authorize('delete_product', $product);

        $product->delete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product deleted successfully.');
    }

    /**
     * Restore the specified soft deleted resource.
     */
    public function restore(int $id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);
        $this->authorize('restore_product', $product);

        $product->restore();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product restored successfully.');
    }

    /**
     * Permanently delete the specified resource.
     */
    public function forceDelete(int $id): RedirectResponse
    {
        $product = Product::withTrashed()->findOrFail($id);
        $this->authorize('force_delete_product', $product);

        $product->forceDelete();

        return redirect()->route('admin.products.index')
            ->with('success', 'Product permanently deleted.');
    }
}
