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

        $products = $warehouse->products()->get()->map(function ($product) {
            return [
                "product_id" => $product->product_id,
                "product" => collect($product->product)->map(function ($item) {
                    return [
                        "id" => $item->id,
                        "type" => $item->type,
                        "name" => $item->name,
                        "barcode" => $item->barcode,
                        "purchase_price" => $item->purchase_price,
                        "wholesale_price" => $item->wholesale_price,
                        "retail_price" => $item->retail_price,
                    ];
                })
                ->toArray(),
                "income_quantity" => $product->income_quantity,
                "income_price" => $product->income_price,
                "income_total" => $product->income_total,
                "outcome_quantity" => $product->outcome_quantity,
                "outcome_price" => $product->outcome_price,
                "outcome_total" => $product->outcome_total,
                "net_quantity" => $product->net_quantity,
                "net_total" => $product->net_total,
                "profit" => $product->profit,
            ];
        });
        return Inertia::render('Warehouse/Products', [
            'products' => $products,
        ]);
    }
}
