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
use App\Services\TelegramService;
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
            (object) ['id' => 'cash', 'name' => __('Cash')],
            (object) ['id' => 'card', 'name' => __('Card')],
            (object) ['id' => 'bank_transfer', 'name' => __('Bank Transfer')]
        ];

        // Set default tax percentage
        $tax_percentage = 0; // You can adjust this or pull from config if needed

        // Define default currency
        $defaultCurrency = (object) [
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
            ->join('products', 'customer_inventory.product_id', '=', 'products.id')
            ->leftJoin('units as retail_units', 'products.retail_unit_id', '=', 'retail_units.id')
            ->leftJoin('units as wholesale_units', 'products.wholesale_unit_id', '=', 'wholesale_units.id')
            ->where('customer_inventory.customer_id', $this->getCustomerId())
            ->where('customer_inventory.product_barcode', $barcode)
            ->where('customer_inventory.remaining_qty', '>', 0)
            ->select(
                'customer_inventory.*',
                'products.*',
                'retail_units.name as retail_unit_name',
                'wholesale_units.name as wholesale_unit_name',
                'customer_inventory.product_id',
                'customer_inventory.product_name',
                'customer_inventory.product_barcode',
                'customer_inventory.batch_id',
                'customer_inventory.batch_reference',
                'customer_inventory.issue_date',
                'customer_inventory.expire_date',
                'customer_inventory.batch_notes',
                'customer_inventory.remaining_qty',
                'customer_inventory.retail_price',
                'customer_inventory.wholesale_price',
                'customer_inventory.purchase_price',
                'customer_inventory.unit_type',
                'customer_inventory.unit_id',
                'customer_inventory.unit_amount',
                'customer_inventory.unit_name as inventory_unit_name',
                'customer_inventory.income_qty',
                'customer_inventory.outcome_qty',
                'customer_inventory.total_income_value',
                'customer_inventory.total_outcome_value'
            )
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

                // Determine unit names: retail from product, wholesale from inventory
                $retailUnitName = DB::table('products')
                    ->select('units.name as retail_unit_name')
                    ->where('products.id', $item->product_id)
                    ->join('units', 'products.retail_unit_id', '=', 'units.id')
                    ->first()
                    ->retail_unit_name;



                $wholesaleUnitName = $item->inventory_unit_name ?: $item->wholesale_unit_name ?: 'Wholesale Unit';

                return (object) [
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
                    'retail_unit_name' => $retailUnitName,
                    'wholesale_unit_name' => $wholesaleUnitName,
                    'retail_price' => $item->retail_price,
                    'wholesale_price' => $item->wholesale_price,
                    'purchase_price' => $item->purchase_price,
                ];
            });

            // Use retail unit name from product for main product info
            $retailUnitName = DB::table('products')
                ->select('units.name as retail_unit_name')
                ->where('products.id', $firstItem->product_id)
                ->join('units', 'products.unit_id', '=', 'units.id')
                ->first()
                ->retail_unit_name;
            $wholesaleUnitName = $firstItem->inventory_unit_name ?: $firstItem->wholesale_unit_name ?: 'Wholesale Unit';

            $product = (object) [
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
                'retail_unit_name' => $retailUnitName,
                'wholesale_unit_name' => $wholesaleUnitName,
                'wholesale_unit_amount' => $firstItem->whole_sale_unit_amount ?? $firstItem->unit_amount ?? 1,
                'unit_name' => $retailUnitName, // Default unit name for frontend compatibility
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

            // Determine unit names: retail from product, wholesale from inventory
            $retailUnitName =
                DB::table('products')
                    ->select('units.name as retail_unit_name')
                    ->where('products.id', $item->product_id)
                    ->join('units', 'products.unit_id', '=', 'units.id')
                    ->first()
                    ->retail_unit_name


                ?: 'Piece';
            $wholesaleUnitName = $item->inventory_unit_name ?: $item->wholesale_unit_name ?: 'Wholesale Unit';

            $product = (object) [
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
                'retail_unit_name' => $retailUnitName,
                'wholesale_unit_name' => $wholesaleUnitName,
                'wholesale_unit_amount' => $item->whole_sale_unit_amount ?? $item->unit_amount ?? 1,
                'unit_name' => $retailUnitName, // Default unit name for frontend compatibility
                'income_qty' => $item->income_qty,
                'outcome_qty' => $item->outcome_qty,
                'total_income_value' => $item->total_income_value,
                'total_outcome_value' => $item->total_outcome_value,
                'batches' => [
                    (object) [
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
                        'retail_unit_name' => $retailUnitName,
                        'wholesale_unit_name' => $wholesaleUnitName,
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
            ->where(function ($q) use ($query) {
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
            'items.*.batch_number' => 'nullable|string|max:255',
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
            $order->customer->deposit($subtotal, ['description' => $order->order_number]);

            // Process each order item
            foreach ($items as $item) {
                // First get the product and inventory information with unit relationships
                $stockProduct = CustomerStockProduct::with(['product.unit'])
                    ->where('customer_id', $this->getCustomerId())
                    ->where('product_id', $item['product_id'])
                    ->first();

                if (!$stockProduct) {
                    $product = Product::with('unit')->find($item['product_id']);
                    $productName = $product ? $product->name : 'Unknown Product';
                    throw new \Exception("Product not found: {$productName}");
                }

                // Get inventory data for unit information
                $inventoryData = \DB::table('customer_inventory')
                    ->where('customer_id', $this->getCustomerId())
                    ->where('product_id', $item['product_id']);

                if (isset($item['batch_id']) && $item['batch_id']) {
                    $inventoryData = $inventoryData->where('batch_id', $item['batch_id']);
                } else {
                    $inventoryData = $inventoryData->whereNull('batch_id');
                }

                $inventoryData = $inventoryData->first();

                // Determine if this is wholesale or retail based on unit_type
                $isWholesale = isset($item['unit_type']) && $item['unit_type'] === 'wholesale';

                // Get unit information from product and inventory
                $product = $stockProduct->product;
                $retailUnit = $product->unit?->name;

                // Set unit information based on wholesale/retail
                if ($isWholesale) {
                    // Wholesale: get unit from inventory/customer_inventory
                    $unitAmount = $item['unit_amount'] ?? ($product->whole_sale_unit_amount ?? 1);
                    $unitId = $product->wholesale_unit_id ?? ($inventoryData ? $inventoryData->unit_id : null);
                    $unitName = $inventoryData ? $inventoryData->unit_name : ($product->unit?->name ?? 'Wholesale Unit');
                    $unitPrice = $product->wholesale_price ?? 0;

                    // For wholesale: quantity * unit_amount = actual units needed
                    $actualUnitsNeeded = $item['quantity'] * $unitAmount; // e.g., 2 boxes * 12 pieces = 24 pieces
                } else {
                    // Retail: get unit from product table
                    $unitAmount = 1; // Retail quantity represents individual pieces
                    $unitId = $product->retail_unit_id;
                    $unitName = $retailUnit ? $retailUnit : 'Piece';
                    $unitPrice = $product->retail_price ?? 0;

                    // For retail: quantity represents individual units
                    $actualUnitsNeeded = $item['quantity']; // e.g., 5 pieces = 5 pieces
                }

                // Verify sufficient stock
                if ($stockProduct->net_quantity < $actualUnitsNeeded) {
                    $productName = $stockProduct->product->name;
                    throw new \Exception("Insufficient stock for product: {$productName}. Required: {$actualUnitsNeeded}, Available: {$stockProduct->net_quantity}");
                }

                $storeQuantity = $actualUnitsNeeded; // Always store actual units consumed
                $frontendTotal = floatval($item['total']); // What the frontend calculated and customer saw

                // Log for debugging
                FacadesLog::info("Processing item: Product ID {$item['product_id']}, Wholesale: " . ($isWholesale ? 'Yes' : 'No') . ", Quantity: {$item['quantity']}, Unit Amount: {$unitAmount}, Actual Units: {$actualUnitsNeeded}");

                // Log price information for debugging
                FacadesLog::info("Price information for product {$item['product_id']}:", [
                    'wholesale_price' => $product->wholesale_price,
                    'retail_price' => $product->retail_price,
                    'item_price' => $item['price'] ?? 'not set',
                    'frontend_total' => $frontendTotal,
                    'is_wholesale' => $isWholesale,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName
                ]);

                // Calculate unit price and subtotal
                if ($isWholesale) {
                    // For wholesale: Use wholesale price per individual unit
                    $storeUnitPrice = $unitPrice;
                    $calculatedSubtotal = $actualUnitsNeeded * $storeUnitPrice;

                    // If wholesale price is null or 0, calculate from frontend total
                    if ($storeUnitPrice <= 0) {
                        $storeUnitPrice = $storeQuantity > 0 ? ($frontendTotal / $storeQuantity) : 0;
                        $calculatedSubtotal = $frontendTotal;
                    }
                } else {
                    // For retail: Use retail price per individual unit
                    $storeUnitPrice = $unitPrice;
                    $calculatedSubtotal = $actualUnitsNeeded * $storeUnitPrice;

                    // If retail price is null or 0, use frontend total
                    if ($storeUnitPrice <= 0) {
                        $storeUnitPrice = $storeQuantity > 0 ? ($frontendTotal / $storeQuantity) : 0;
                        $calculatedSubtotal = $frontendTotal;
                    } else {
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
                }

                // Ensure unit price is never null or negative
                if ($storeUnitPrice <= 0) {
                    // Fallback to item price if available
                    $storeUnitPrice = floatval($item['price'] ?? 0);

                    // If still 0, calculate from total
                    if ($storeUnitPrice <= 0) {
                        $storeUnitPrice = $storeQuantity > 0 ? ($frontendTotal / $storeQuantity) : 0;
                    }
                }

                // Final validation to ensure unit price is valid
                if ($storeUnitPrice <= 0) {
                    throw new \Exception("Invalid unit price for product: {$stockProduct->product->name}. Unit price cannot be zero or negative.");
                }

                // Log final unit price for debugging
                FacadesLog::info("Final unit price for product {$item['product_id']}: {$storeUnitPrice}", [
                    'product_name' => $stockProduct->product->name,
                    'is_wholesale' => $isWholesale,
                    'store_quantity' => $storeQuantity,
                    'calculated_subtotal' => $calculatedSubtotal,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName
                ]);

                // Create stock outcome first to get the outcome_id
                $stockOutcome = CustomerStockOutcome::create([
                    'reference_number' => $order->order_number,
                    'customer_id' => $this->getCustomerId(),
                    'product_id' => $item['product_id'],
                    'quantity' => $actualUnitsNeeded, // Use the actual units consumed
                    'price' => $storeUnitPrice,
                    'total' => $item['total'],
                    'unit_type' => $isWholesale ? 'wholesale' : 'retail',
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'batch_id' => $item['batch_id'] ?? null,
                    'batch_reference' => $item['batch_reference'] ?? null,
                    'batch_number' => $item['batch_number'] ?? $item['batch_reference'] ?? null,
                    'notes' => $order->order_number . ($item['batch_reference'] ? ' (Batch: ' . $item['batch_reference'] . ')' : ''),
                    'model_type' => MarketOrder::class,
                    'model_id' => $order->id
                ]);

                // Create market order item with reference to the stock outcome
                MarketOrderItem::create([
                    'market_order_id' => $order->id,
                    'product_id' => $item['product_id'],
                    'quantity' => $storeQuantity, // Store actual individual units (e.g., 24 pieces for 2 boxes)
                    'unit_price' => $storeUnitPrice, // Price per individual unit (calculated or from DB)
                    'subtotal' => $calculatedSubtotal, // Use validated/frontend subtotal
                    'discount_amount' => 0,
                    'unit_type' => $isWholesale ? 'wholesale' : 'retail',
                    'is_wholesale' => $isWholesale,
                    'unit_id' => $unitId,
                    'unit_amount' => $unitAmount,
                    'unit_name' => $unitName,
                    'outcome_id' => $stockOutcome->id, // Link to the created stock outcome
                ]);
            }

            DB::commit();

            // Send Telegram notification
            $this->sendOrderCompletionNotification($order, $items, $amountPaid, $accountId);

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
     * Send Telegram notification for order completion
     */
    private function sendOrderCompletionNotification($order, $items, $amountPaid, $accountId = null): void
    {
        try {
            $telegramService = app(TelegramService::class);

            // Get the authenticated user's chat ID
            $user = auth()->guard('customer_user')->user();
            if (!$user || !$user->chat_id) {
                return; // No chat ID configured, skip notification
            }

            // Create detailed message
            $message = $this->createOrderCompletionMessage($order, $items, $amountPaid, $accountId);

            // Queue the Telegram message
            $telegramService->queueMessage(
                $message,
                $user->chat_id,
                'Markdown'
            );

        } catch (\Exception $e) {
            // Log error but don't throw to avoid breaking the main operation
            FacadesLog::error('Failed to send Telegram notification for order completion', [
                'order_id' => $order->id,
                'error' => $e->getMessage()
            ]);
        }
    }

    /**
     * Create detailed Persian message for order completion
     */
    private function createOrderCompletionMessage($order, $items, $amountPaid, $accountId = null): string
    {
        $user = auth()->guard('customer_user')->user();
        $customer = $user->customer;
        $account = $accountId ? Account::find($accountId) : null;

        $message = "*🎉 سفارش با موفقیت تکمیل شد*\n\n";

        // Order Information
        $message .= "📋 *اطلاعات سفارش:*\n";
        $message .= "🔢 شماره سفارش: `{$order->order_number}`\n";
        $message .= "💰 مبلغ کل: `" . number_format($order->total_amount) . " افغانی`\n";
        $message .= "💳 روش پرداخت: `{$this->getPaymentMethodName($order->payment_method)}`\n";
        $message .= "💵 مبلغ پرداخت شده: `" . number_format($amountPaid) . " افغانی`\n";

        if ($amountPaid < $order->total_amount) {
            $remaining = $order->total_amount - $amountPaid;
            $message .= "⚖️ مانده: `" . number_format($remaining) . " افغانی`\n";
            if ($account) {
                $message .= "🏦 حساب مانده: `{$account->name}` ({$account->account_number})\n";
            }
        }

        $message .= "📅 زمان سفارش: `" . $order->created_at->format('Y-m-d H:i:s') . "`\n\n";

        // Customer Information
        $message .= "👤 *اطلاعات مغازه:*\n";
        $message .= "🏢 نام مغازه: `{$customer->name}`\n";
        $message .= "📍 آدرس: `{$customer->address}`\n";
        $message .= "📞 تلفن: `{$customer->phone}`\n";
        $message .= "👨‍💼 کاربر: `{$user->name}`\n\n";

        // Items Information
        $message .= "📦 *اقلام سفارش:*\n";
        $totalItems = 0;

        foreach ($items as $index => $item) {
            $totalItems++;

            // Get product information
            $product = Product::with('unit')->find($item['product_id']);
            $isWholesale = $item['is_wholesale'] ?? false;
            $unitAmount = $item['unit_amount'] ?? 1;
            $unitName = ($isWholesale) ? $item['unit_name'] : $product->unit?->name;

            $message .= "\n*{$totalItems}. {$product->name}*\n";

            $message .= "📊 تعداد: `{$item['quantity']}  {$unitName}`\n";


            $message .= "💰 قیمت واحد: `" . number_format($item['price']) . " افغانی`\n";
            $message .= "💵 مجموع: `" . number_format($item['total']) . " افغانی`\n";
            $message .= "🏷️ نوع: `" . ($isWholesale ? 'عمده فروشی' : 'خرده فروشی') . "`\n";

            // Batch information if available
            if (!empty($item['batch_reference'])) {
                $message .= "📦 شماره دسته: `{$item['batch_reference']}`\n";

                // Get batch details
                $batch = \DB::table('customer_inventory')
                    ->where('customer_id', $this->getCustomerId())
                    ->where('product_id', $item['product_id'])
                    ->where('batch_reference', $item['batch_reference'])
                    ->first();

                if ($batch) {
                    if ($batch->issue_date) {
                        $message .= "📅 تاریخ تولید: `{$batch->issue_date}`\n";
                    }
                    if ($batch->expire_date) {
                        $message .= "⏰ تاریخ انقضا: `{$batch->expire_date}`\n";

                        // Calculate days to expiry
                        $daysToExpiry = now()->diffInDays($batch->expire_date, false);
                        if ($daysToExpiry < 0) {
                            $message .= "⚠️ وضعیت: `منقضی شده`\n";
                        } elseif ($daysToExpiry <= 30) {
                            $message .= "🔶 وضعیت: `نزدیک به انقضا ({$daysToExpiry} روز)`\n";
                        } else {
                            $message .= "✅ وضعیت: `سالم ({$daysToExpiry} روز تا انقضا)`\n";
                        }
                    }

                    // Remaining stock after this order
                    $remainingStock = $batch->remaining_qty - ($isWholesale ? $item['quantity'] * $unitAmount : $item['quantity']);
                    $message .= "📊 موجودی باقی مانده: `{$remainingStock} " . ($product->unit?->name ?? 'واحد') . "`\n";
                }
            }
        }

        $message .= "\n📊 *خلاصه:*\n";
        $message .= "🛍️ تعداد کل اقلام: `{$totalItems}`\n";
        $message .= "💰 مبلغ کل: `" . number_format($order->total_amount) . " افغانی`\n";
        $message .= "✅ وضعیت: `تکمیل شده`\n\n";

        if (!empty($order->notes)) {
            $message .= "📝 یادداشت: `{$order->notes}`\n\n";
        }

        $message .= "🕐 زمان ارسال: " . now()->format('Y-m-d H:i:s');

        return $message;
    }

    /**
     * Get Persian payment method name
     */
    private function getPaymentMethodName($method): string
    {
        $methods = [
            'cash' => 'نقدی',
            'card' => 'کارت',
            'bank_transfer' => 'انتقال بانکی'
        ];

        return $methods[$method] ?? $method;
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
