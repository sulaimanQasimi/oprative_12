<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Validator;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;
use Illuminate\Database\QueryException;
use Illuminate\Support\Facades\Auth;

class StockProductsController extends Controller
{
    /**
     * Display a listing of the customer's stock products
     *
     * @param Request $request
     * @return \Inertia\Response
     */
    public function index(Request $request)
    {
        try {
            // Validate input parameters
            $validator = Validator::make($request->all(), [
                'search' => 'nullable|string|max:100',
                'per_page' => 'nullable|integer|min:5|max:100',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Customer/StockProducts/Index', [
                    'stockProducts' => [],
                    'search' => '',
                    'isFilterOpen' => false,
                    'errors' => $validator->errors(),
                ]);
            }

            // Sanitize and get input parameters
            $search = $request->input('search', '');
            $perPage = (int) $request->input('per_page', 10);

            // Ensure the current user has a valid customer association
            $customer = Auth::guard('customer_user')->user()->customer;
            if (!$customer) {
                Log::warning('Stock products access attempted without valid customer association', [
                    'user_id' => Auth::guard('customer_user')->id(),
                    'ip' => $request->ip()
                ]);

                return redirect()->route('customer.login');
            }

            // Query stock products with security measures
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
                        // Use parameter binding for security against SQL injection
                        $searchParam = '%' . addslashes($search) . '%';
                        $q->where('products.name', 'like', $searchParam)
                          ->orWhere('products.barcode', 'like', $searchParam);
                    });
                })
                ->where('customer_stock_product_movements.customer_id', $customer->id)
                ->orderBy('products.name', 'asc')
                ->paginate($perPage);

            return Inertia::render('Customer/StockProducts/Index', [
                'stockProducts' => $stockProducts,
                'search' => $search,
                'isFilterOpen' => $request->has('search')
            ]);
        } catch (ValidationException $e) {
            return Inertia::render('Customer/StockProducts/Index', [
                'stockProducts' => [],
                'search' => $request->input('search', ''),
                'isFilterOpen' => $request->has('search'),
                'errors' => $e->errors(),
            ]);
        } catch (QueryException $e) {
            Log::error('Database error in stock products', [
                'message' => $e->getMessage(),
                'user_id' => Auth::guard('customer_user')->id(),
                'customer_id' => Auth::guard('customer_user')->user()->customer_id ?? null,
                'ip' => $request->ip(),
            ]);

            return Inertia::render('Customer/StockProducts/Index', [
                'stockProducts' => [],
                'search' => $request->input('search', ''),
                'isFilterOpen' => $request->has('search'),
                'errors' => ['database' => 'A database error occurred. Please try again later.'],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in stock products', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::guard('customer_user')->id(),
                'customer_id' => Auth::guard('customer_user')->user()->customer_id ?? null,
                'ip' => $request->ip(),
            ]);

            return Inertia::render('Customer/StockProducts/Index', [
                'stockProducts' => [],
                'search' => $request->input('search', ''),
                'isFilterOpen' => $request->has('search'),
                'errors' => ['general' => 'An error occurred while loading your stock products.'],
            ]);
        }
    }
}
