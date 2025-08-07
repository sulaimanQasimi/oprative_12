<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class SalesListController extends Controller
{
    public function index(Request $request)
    {
        $request->validate([
            'search' => 'nullable|string|max:255',
            'dateFrom' => 'nullable|date',
            'dateTo' => 'nullable|date|after_or_equal:dateFrom',
            'status' => ['nullable', Rule::in(['completed', 'pending', 'cancelled', ''])],
            'confirmedByWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'confirmedByShop' => ['nullable', Rule::in(['0', '1', ''])],
            'confirmedByStoreByWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'movedFromWarehouse' => ['nullable', Rule::in(['0', '1', ''])],
            'sortField' => ['nullable', Rule::in(['reference', 'date', 'total_amount', 'status'])],
            'sortDirection' => ['nullable', Rule::in(['asc', 'desc'])],
        ]);

        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;
        $sales = Sale::query()
            ->with(['customer', 'warehouse'])
            ->where('customer_id', $customer->id)
            ->when($request->search, function ($query) use ($request) {
                $query->where(function ($q) use ($request) {
                    $q->where('reference', 'like', '%' . $request->search . '%')
                      ->orWhereHas('customer', function ($q) use ($request) {
                          $q->where('name', 'like', '%' . $request->search . '%');
                      });
                });
            })
            ->when($request->dateFrom, function ($query) use ($request) {
                $query->whereDate('date', '>=', $request->dateFrom);
            })
            ->when($request->dateTo, function ($query) use ($request) {
                $query->whereDate('date', '<=', $request->dateTo);
            })
            ->when($request->status, function ($query) use ($request) {
                $query->where('status', $request->status);
            })
            ->when($request->confirmedByWarehouse, function ($query) use ($request) {
                $query->where('confirmed_by_warehouse', $request->confirmedByWarehouse === '1');
            })
            ->when($request->confirmedByShop, function ($query) use ($request) {
                $query->where('confirmed_by_shop', $request->confirmedByShop === '1');
            })
            ->when($request->confirmedByStoreByWarehouse, function ($query) use ($request) {
                if ($request->confirmedByStoreByWarehouse === '1') {
                    $query->where('confirmed_by_warehouse', true)->where('confirmed_by_shop', true);
                } else {
                    $query->where(function ($q) {
                        $q->where('confirmed_by_warehouse', false)->orWhere('confirmed_by_shop', false);
                    });
                }
            })
            ->when($request->movedFromWarehouse, function ($query) use ($request) {
                $query->where('moved_from_warehouse', $request->movedFromWarehouse === '1');
            })
            ->orderBy($request->sortField ?? 'date', $request->sortDirection ?? 'desc')
            ->paginate(10)
            ->appends($request->except('page'));

        // Transform the sales data to include the new field
        $sales->getCollection()->transform(function ($sale) {
            $sale->confirmed_by_store_by_warehouse = $sale->confirmed_by_warehouse && $sale->confirmed_by_shop;
            return $sale;
        });
        
        return Inertia::render('Customer/Sales/Index', [
            'sales' => $sales,
            'filters' => $request->only(['search', 'status', 'confirmedByWarehouse', 'confirmedByShop', 'confirmedByStoreByWarehouse']),
        ]);
    }

    public function show($saleId)
    {
        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;
        $sale = Sale::where('customer_id', $customer->id)
            ->findOrFail($saleId);

        // Load relationships with batch information
        $sale->load([
            'saleItems.product.unit',
            'saleItems.batch',
            'customer',
            'currency',
            'payments',
            'warehouse'
        ]);
        return Inertia::render('Customer/Sales/Show', [
            'sale' => $sale
        ]);
    }

    public function addPayment(Request $request, $saleId)
    {
        
        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;
        $sale = Sale::where('customer_id', $customer->id)
            ->findOrFail($saleId);

        $request->validate([
            'paymentAmount' => 'required|numeric|min:0|max:' . $sale->due_amount,
            'paymentDate' => 'required|date',
            'paymentNotes' => 'nullable|string|max:255',
        ]);

        try {
            DB::beginTransaction();

            $sale->payments()->create([
                'amount' => $request->paymentAmount,
                'date' => $request->paymentDate,
                'notes' => $request->paymentNotes,
            ]);

            DB::commit();

            return response()->json([
                'message' => __('Payment added successfully.'),
                'success' => true
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => __('Error adding payment. Please try again.'),
                'success' => false
            ], 500);
        }
    }

    public function confirmSale($saleId)
    {
        // Get the authenticated customer
        $customer = Auth::guard('customer_user')->user()->customer;
        $sale = Sale::where('customer_id', $customer->id)
            ->findOrFail($saleId);

        if (!$sale->confirmed_by_warehouse) {
            return response()->json([
                'message' => __('Cannot confirm sale. Warehouse confirmation is required first.'),
                'success' => false
            ], 400);
        }

        try {
            DB::beginTransaction();

            $sale->update([
                'confirmed_by_shop' => true,
                'confirmed_at' => now(),
            ]);

            DB::commit();

            return redirect()->back();
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => __('Error confirming sale. Please try again.'),
                'success' => false
            ], 500);
        }
    }
}
