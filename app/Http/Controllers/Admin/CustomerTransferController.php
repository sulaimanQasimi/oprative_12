<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\{Customer, Product, Batch, CustomerTransfer, CustomerTransferItem};
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\{DB, Log, Auth};
use Carbon\Carbon;

class CustomerTransferController extends Controller
{
    public function index(Request $request)
    {
        try {
            $query = CustomerTransfer::with(['fromCustomer', 'toCustomer', 'transferItems.product', 'transferItems.batch', 'creator']);

            // Apply search filter
            if ($request->filled('search')) {
                $search = $request->search;
                $query->where(function ($q) use ($search) {
                    $q->where('reference_number', 'like', "%{$search}%")
                      ->orWhere('id', 'like', "%{$search}%")
                      ->orWhereHas('fromCustomer', function ($customerQuery) use ($search) {
                          $customerQuery->where('name', 'like', "%{$search}%")
                                        ->orWhere('email', 'like', "%{$search}%");
                      })
                      ->orWhereHas('toCustomer', function ($customerQuery) use ($search) {
                          $customerQuery->where('name', 'like', "%{$search}%")
                                        ->orWhere('email', 'like', "%{$search}%");
                      })
                      ->orWhereHas('transferItems.product', function ($productQuery) use ($search) {
                          $productQuery->where('name', 'like', "%{$search}%")
                                      ->orWhere('barcode', 'like', "%{$search}%");
                      });
                });
            }

            // Apply date filters
            if ($request->filled('date_from')) {
                $query->whereDate('created_at', '>=', $request->date_from);
            }
            if ($request->filled('date_to')) {
                $query->whereDate('created_at', '<=', $request->date_to);
            }

            // Apply status filter
            if ($request->filled('status')) {
                $query->where('status', $request->status);
            }

            // Apply customer filter
            if ($request->filled('customer_id')) {
                $query->where(function ($q) use ($request) {
                    $q->where('from_customer_id', $request->customer_id)
                      ->orWhere('to_customer_id', $request->customer_id);
                });
            }

            $transfers = $query->orderBy('created_at', 'desc')->paginate(15);

            return Inertia::render('Admin/CustomerTransfers/Index', [
                'transfers' => $transfers,
                'filters' => $request->only(['search', 'date_from', 'date_to', 'status', 'customer_id']),
                'customers' => Customer::select('id', 'name', 'email')->get(),
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CustomerTransferController@index: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while loading transfers.');
        }
    }

    public function create()
    {
        try {
            $customers = Customer::select('id', 'name', 'email', 'phone')->get();
            $products = Product::select('id', 'name', 'barcode', 'type')->get();

            return Inertia::render('Admin/CustomerTransfers/Create', [
                'customers' => $customers,
                'products' => $products,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CustomerTransferController@create: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while loading the create form.');
        }
    }

    public function store(Request $request)
    {
        try {
            $validated = $request->validate([
                'from_customer_id' => 'required|exists:customers,id',
                'to_customer_id' => 'required|exists:customers,id|different:from_customer_id',
                'transfer_items' => 'required|array|min:1',
                'transfer_items.*.product_id' => 'required|exists:products,id',
                'transfer_items.*.batch_id' => 'nullable|exists:batches,id',
                'transfer_items.*.quantity' => 'required|numeric|min:0.01',
                'transfer_items.*.unit_price' => 'required|numeric|min:0',
                'transfer_items.*.unit_id' => 'nullable|exists:units,id',
                'transfer_items.*.unit_amount' => 'nullable|numeric|min:1',
                'transfer_items.*.unit_name' => 'nullable|string',
                'notes' => 'nullable|string|max:1000',
            ]);

            DB::beginTransaction();

            // Generate reference number
            $referenceNumber = 'CTRF-' . date('Ymd') . '-' . str_pad(rand(1, 9999), 4, '0', STR_PAD_LEFT);

            // Create transfer record
            $transfer = CustomerTransfer::create([
                'reference_number' => $referenceNumber,
                'from_customer_id' => $validated['from_customer_id'],
                'to_customer_id' => $validated['to_customer_id'],
                'status' => 'pending',
                'notes' => $validated['notes'] ?? null,
                'created_by' => Auth::id(),
                'transfer_date' => now(),
            ]);
            // Create transfer items
            foreach ($validated['transfer_items'] as $itemData) {
                // Get batch
                $batch=Batch::find($itemData['batch_id']);
                // Get unit price
                $unitPrice=$batch->purchase_price;
                // Get actual quantity
                $actualQuantity=$itemData['quantity']*$batch->unit_amount;
                // Get total price
                $totalPrice = $itemData['quantity'] * $unitPrice;
                
                // Create transfer item
                CustomerTransferItem::create([
                    'customer_transfer_id' => $transfer->id,
                    'product_id' => $itemData['product_id'],
                    'batch_id' => $itemData['batch_id'] ?? null,
                    'quantity' => $actualQuantity,
                    'unit_price' => $unitPrice,
                    'total_price' => $totalPrice,
                    'unit_type' => $batch->unit_type,
                    'unit_id' => $itemData['unit_id'] ?? null,
                    'unit_amount' => $itemData['unit_amount'] ?? 1,
                    'unit_name' => $itemData['unit_name'] ?? null,
                    'notes' => $itemData['notes'] ?? null,
                
                ]);

                // Create batch inventory record





                // Create customer income record for to_customer
                \App\Models\CustomerStockIncome::create([
                    'customer_id' => $validated['to_customer_id'],
                    'product_id' => $itemData['product_id'],
                    'reference_number' => $referenceNumber,
                    'quantity' => $actualQuantity,
                    'price' => $unitPrice,
                    'total' => $totalPrice,
                    'model_id' => $transfer->id,
                    'model_type' => 'App\Models\CustomerTransfer',
                    'unit_id' => $itemData['unit_id'] ?? null,
                    'unit_type' => $batch->unit_type,
                    'unit_amount' => $itemData['unit_amount'] ?? 1,
                    'unit_name' => $itemData['unit_name'] ?? null,
                    'batch_id' => $itemData['batch_id'] ?? null,
                    'is_wholesale' => true,
                ]);

                // Create customer outcome record for customer tracking

                \App\Models\CustomerStockOutcome::create([
                    'customer_id' => $validated['from_customer_id'],
                    'product_id' => $itemData['product_id'],
                    'reference_number' => $referenceNumber,
                    'quantity' => $actualQuantity,
                    'price' => $unitPrice,
                    'total' => $totalPrice,
                    'model_id' => $transfer->id,
                    'model_type' => 'App\Models\CustomerTransfer',
                    'unit_id' => $itemData['unit_id'] ?? null,
                    'unit_type' => $batch->unit_type,
                    'unit_amount' => $itemData['unit_amount'] ?? 1,
                    'unit_name' => $itemData['unit_name'] ?? null,
                    'batch_id' => $itemData['batch_id'] ?? null,
                    'is_wholesale' => true,
                ]);
            }

            DB::commit();

            return redirect()->route('admin.customer-transfers.show', $transfer)
                           ->with('success', 'Customer transfer created successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in CustomerTransferController@store: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while creating the transfer.');
        }
    }

    public function show(CustomerTransfer $transfer)
    {
        try {
            $transfer->load([
                'fromCustomer',
                'toCustomer',
                'transferItems.product',
                'transferItems.batch',
                'transferItems.unit',
                'creator'
            ]);

            return Inertia::render('Admin/CustomerTransfers/Show', [
                'transfer' => $transfer,
            ]);
        } catch (\Exception $e) {
            Log::error('Error in CustomerTransferController@show: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while loading the transfer details.');
        }
    }

    public function complete(CustomerTransfer $transfer)
    {
        try {
            if ($transfer->status !== 'pending') {
                return back()->with('error', 'Only pending transfers can be completed.');
            }

            DB::beginTransaction();

            // Complete the transfer
            $transfer->complete();

            // Here you would typically update inventory for both customers
            // This is a placeholder for the inventory logic
            foreach ($transfer->transferItems as $item) {
                // Reduce inventory from from_customer
                // Add inventory to to_customer
                // This would depend on your inventory management system
            }

            DB::commit();

            return back()->with('success', 'Transfer completed successfully.');

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Error in CustomerTransferController@complete: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while completing the transfer.');
        }
    }

    public function cancel(CustomerTransfer $transfer)
    {
        try {
            if ($transfer->status !== 'pending') {
                return back()->with('error', 'Only pending transfers can be cancelled.');
            }

            $transfer->cancel();

            return back()->with('success', 'Transfer cancelled successfully.');

        } catch (\Exception $e) {
            Log::error('Error in CustomerTransferController@cancel: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while cancelling the transfer.');
        }
    }

    public function destroy(CustomerTransfer $transfer)
    {
        try {
            if ($transfer->status !== 'pending') {
                return back()->with('error', 'Only pending transfers can be deleted.');
            }

            $transfer->delete();

            return redirect()->route('admin.customer-transfers.index')
                           ->with('success', 'Transfer deleted successfully.');

        } catch (\Exception $e) {
            Log::error('Error in CustomerTransferController@destroy: ' . $e->getMessage());
            return back()->with('error', 'An error occurred while deleting the transfer.');
        }
    }
} 