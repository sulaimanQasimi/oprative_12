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
        return inertia('Warehouse3D/LandingPage', [
            'products' => collect([])
        ]);
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
