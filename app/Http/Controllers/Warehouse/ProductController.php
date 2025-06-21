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

        $products = $warehouse->products()->with(['product.wholesaleUnit', 'product.retailUnit'])->get()->map(function ($product) {
            return [
                "product_id" => $product->product_id,
                "product" => [
                    "id" => $product->product->id,
                    "type" => $product->product->type,
                    "name" => $product->product->name,
                    "barcode" => $product->product->barcode,
                    "purchase_price" => $product->product->purchase_price,
                    "wholesale_price" => $product->product->wholesale_price,
                    "retail_price" => $product->product->retail_price,
                    'whole_sale_unit_amount' => $product->product->whole_sale_unit_amount,
                    'retails_sale_unit_amount' => $product->product->retails_sale_unit_amount,
                    'wholesaleUnit' => $product->product->wholesaleUnit ? [
                        'id' => $product->product->wholesaleUnit->id,
                        'name' => $product->product->wholesaleUnit->name,
                        'code' => $product->product->wholesaleUnit->code,
                        'symbol' => $product->product->wholesaleUnit->symbol,
                    ] : null,
                    'retailUnit' => $product->product->retailUnit ? [
                        'id' => $product->product->retailUnit->id,
                        'name' => $product->product->retailUnit->name,
                        'code' => $product->product->retailUnit->code,
                        'symbol' => $product->product->retailUnit->symbol,
                    ] : null,                  
                ],
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
