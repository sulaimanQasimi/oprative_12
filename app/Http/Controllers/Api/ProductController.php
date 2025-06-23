<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Http\Resources\ProductResource;
use App\Http\Requests\Api\ProductRequest;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Resources\Json\AnonymousResourceCollection;

/**
 * @group Product Management
 *
 * APIs for managing products
 */
class ProductController extends Controller
{
    /**
     * Display a listing of products.
     *
     * @queryParam page integer Page number for pagination. Example: 1
     * @queryParam per_page integer Number of items per page (max 100). Example: 15
     * @queryParam search string Search products by name or code. Example: laptop
     * @queryParam category_id integer Filter by category ID. Example: 1
     * @queryParam warehouse_id integer Filter by warehouse ID. Example: 1
     * @queryParam sort string Sort field (name, price, created_at). Example: name
     * @queryParam direction string Sort direction (asc, desc). Example: asc
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Product Name",
     *       "code": "PRD001",
     *       "description": "Product description",
     *       "price": "99.99",
     *       "cost": "50.00",
     *       "quantity": 100,
     *       "min_quantity": 10,
     *       "category": {
     *         "id": 1,
     *         "name": "Electronics"
     *       },
     *       "unit": {
     *         "id": 1,
     *         "name": "Piece"
     *       },
     *       "created_at": "2024-01-01T00:00:00.000000Z",
     *       "updated_at": "2024-01-01T00:00:00.000000Z"
     *     }
     *   ],
     *   "links": {
     *     "first": "http://localhost/api/products?page=1",
     *     "last": "http://localhost/api/products?page=10",
     *     "prev": null,
     *     "next": "http://localhost/api/products?page=2"
     *   },
     *   "meta": {
     *     "current_page": 1,
     *     "from": 1,
     *     "last_page": 10,
     *     "per_page": 15,
     *     "to": 15,
     *     "total": 150
     *   }
     * }
     */
    public function index(Request $request): AnonymousResourceCollection
    {
        $query = Product::with(['unit']);

        // Search functionality
        if ($request->has('search')) {
            $search = $request->get('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('code', 'like', "%{$search}%")
                  ->orWhere('description', 'like', "%{$search}%");
            });
        }



        // Sorting
        $sortField = $request->get('sort', 'created_at');
        $sortDirection = $request->get('direction', 'desc');

        $allowedSortFields = ['name', 'code', 'price', 'cost', 'quantity', 'created_at', 'updated_at'];
        if (in_array($sortField, $allowedSortFields)) {
            $query->orderBy($sortField, $sortDirection);
        }

        // Pagination
        $perPage = min($request->get('per_page', 15), 100);
        $products = $query->paginate($perPage);

        return ProductResource::collection($products);
    }

    /**
     * Store a newly created product.
     *
     * @bodyParam name string required Product name. Example: Laptop Dell Inspiron
     * @bodyParam code string required Unique product code. Example: LAP001
     * @bodyParam description string Product description. Example: High performance laptop
     * @bodyParam price numeric required Product selling price. Example: 999.99
     * @bodyParam cost numeric required Product cost price. Example: 500.00
     * @bodyParam quantity integer required Initial quantity. Example: 50
     * @bodyParam min_quantity integer Minimum quantity threshold. Example: 5
     * @bodyParam category_id integer required Category ID. Example: 1
     * @bodyParam unit_id integer required Unit ID. Example: 1
     * @bodyParam warehouse_quantities array Warehouse quantities. Example: [{"warehouse_id": 1, "quantity": 30}, {"warehouse_id": 2, "quantity": 20}]
     *
     * @response 201 {
     *   "data": {
     *     "id": 1,
     *     "name": "Laptop Dell Inspiron",
     *     "code": "LAP001",
     *     "description": "High performance laptop",
     *     "price": "999.99",
     *     "cost": "500.00",
     *     "quantity": 50,
     *     "min_quantity": 5,
     *     "category": {
     *       "id": 1,
     *       "name": "Electronics"
     *     },
     *     "unit": {
     *       "id": 1,
     *       "name": "Piece"
     *     },
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T00:00:00.000000Z"
     *   },
     *   "message": "Product created successfully"
     * }
     */
    public function store(ProductRequest $request): JsonResponse
    {
        $product = Product::create($request->validated());

        // Handle warehouse quantities if provided
        if ($request->has('warehouse_quantities')) {
            foreach ($request->warehouse_quantities as $warehouseQuantity) {
                $product->warehouses()->attach($warehouseQuantity['warehouse_id'], [
                    'quantity' => $warehouseQuantity['quantity']
                ]);
            }
        }

        $product->load(['unit']);

        return response()->json([
            'data' => new ProductResource($product),
            'message' => 'Product created successfully'
        ], 201);
    }

    /**
     * Display the specified product.
     *
     * @urlParam product integer required Product ID. Example: 1
     *
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "name": "Laptop Dell Inspiron",
     *     "code": "LAP001",
     *     "description": "High performance laptop",
     *     "price": "999.99",
     *     "cost": "500.00",
     *     "quantity": 50,
     *     "min_quantity": 5,
     *     "category": {
     *       "id": 1,
     *       "name": "Electronics"
     *     },
     *     "unit": {
     *       "id": 1,
     *       "name": "Piece"
     *     },
     *     "warehouses": [
     *       {
     *         "id": 1,
     *         "name": "Main Warehouse",
     *         "quantity": 30
     *       }
     *     ],
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T00:00:00.000000Z"
     *   }
     * }
     *
     * @response 404 {
     *   "message": "Product not found"
     * }
     */
    public function show(Product $product): JsonResponse
    {
        $product->load(['unit']);

        return response()->json([
            'data' => new ProductResource($product)
        ]);
    }

    /**
     * Update the specified product.
     *
     * @urlParam product integer required Product ID. Example: 1
     * @bodyParam name string Product name. Example: Updated Laptop Dell Inspiron
     * @bodyParam code string Unique product code. Example: LAP001-UPD
     * @bodyParam description string Product description. Example: Updated high performance laptop
     * @bodyParam price numeric Product selling price. Example: 1099.99
     * @bodyParam cost numeric Product cost price. Example: 550.00
     * @bodyParam quantity integer Product quantity. Example: 45
     * @bodyParam min_quantity integer Minimum quantity threshold. Example: 3
     * @bodyParam category_id integer Category ID. Example: 1
     * @bodyParam unit_id integer Unit ID. Example: 1
     *
     * @response 200 {
     *   "data": {
     *     "id": 1,
     *     "name": "Updated Laptop Dell Inspiron",
     *     "code": "LAP001-UPD",
     *     "description": "Updated high performance laptop",
     *     "price": "1099.99",
     *     "cost": "550.00",
     *     "quantity": 45,
     *     "min_quantity": 3,
     *     "category": {
     *       "id": 1,
     *       "name": "Electronics"
     *     },
     *     "unit": {
     *       "id": 1,
     *       "name": "Piece"
     *     },
     *     "created_at": "2024-01-01T00:00:00.000000Z",
     *     "updated_at": "2024-01-01T12:00:00.000000Z"
     *   },
     *   "message": "Product updated successfully"
     * }
     */
    public function update(ProductRequest $request, Product $product): JsonResponse
    {
        $product->update($request->validated());
        $product->load(['unit']);

        return response()->json([
            'data' => new ProductResource($product),
            'message' => 'Product updated successfully'
        ]);
    }

    /**
     * Remove the specified product.
     *
     * @urlParam product integer required Product ID. Example: 1
     *
     * @response 200 {
     *   "message": "Product deleted successfully"
     * }
     *
     * @response 404 {
     *   "message": "Product not found"
     * }
     */
    public function destroy(Product $product): JsonResponse
    {
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully'
        ]);
    }

    /**
     * Search products by query.
     *
     * @urlParam query string required Search query. Example: laptop
     * @queryParam limit integer Limit results (max 50). Example: 10
     *
     * @response 200 {
     *   "data": [
     *     {
     *       "id": 1,
     *       "name": "Laptop Dell Inspiron",
     *       "code": "LAP001",
     *       "price": "999.99",
     *       "quantity": 50
     *     }
     *   ]
     * }
     */
    public function search(Request $request, string $query): JsonResponse
    {
        $limit = min($request->get('limit', 10), 50);

        $products = Product::where('name', 'like', "%{$query}%")
            ->orWhere('code', 'like', "%{$query}%")
            ->orWhere('description', 'like', "%{$query}%")
            ->limit($limit)
            ->get(['id', 'name', 'code', 'price', 'quantity']);

        return response()->json([
            'data' => $products
        ]);
    }

    /**
     * Restore a soft-deleted product.
     *
     * @urlParam product integer required Product ID. Example: 1
     *
     * @response 200 {
     *   "message": "Product restored successfully"
     * }
     */
    public function restore(int $productId): JsonResponse
    {
        $product = Product::withTrashed()->findOrFail($productId);
        $product->restore();

        return response()->json([
            'message' => 'Product restored successfully'
        ]);
    }

    /**
     * Permanently delete a product.
     *
     * @urlParam product integer required Product ID. Example: 1
     *
     * @response 200 {
     *   "message": "Product permanently deleted"
     * }
     */
    public function forceDelete(int $productId): JsonResponse
    {
        $product = Product::withTrashed()->findOrFail($productId);
        $product->forceDelete();

        return response()->json([
            'message' => 'Product permanently deleted'
        ]);
    }
}