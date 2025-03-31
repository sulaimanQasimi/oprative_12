<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class StockProductsController extends Controller
{
    public function index(Request $request)
    {
        $search = $request->input('search', '');
        $perPage = $request->input('per_page', 10);

        $stockProducts = DB::table('customer_stock_product_movements')
            ->join('products', 'customer_stock_product_movements.product_id', '=', 'products.id')
            ->select([
                'customer_stock_product_movements.product_id',
                'customer_stock_product_movements.customer_id',
                'customer_stock_product_movements.income_quantity',
                'customer_stock_product_movements.income_price',
                'customer_stock_product_movements.income_total',
                'customer_stock_product_movements.outcome_quantity',
                'customer_stock_product_movements.outcome_price',
                'customer_stock_product_movements.outcome_total',
                'customer_stock_product_movements.net_quantity',
                'customer_stock_product_movements.net_total',
                'customer_stock_product_movements.profit',
                'products.name as product_name',
                'products.barcode'
            ])
            ->when($search, function ($query) use ($search) {
                $query->where(function($q) use ($search) {
                    $q->where('products.name', 'like', '%' . $search . '%')
                      ->orWhere('products.barcode', 'like', '%' . $search . '%');
                });
            })
            ->where('customer_stock_product_movements.customer_id', CustomerRepository::currentUserCustomer()->id)
            ->paginate($perPage);

        return Inertia::render('Customer/StockProducts/Index', [
            'stockProducts' => $stockProducts,
            'search' => $search,
            'isFilterOpen' => $request->has('search')
        ]);
    }
}
