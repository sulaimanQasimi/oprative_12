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
        $products = Product::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('barcode', 'like', '%' . $request->search . '%')
            ->get();

        return $products->map(function ($product) {
            return [
                'value' => $product->id,
                'label' => $product->name,
            ];
        });
    }
}