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

    public function select(Request $request)
    {
        $query = Product::with('unit');
        
        if ($request->has('search') && !empty($request->search)) {
            $search = $request->search;
            $query->where(function($q) use ($search) {
                $q->where('name', 'like', '%' . $search . '%')
                  ->orWhere('barcode', 'like', '%' . $search . '%')
                  ->orWhere('id', 'like', '%' . $search . '%');
            });
        }

        $products = $query->get();

        return $products->map(function ($product) {
            return [
                'value' => $product->id,
                'label' => $product->name,
                'subtitle' => $product->barcode ? "Barcode: {$product->barcode}" : "ID: {$product->id}",
                'product' => $product->toArray() // Include full product data for form logic
            ];
        });
    }
}