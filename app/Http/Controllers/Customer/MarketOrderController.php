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
use Illuminate\Support\Facades\Log as FacadesLog;
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
            'symbol' => '؋',
            'code' => 'AFN',
            'name' => 'Afghan Afghani'
        ];

        return Inertia::render("Customer/Sales/MarketOrderCreate", compact('paymentMethods', 'tax_percentage', 'defaultCurrency'));
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

        $customerInventory = \DB::table('customer_inventory')
            ->where('customer_id', $this->getCustomerId())
            ->where('product_barcode', $barcode)
            ->where('remaining_qty', '>', 0)
            ->get();

        if ($customerInventory->isEmpty()) {
            return response()->json([
                'success' => false,
                'message' => 'Product not found or out of stock'
            ], 404);
        }

        // If multiple batches found, group them by product
        if ($customerInventory->count() > 1) {
            $firstItem = $customerInventory->first();
            
            // Group by product and create batches array
            $batches = $customerInventory->map(function ($item) {
                $daysToExpiry = null;
                $expiryStatus = null;
                
                if ($item->expire_date) {
                    $daysToExpiry = now()->diffInDays($item->expire_date, false);
                    if ($daysToExpiry < 0) {
                        $expiryStatus = 'expired';
                    } elseif ($daysToExpiry <= 30) {
                        $expiryStatus = 'expiring_soon';
                    } else {
                        $expiryStatus = 'valid';
                    }
                } elseif ($item->batch_id) {
                    $expiryStatus = 'no_expiry';
                }

                return (object)[
                    'id' => $item->batch_id,
                    'reference_number' => $item->batch_reference,
                    'issue_date' => $item->issue_date,
                    'expire_date' => $item->expire_date,
                    'notes' => $item->batch_notes,
                    'stock' => $item->remaining_qty,
                    'days_to_expiry' => $daysToExpiry,
                    'expiry_status' => $expiryStatus,
                    'unit_type' => $item->unit_type ?? 'retail',
                    'unit_id' => $item->unit_id,
                    'unit_amount' => $item->unit_amount ?? 1,
                    'unit_name' => $item->unit_name,
                    'retail_price' => $item->retail_price,
                    'wholesale_price' => $item->wholesale_price,
                    'purchase_price' => $item->purchase_price,
                ];
            });

            $product = (object)[
                'id' => $firstItem->product_id,
                'product_id' => $firstItem->product_id,
                'name' => $firstItem->product_name,
                'barcode' => $firstItem->product_barcode,
                'price' => $firstItem->retail_price,
                'retail_price' => $firstItem->retail_price,
                'wholesale_price' => $firstItem->wholesale_price,
                'purchase_price' => $firstItem->purchase_price,
                'stock' => $customerInventory->sum('remaining_qty'),
                'net_quantity' => $customerInventory->sum('remaining_qty'),
                'net_value' => $customerInventory->sum('net_value'),
                'batches' => $batches,
                'has_multiple_batches' => true,
                'has_expiring_batches' => $batches->where('expiry_status', 'expiring_soon')->count() > 0,
                'has_expired_batches' => $batches->where('expiry_status', 'expired')->count() > 0,
            ];
        } else {
            // Single batch found
            $item = $customerInventory->first();
            
            $daysToExpiry = null;
            $expiryStatus = null;
            
            if ($item->expire_date) {
                $daysToExpiry = now()->diffInDays($item->expire_date, false);
                if ($daysToExpiry < 0) {
                    $expiryStatus = 'expired';
                } elseif ($daysToExpiry <= 30) {
                    $expiryStatus = 'expiring_soon';
                } else {
                    $expiryStatus = 'valid';
                }
            } elseif ($item->batch_id) {
                $expiryStatus = 'no_expiry';
            }

            $product = (object)[
                'id' => $item->product_id,
                'product_id' => $item->product_id,
                'name' => $item->product_name,
                'barcode' => $item->product_barcode,
                'price' => $item->retail_price,
                'retail_price' => $item->retail_price,
                'wholesale_price' => $item->wholesale_price,
                'purchase_price' => $item->purchase_price,
                'stock' => $item->remaining_qty,
                'net_quantity' => $item->remaining_qty,
                'net_value' => $item->net_value,
                'batch_id' => $item->batch_id,
                'batch_reference' => $item->batch_reference,
                'issue_date' => $item->issue_date,
                'expire_date' => $item->expire_date,
                'batch_notes' => $item->batch_notes,
                'days_to_expiry' => $daysToExpiry,
                'expiry_status' => $expiryStatus,
                'unit_type' => $item->unit_type ?? 'retail',
                'unit_id' => $item->unit_id,
                'unit_amount' => $item->unit_amount ?? 1,
                'unit_name' => $item->unit_name,
                'income_qty' => $item->income_qty,
                'outcome_qty' => $item->outcome_qty,
                'total_income_value' => $item->total_income_value,
                'total_outcome_value' => $item->total_outcome_value,
                'batches' => [
                    (object)[
                        'id' => $item->batch_id,
                        'reference_number' => $item->batch_reference,
                        'issue_date' => $item->issue_date,
                        'expire_date' => $item->expire_date,
                        'notes' => $item->batch_notes,
                        'stock' => $item->remaining_qty,
                        'days_to_expiry' => $daysToExpiry,
                        'expiry_status' => $expiryStatus,
                        'unit_type' => $item->unit_type ?? 'retail',
                        'unit_id' => $item->unit_id,
                        'unit_amount' => $item->unit_amount ?? 1,
                        'unit_name' => $item->unit_name,
                        'retail_price' => $item->retail_price,
                        'wholesale_price' => $item->wholesale_price,
                        'purchase_price' => $item->purchase_price,
                    ]
                ],
                'has_multiple_batches' => false,
            ];
        }

        Log::info('Barcode processed successfully', [
            'barcode' => $barcode,
            'product_id' => $product->product_id,
            'batches_count' => count($product->batches ?? [])
        ]);

        return response()->json([
            'success' => true,
            'product' => $product
        ]);
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
            'items.*.batch_id' => 'nullable|exists:batches,id',
            'items.*.batch_reference' => 'nullable|string|max:255',
            'items.*.unit_type' => 'nullable|string|in:retail,wholesale',
            'items.*.unit_name' => 'nullable|string|max:255',
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
                'notes' => $request->input('notes')
            ]);
            //
            $order->customer->deposit($subtotal,['description'=>$order->order_number]);

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
                FacadesLog::info("Processing item: Product ID {$item['product_id']}, Wholesale: " . ($isWholesale ? 'Yes' : 'No') . ", Quantity: {$item['quantity']}, Unit Amount: {$unitAmount}, Actual Units: {$actualUnitsNeeded}");
                
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
                        FacadesLog::warning("Retail price mismatch - using frontend total", [
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
                    'unit_type' => $item['unit_type'] ?? ($isWholesale ? 'wholesale' : 'retail'),
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $isWholesale ? $stockProduct->product->wholesale_unit_id : $stockProduct->product->retail_unit_id,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $item['unit_name'] ?? ($isWholesale ? 
                        ($stockProduct->product->wholesaleUnit->name ?? 'Wholesale Unit') : 
                        ($stockProduct->product->retailUnit->name ?? 'Retail Unit')),
                    'batch_id' => $item['batch_id'] ?? null,
                    'batch_reference' => $item['batch_reference'] ?? null,
                ]);

                // Use actual units for stock outcome
                CustomerStockOutcome::create([
                    'reference_number' => $order->order_number,
                    'customer_id' => $this->getCustomerId(),
                    'product_id' => $item['product_id'],
                    'quantity' => $actualUnitsNeeded, // Use the actual units consumed
                    'price' => $storeUnitPrice,
                    'total' => $item['total'],
                    'unit_type' => $item['unit_type'] ?? ($isWholesale ? 'wholesale' : 'retail'),
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $isWholesale ? $stockProduct->product->wholesale_unit_id : $stockProduct->product->retail_unit_id,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $item['unit_name'] ?? ($isWholesale ? 
                        ($stockProduct->product->wholesaleUnit->name ?? 'Wholesale Unit') : 
                        ($stockProduct->product->retailUnit->name ?? 'Retail Unit')),
                    'notes' => $order->order_number . ($item['batch_reference'] ? ' (Batch: ' . $item['batch_reference'] . ')' : ''),
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
