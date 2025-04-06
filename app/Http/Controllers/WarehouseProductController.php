<?php

namespace App\Http\Controllers;

use App\Exceptions\ProductNotFoundException;
use App\Http\Requests\WarehouseProduct\IndexRequest;
use App\Models\WarehouseProduct;
use App\Services\Warehouse\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;

class WarehouseProductController extends Controller
{
    /**
     * The product service instance.
     */
    protected ProductService $productService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Services\Warehouse\ProductService $productService
     */
    public function __construct(ProductService $productService)
    {
        $this->productService = $productService;
    }

    /**
     * Display a listing of warehouse products.
     *
     * @param \App\Http\Requests\WarehouseProduct\IndexRequest $request
     * @return \Illuminate\View\View|\Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Validate request parameters if needed
            $perPage = $request->input('per_page', 9);
            $sortBy = $request->input('sort_by', 'net_quantity');
            $sortDirection = $request->input('sort_direction', 'desc');
            $searchTerm = $request->input('search');

            // Get products with filters applied
            $products = $this->productService->getFilteredProducts(
                $perPage,
                $sortBy,
                $sortDirection,
                $searchTerm
            );

            // Handle AJAX request
            if ($request->ajax()) {
                $view = view('partials.warehouse-products', compact('products'))->render();
                return response()->json([
                    'success' => true,
                    'html' => $view,
                    'hasMorePages' => $products->hasMorePages(),
                    'currentPage' => $products->currentPage(),
                    'lastPage' => $products->lastPage(),
                    'totalItems' => $products->total(),
                ]);
            }

            // Return view for normal page load
            return view('landing', compact('products'));
        } catch (ValidationException $e) {
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Invalid request parameters',
                    'errors' => $e->errors()
                ], 422);
            }

            Log::error('Validation error in WarehouseProductController', [
                'errors' => $e->errors()
            ]);

            return view('landing', ['products' => collect([])]);
        } catch (\Exception $e) {
            Log::error('Error in WarehouseProductController', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred while fetching products'
                ], 500);
            }

            return view('landing', ['products' => collect([])]);
        }
    }

    /**
     * Display a specific warehouse product.
     *
     * @param string $id
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\View\View|\Illuminate\Http\JsonResponse
     */
    public function show(string $id, Request $request)
    {
        try {
            $product = $this->productService->getProductById($id);

            if ($request->ajax()) {
                return response()->json([
                    'success' => true,
                    'data' => $product
                ]);
            }

            return view('warehouse-products.show', compact('product'));
        } catch (ProductNotFoundException $e) {
            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => $e->getMessage()
                ], 404);
            }

            return redirect()->route('landing')
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error fetching warehouse product', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            if ($request->ajax()) {
                return response()->json([
                    'success' => false,
                    'message' => 'An error occurred while fetching the product'
                ], 500);
            }

            return redirect()->route('landing')
                ->with('error', 'An error occurred while fetching the product');
        }
    }

    /**
     * API endpoint to get warehouse product stock status.
     *
     * @param string $id
     * @return \Illuminate\Http\JsonResponse
     */
    public function getStockStatus(string $id): JsonResponse
    {
        try {
            $stockInfo = $this->productService->getProductStockInfo($id);

            return response()->json([
                'success' => true,
                'data' => $stockInfo
            ]);
        } catch (ProductNotFoundException $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 404);
        } catch (\Exception $e) {
            Log::error('Error fetching product stock status', [
                'id' => $id,
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'An error occurred while fetching the stock status'
            ], 500);
        }
    }
}
