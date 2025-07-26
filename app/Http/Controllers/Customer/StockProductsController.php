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
     * Display a listing of the customer's stock products with batch tracking
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
                'sort_by' => 'nullable|string',
                'sort_direction' => 'nullable|in:asc,desc',
            ]);

            if ($validator->fails()) {
                return Inertia::render('Customer/StockProducts/Index', [
                    'products' => [],
                    'search' => '',
                    'sort_by' => 'remaining_qty',
                    'sort_direction' => 'desc',
                    'errors' => $validator->errors(),
                ]);
            }

            // Sanitize and get input parameters
            $search = $request->input('search', '');
            $perPage = (int) $request->input('per_page', 15);
            $sortBy = $request->input('sort_by', 'remaining_qty');
            $sortDirection = $request->input('sort_direction', 'desc');

            // Ensure the current user has a valid customer association
            $customer = Auth::guard('customer_user')->user()->customer;
            if (!$customer) {
                Log::warning('Stock products access attempted without valid customer association', [
                    'user_id' => Auth::guard('customer_user')->id(),
                    'ip' => $request->ip()
                ]);

                return redirect()->route('customer.login');
            }

            // Get customer inventory data directly from the view
            $customerInventory = DB::table('customer_inventory')
                ->where('customer_id', $customer->id)
                ->when($search, function ($query) use ($search) {
                    $query->where(function ($q) use ($search) {
                        $searchParam = '%' . addslashes($search) . '%';
                        $q->where('product_name', 'like', $searchParam)
                            ->orWhere('product_barcode', 'like', $searchParam)
                            ->orWhere('batch_reference', 'like', $searchParam);
                    });
                })
                ->orderBy($sortBy, $sortDirection)
                ->orderBy('expire_date', 'asc')
                ->orderBy('batch_id', 'desc')
                ->paginate($perPage)
                ->through(function ($item) {
                    // Calculate additional fields based on view data
                    $netQuantity = $item->remaining_qty ?? 0;
                    $netValue = ($item->total_income_value ?? 0) - ($item->total_outcome_value ?? 0);
                    $avgPricePerUnit = ($item->income_qty ?? 0) > 0 ? ($item->total_income_value ?? 0) / ($item->income_qty ?? 1) : 0;
                    $profit = ($item->total_outcome_value ?? 0) - ($item->total_income_value ?? 0);

                    return [
                        'customer_id' => $item->customer_id,
                        'customer_name' => $item->customer_name,
                        'customer_email' => $item->customer_email,
                        'customer_phone' => $item->customer_phone,
                        'product_id' => $item->product_id,
                        'product' => [
                            'id' => $item->product_id,
                            'name' => $item->product_name,
                            'barcode' => $item->product_barcode,
                            'type' => 'Product', // Default type since not in view
                            'is_activated' => true, // Default value
                            'is_in_stock' => $netQuantity > 0,
                        ],
                        'batch_id' => $item->batch_id,
                        'batch_reference' => $item->batch_reference,
                        'issue_date' => $item->issue_date,
                        'expire_date' => $item->expire_date,
                        'batch_notes' => $item->batch_notes,
                        'income_qty' => $item->income_qty ?? 0,
                        'outcome_qty' => $item->outcome_qty ?? 0,
                        'remaining_qty' => $netQuantity,
                        'total_income_value' => $item->total_income_value ?? 0,
                        'total_outcome_value' => $item->total_outcome_value ?? 0,
                        'net_quantity' => $netQuantity,
                        'net_value' => $netValue,
                        'expiry_status' => $item->expiry_status,
                        'days_to_expiry' => $item->days_to_expiry,
                        // Unit information
                        'unit_type' => $item->unit_type,
                        'unit_id' => $item->unit_id,
                        'unit_amount' => $item->unit_amount,
                        'unit_name' => $item->unit_name,
                        // Pricing information from batch
                        'purchase_price' => $item->purchase_price ?? 0,
                        'wholesale_price' => $item->wholesale_price ?? 0,
                        'retail_price' => $item->retail_price ?? 0,
                        // Calculate average price per unit
                        'avg_price_per_unit' => $avgPricePerUnit,
                        // Calculate profit for this batch
                        'profit' => $profit,
                        // Additional batch properties
                        'purchase_id' => $item->purchase_id,
                        'purchase_item_id' => $item->purchase_item_id,
                        'is_wholesale' => $item->is_wholesale ?? false,
                        'batch_price' => $item->price ?? 0,
                        'batch_total' => $item->total ?? 0,
                        'batch_quantity' => $item->quantity ?? 0,
                        'created_at' => now(),
                        'updated_at' => now(),
                    ];
                });

            // Add query string to pagination links
            $customerInventory->appends($request->query());

            // Send Telegram message for each expired product
            try {
                $customerUser = Auth::guard('customer_user')->user();
                if ($customerUser && $customerUser->chat_id) {
                    $telegramService = app(\App\Services\TelegramService::class);
                    foreach ($customerInventory as $product) {
                        if ((isset($product['expiry_status']) && $product['expiry_status'] === 'expired') || (isset($product['days_to_expiry']) && $product['days_to_expiry'] < 0)) {
                            $message = "⚠️ *محصول منقضی شده!*

";
                            $message .= "*نام محصول:* `{$product['product']['name']}`\n";
                            $message .= "*بارکد:* `{$product['product']['barcode']}`\n";
                            $message .= "*شماره بچ:* `{$product['batch_reference']}`\n";
                            $message .= "*تاریخ انقضا:* `{$product['expire_date']}`\n";
                            $message .= "*مقدار باقی‌مانده:* `{$product['remaining_qty']}`\n";
                            $message .= "\n*اطلاعات مشتری:*\n". auth()->user()?->customer?->name;
                            $message .= "\n*تلفن:* `". auth()->user()?->customer?->phone."`\n";
                            $message .= "\n*ایمیل:* `". auth()->user()?->customer?->email."`\n";
                            $message .= "\nلطفاً نسبت به این محصول منقضی شده اقدام نمایید.";
                            $telegramService->queueMessage($message, $customerUser->chat_id, 'Markdown');
                        }
                    }
                }
            } catch (\Exception $e) {
                Log::error('Failed to send Telegram notification for expired products', [
                    'error' => $e->getMessage(),
                    'user_id' => $customerUser->id ?? null,
                ]);
            }

            return Inertia::render('Customer/StockProducts/Index', [
                'products' => $customerInventory,
                'search' => $search,
                'sort_by' => $sortBy,
                'sort_direction' => $sortDirection,
                'filters' => $request->only(['search', 'sort_by', 'sort_direction', 'per_page']),
            ]);
        } catch (ValidationException $e) {
            return Inertia::render('Customer/StockProducts/Index', [
                'products' => [],
                'search' => $request->input('search', ''),
                'sort_by' => $request->input('sort_by', 'remaining_qty'),
                'sort_direction' => $request->input('sort_direction', 'desc'),
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
                'products' => [],
                'search' => $request->input('search', ''),
                'sort_by' => $request->input('sort_by', 'remaining_qty'),
                'sort_direction' => $request->input('sort_direction', 'desc'),
                'errors' => ['database' => 'A database error occurred. Please try again later.'],
            ]);
        } catch (\Exception $e) {
            Log::error('Error in stock products', [
                'message' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'user_id' => Auth::guard(name: 'customer_user')->id(),
                'customer_id' => Auth::guard('customer_user')->user()->customer_id ?? null,
                'ip' => $request->ip(),
            ]);

            return Inertia::render('Customer/StockProducts/Index', [
                'products' => [],
                'search' => $request->input('search', ''),
                'sort_by' => $request->input('sort_by', 'remaining_qty'),
                'sort_direction' => $request->input('sort_direction', 'desc'),
                'errors' => ['general' => 'An error occurred while loading your stock products.'],
            ]);
        }
    }
}
