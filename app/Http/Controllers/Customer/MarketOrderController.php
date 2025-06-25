<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\MarketOrder;
use App\Models\MarketOrderItem;
use App\Models\Product;
use App\Models\CustomerStockOutcome;
use App\Models\CustomerStockProduct;
use App\Models\Account;
use App\Models\AccountOutcome;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use Inertia\Inertia;
use Log;

class MarketOrderController extends Controller
{
    /**
     * Display the form for creating a new market order.
     *
     */
    public function create()
    {
        // Get products in customer's stock
        $products = CustomerStockProduct::with(['product.wholesaleUnit', 'product.retailUnit'])
            ->where('customer_id', $this->getCustomerId())
            ->where('net_quantity', '>', 0)
            ->get()
            ->map(function ($item) {
                return (object)[
                    'id' => $item->product_id,
                    'name' => $item->product->name,
                    'price' => $item->product->retail_price,
                    'retail_price' => $item->product->retail_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount ?: 1,
                    'stock' => $item->net_quantity,
                    'wholesaleUnit' => $item->product->wholesaleUnit ? [
                        'id' => $item->product->wholesaleUnit->id,
                        'name' => $item->product->wholesaleUnit->name,
                        'code' => $item->product->wholesaleUnit->code,
                        'symbol' => $item->product->wholesaleUnit->symbol,
                    ] : null,
                    'retailUnit' => $item->product->retailUnit ? [
                        'id' => $item->product->retailUnit->id,
                        'name' => $item->product->retailUnit->name,
                        'code' => $item->product->retailUnit->code,
                        'symbol' => $item->product->retailUnit->symbol,
                    ] : null,
                ];
            });

        // Define payment methods
        $paymentMethods = [
            (object)['id' => 'cash', 'name' => __('Cash')],
            (object)['id' => 'card', 'name' => __('Card')],
            (object)['id' => 'bank_transfer', 'name' => __('Bank Transfer')]
        ];

        // Set default tax percentage
        $tax_percentage = 0; // You can adjust this or pull from config if needed
        
        // Define default currency
        $defaultCurrency = (object)[
            'symbol' => '$',
            'code' => 'USD',
            'name' => 'US Dollar'
        ];

        return Inertia::render("Customer/Sales/MarketOrderCreate", compact('products', 'paymentMethods', 'tax_percentage', 'defaultCurrency'));
    }

    /**
     * Start a new order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function startOrder(Request $request)
    {
        try {
            DB::beginTransaction();

            // Create new order
            $order = MarketOrder::create([
                'order_number' => 'POS-' . Str::random(8),
                'customer_id' => $this->getCustomerId(),
                'subtotal' => 0,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => 0,
                'payment_method' => 'cash',
                'payment_status' => 'pending',
                'order_status' => 'pending',
                'notes' => ''
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'order_id' => $order->id
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error creating order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Search for products.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchProducts(Request $request)
    {
        $query = $request->input('query');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $searchResults = CustomerStockProduct::with(['product' => function($query) {
                $query->select('id', 'name', 'barcode', 'purchase_price', 'wholesale_price', 'retail_price',
                             'purchase_profit', 'wholesale_profit', 'retail_profit', 'is_activated',
                             'is_in_stock', 'is_shipped', 'is_trend', 'type', 'wholesale_unit_id', 'retail_unit_id');
            }, 'product.wholesaleUnit', 'product.retailUnit'])
            ->where('customer_id', $this->getCustomerId())
            ->where('net_quantity', '>', 0)
            ->where(function($q) use ($query) {
                $q->whereHas('product', function($subq) use ($query) {
                    $subq->where('name', 'like', '%' . $query . '%')
                      ->orWhere('barcode', 'like', '%' . $query . '%');
                });
            })
            ->select('customer_id', 'product_id', 'net_quantity')
            ->get()
            ->map(function ($item) {
                return [
                    'id' => $item->product_id,
                    'name' => $item->product->name,
                    'barcode' => $item->product->barcode,
                    'purchase_price' => $item->product->purchase_price,
                    'wholesale_price' => $item->product->wholesale_price,
                    'retail_price' => $item->product->retail_price,
                    'purchase_profit' => $item->product->purchase_profit,
                    'wholesale_profit' => $item->product->wholesale_profit,
                    'retail_profit' => $item->product->retail_profit,
                    'is_activated' => $item->product->is_activated,
                    'is_in_stock' => $item->product->is_in_stock,
                    'is_shipped' => $item->product->is_shipped,
                    'is_trend' => $item->product->is_trend,
                    'type' => $item->product->type,
                    'whole_sale_unit_amount' => $item->product->whole_sale_unit_amount ?: 1,
                    'stock' => $item->net_quantity,
                    'wholesaleUnit' => $item->product->wholesaleUnit ? [
                        'id' => $item->product->wholesaleUnit->id,
                        'name' => $item->product->wholesaleUnit->name,
                        'code' => $item->product->wholesaleUnit->code,
                        'symbol' => $item->product->wholesaleUnit->symbol,
                    ] : null,
                    'retailUnit' => $item->product->retailUnit ? [
                        'id' => $item->product->retailUnit->id,
                        'name' => $item->product->retailUnit->name,
                        'code' => $item->product->retailUnit->code,
                        'symbol' => $item->product->retailUnit->symbol,
                    ] : null,
                ];
            })
            ->toArray();

        return response()->json($searchResults);
    }

    /**
     * Process barcode scan.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function processBarcode(Request $request)
    {
        $barcode = $request->input('barcode');

        if (empty($barcode)) {
            return response()->json([
                'success' => false,
                'message' => 'Barcode is required'
            ], 400);
        }

        $customerStockProduct = CustomerStockProduct::with(['product.wholesaleUnit', 'product.retailUnit'])
            ->where('customer_id', $this->getCustomerId())
            ->whereHas('product', function($query) use ($barcode) {
                $query->where('barcode', $barcode);
            })
            ->first();

        if ($customerStockProduct && $customerStockProduct->net_quantity > 0) {
            return response()->json([
                'success' => true,
                'product' => [
                    'product_id' => $customerStockProduct->product_id,
                    'name' => $customerStockProduct->product->name,
                    'price' => $customerStockProduct->product->retail_price,
                    'retail_price' => $customerStockProduct->product->retail_price,
                    'wholesale_price' => $customerStockProduct->product->wholesale_price,
                    'whole_sale_unit_amount' => $customerStockProduct->product->whole_sale_unit_amount ?: 1,
                    'stock' => $customerStockProduct->net_quantity,
                    'wholesaleUnit' => $customerStockProduct->product->wholesaleUnit ? [
                        'id' => $customerStockProduct->product->wholesaleUnit->id,
                        'name' => $customerStockProduct->product->wholesaleUnit->name,
                        'code' => $customerStockProduct->product->wholesaleUnit->code,
                        'symbol' => $customerStockProduct->product->wholesaleUnit->symbol,
                    ] : null,
                    'retailUnit' => $customerStockProduct->product->retailUnit ? [
                        'id' => $customerStockProduct->product->retailUnit->id,
                        'name' => $customerStockProduct->product->retailUnit->name,
                        'code' => $customerStockProduct->product->retailUnit->code,
                        'symbol' => $customerStockProduct->product->retailUnit->symbol,
                    ] : null,
                ]
            ]);
        }

        return response()->json([
            'success' => false,
            'message' => 'Product not found or out of stock'
        ], 404);
    }

    /**
     * Search for accounts.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function searchAccounts(Request $request)
    {
        $query = $request->input('query');

        if (strlen($query) < 2) {
            return response()->json([]);
        }

        $accountSearchResults = Account::where('customer_id', $this->getCustomerId())
            ->where(function($q) use ($query) {
                $q->where('name', 'like', '%' . $query . '%')
                    ->orWhere('account_number', 'like', '%' . $query . '%')
                    ->orWhere('id_number', 'like', '%' . $query . '%');
            })
            ->get()
            ->map(function ($account) {
                return [
                    'id' => $account->id,
                    'name' => $account->name,
                    'account_number' => $account->account_number,
                    'id_number' => $account->id_number,
                    'balance' => $account->total_income - $account->total_outcome
                ];
            })
            ->toArray();

        return response()->json($accountSearchResults);
    }

    /**
     * Complete an order.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function completeOrder(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'order_id' => 'required|exists:market_orders,id',
            'items' => 'required|array',
            'items.*.product_id' => 'required|exists:products,id',
            'items.*.quantity' => 'required|numeric|min:1',
            'items.*.price' => 'required|numeric|min:0',
            'items.*.total' => 'required|numeric|min:0',
            'items.*.unit_amount' => 'nullable|numeric|min:1',
            'items.*.is_wholesale' => 'nullable|boolean',
            'subtotal' => 'required|numeric|min:0',
            'total' => 'required|numeric|min:0',
            'payment_method' => 'required|in:cash,card,bank_transfer',
            'amount_paid' => 'required|numeric|min:0',
            'account_id' => 'nullable|exists:accounts,id',
            'notes' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $orderId = $request->input('order_id');
        $items = $request->input('items');
        $subtotal = $request->input('subtotal');
        $total = $request->input('total');
        $paymentMethod = $request->input('payment_method');
        $amountPaid = $request->input('amount_paid');
        $accountId = $request->input('account_id');
        $notes = $request->input('notes');

        if (empty($items)) {
            return response()->json([
                'success' => false,
                'message' => 'Please add items to the order before completing.'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $order = MarketOrder::where('id', $orderId)
                ->where('customer_id', $this->getCustomerId())
                ->firstOrFail();

            if ($amountPaid < $total) {
                if (!$accountId) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Please select an account for the remaining balance.'
                    ], 400);
                }

                // Verify account belongs to the authenticated customer
                $accountExists = Account::where('id', $accountId)
                    ->where('customer_id', $this->getCustomerId())
                    ->exists();

                if (!$accountExists) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => 'Invalid account selected.'
                    ], 400);
                }

                // Create account outcome for the remaining balance
                AccountOutcome::create([
                    'account_id' => $accountId,
                    'reference_number' => $order->order_number,
                    'amount' => $total - $amountPaid,
                    'date' => now(),
                    'status' => 'pending',
                    'user_id' => auth()->guard('customer_user')->id(),
                    'description' => 'Remaining balance for order ' . $order->order_number,
                    'model_type' => MarketOrder::class,
                    'model_id' => $order->id
                ]);
            }

            // Update order details
            $order->update([
                'subtotal' => $subtotal,
                'tax_amount' => 0,
                'discount_amount' => 0,
                'total_amount' => $total,
                'payment_method' => $paymentMethod,
                'payment_status' => $amountPaid >= $total ? 'paid' : 'partial',
                'order_status' => 'completed',
                'notes' => $notes
            ]);

            // Process each order item
            foreach ($items as $item) {
                // First get the product to access wholesale unit amount
                $stockProduct = CustomerStockProduct::with('product')
                    ->where('customer_id', $this->getCustomerId())
                    ->where('product_id', $item['product_id'])
                    ->first();

                if (!$stockProduct) {
                    $product = Product::find($item['product_id']);
                    $productName = $product ? $product->name : 'Unknown Product';
                    throw new \Exception("Product not found: {$productName}");
                }

                // Calculate actual units needed (for wholesale items)
                $isWholesale = isset($item['is_wholesale']) && $item['is_wholesale'];
                $unitAmount = $isWholesale ? ($stockProduct->product->whole_sale_unit_amount ?: 1) : 1;
                $actualUnitsNeeded = $item['quantity'] * $unitAmount;
                
                // Verify sufficient stock
                if ($stockProduct->net_quantity < $actualUnitsNeeded) {
                    $productName = $stockProduct->product->name;
                    throw new \Exception("Insufficient stock for product: {$productName}. Required: {$actualUnitsNeeded}, Available: {$stockProduct->net_quantity}");
                }

                // Log for debugging
                Log::info("Processing item: Product ID {$item['product_id']}, Wholesale: " . ($isWholesale ? 'Yes' : 'No') . ", Quantity: {$item['quantity']}, Unit Amount: {$unitAmount}, Actual Units: {$actualUnitsNeeded}");
                
                $storeQuantity = $actualUnitsNeeded; // Always store actual units consumed
                $frontendTotal = floatval($item['total']); // What the frontend calculated and customer saw
                
                if ($isWholesale) {
                    // For wholesale: Use frontend total and calculate unit price per individual unit
                    $storeUnitPrice = $stockProduct->product->wholesale_price;
                    $calculatedSubtotal = $item['quantity'] * $storeUnitPrice; // Use what customer actually paid
                } else {
                    // For retail: Use database price and calculate total
                    $storeUnitPrice = $stockProduct->product->retail_price;
                    $calculatedSubtotal = $storeQuantity * $storeUnitPrice;
                    
                    // Validate against frontend total with small tolerance
                    $tolerance = 0.01; // 1 cent tolerance
                    if (abs($calculatedSubtotal - $frontendTotal) > $tolerance) {
                        Log::warning("Retail price mismatch - using frontend total", [
                            'product_id' => $item['product_id'],
                            'calculated' => $calculatedSubtotal,
                            'frontend' => $frontendTotal,
                            'difference' => abs($calculatedSubtotal - $frontendTotal)
                        ]);
                        $calculatedSubtotal = $frontendTotal;
                        $storeUnitPrice = $storeQuantity > 0 ? ($frontendTotal / $storeQuantity) : $storeUnitPrice;
                    }
                }

                MarketOrderItem::create([
                    'market_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $storeQuantity, // Store actual individual units (e.g., 14)
                    'unit_price' => $storeUnitPrice, // Price per individual unit (calculated or from DB)
                    'price' => $storeUnitPrice,
                    'subtotal' => $calculatedSubtotal, // Use validated/frontend subtotal
                    'discount_amount' => 0,
                    'unit_type' => $isWholesale ? 'wholesale' : 'retail',
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $isWholesale ? $stockProduct->product->wholesale_unit_id : $stockProduct->product->retail_unit_id,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $isWholesale ? 
                        ($stockProduct->product->wholesaleUnit->name ?? 'Wholesale Unit') : 
                        ($stockProduct->product->retailUnit->name ?? 'Retail Unit')
                ]);

                // Use actual units for stock outcome
                CustomerStockOutcome::create([
                    'reference_number' => $order->order_number,
                    'customer_id' => $this->getCustomerId(),
                    'product_id' => $item['product_id'],
                    'quantity' => $actualUnitsNeeded, // Use the actual units consumed
                    'price' => $storeUnitPrice,
                    'total' => $item['total'],
                    'model_type' => MarketOrder::class,
                    'model_id' => $order->id
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Order completed successfully!'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'success' => false,
                'message' => 'Error completing order: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Helper method to get customer ID securely
     *
     * @return int
     */
    protected function getCustomerId()
    {
        $customerId = auth()->guard('customer_user')->user()->customer_id;

        if (!$customerId) {
            abort(403, 'Unauthorized access');
        }

        return $customerId;
    }
}
