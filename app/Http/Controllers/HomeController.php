<?php

namespace App\Http\Controllers;

use App\Exceptions\ProductNotFoundException;
use App\Http\Requests\WarehouseProduct\IndexRequest;
use App\Models\WarehouseProduct;
use App\Services\Warehouse\ProductService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class HomeController extends Controller
{
    public function __invoke()
    {
        return Inertia::render('HomePage', [
            'products' => collect([]),
            'auth' => [
                'web' => Auth::guard('web')->check(),
                'warehouse' => Auth::guard('warehouse_user')->check(),
                'customer' => Auth::guard('customer_user')->check(),
            ]
        ]);
     }
}
