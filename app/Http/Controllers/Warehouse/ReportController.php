<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\Sale;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Log;
use Inertia\Inertia;
use Carbon\Carbon;
use Hekmatinasser\Verta\Facades\Verta;

class ReportController extends Controller
{
    /**
     * Display the report generation page.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        // Get date range for the last 30 days
        $endDate = Carbon::now();
        $startDate = Carbon::now()->subDays(30);

        // Use Carbon formatting instead of Shamsi/Verta
        $startDateFormatted = $startDate->format('Y-m-d');
        $endDateFormatted = $endDate->format('Y-m-d');

        $sales = $warehouse->sales()
            ->with(['customer'])
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($sale) {
                return [
                    'id' => $sale->id,
                    'reference' => $sale->reference_number,
                    'amount' => (float) $sale->total,
                    'date' => Carbon::parse($sale->created_at)->format('Y-m-d'),
                    'customer' => $sale->customer ? $sale->customer->name : 'Unknown',
                    'status' => $sale->status,
                ];
            });

        // Get income data
        $income = $warehouse->warehouseIncome()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($income) {
                return [
                    'id' => $income->id,
                    'reference' => $income->reference_number,
                    'amount' => (float) $income->total,
                    'date' => Carbon::parse($income->created_at)->format('Y-m-d'),
                    'source' => $income->product ? $income->product->name : 'Unknown',
                ];
            });

        // Get outcome data
        $outcome = $warehouse->warehouseOutcome()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->get()
            ->map(function ($outcome) {
                return [
                    'id' => $outcome->id,
                    'reference' => $outcome->reference_number,
                    'amount' => (float) $outcome->total,
                    'date' => Carbon::parse($outcome->created_at)->format('Y-m-d'),
                    'destination' => $outcome->product ? $outcome->product->name : 'Unknown',
                ];
            });

        // Get product data
        $products = $warehouse->products()
            ->get()
            ->map(function ($product) {
                return [
                    'id' => $product->id,
                    'name' => $product->name,
                    'sku' => $product->sku,
                    'stock' => (float) $product->stock,
                    'price' => (float) $product->price,
                    'category' => $product->category ? $product->category->name : 'Uncategorized',
                ];
            });

        return Inertia::render('Warehouse/Report', [
            'sales' => $sales,
            'income' => $income,
            'outcome' => $outcome,
            'products' => $products,
            'dateRange' => [
                'start' => $startDateFormatted,
                'end' => $endDateFormatted,
            ],
        ]);
    }

    /**
     * Generate a specific report based on type and date range.
     */
    public function generate(Request $request)
    {
        try {
            $request->validate([
                'type' => 'required|in:sales,income,outcome,products',
                'start_date' => 'required|date',
                'end_date' => 'required|date|after_or_equal:start_date',
                'search' => 'nullable|string',
            ]);

            $warehouse = Auth::guard('warehouse_user')->user()->warehouse;
            $searchTerm = $request->search;

            // Convert Gregorian dates to Carbon instances
            $startDate = Carbon::parse($request->start_date);
            $endDate = Carbon::parse($request->end_date);

            Log::info('Generating report', [
                'type' => $request->type,
                'start_date' => $startDate,
                'end_date' => $endDate,
                'search' => $searchTerm,
                'warehouse_id' => $warehouse->id
            ]);

            $data = match($request->type) {
                'sales' => $warehouse->sales()
                    ->with(['customer'])
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->when($searchTerm, function($query) use ($searchTerm) {
                        return $query->where(function($q) use ($searchTerm) {
                            $q->where('reference_number', 'like', "%{$searchTerm}%")
                              ->orWhereHas('customer', function($cq) use ($searchTerm) {
                                  $cq->where('name', 'like', "%{$searchTerm}%");
                              });
                        });
                    })
                    ->get()
                    ->map(function ($sale) {
                        return [
                            'id' => $sale->id,
                            'reference' => $sale->reference_number,
                            'amount' => (float) $sale->total,
                            'date' => Carbon::parse($sale->created_at)->format('Y-m-d'),
                            'customer' => $sale->customer ? $sale->customer->name : 'Unknown',
                            'status' => $sale->status,
                        ];
                    }),
                'income' => $warehouse->warehouseIncome()
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->when($searchTerm, function($query) use ($searchTerm) {
                        return $query->where(function($q) use ($searchTerm) {
                            $q->where('reference_number', 'like', "%{$searchTerm}%")
                              ->orWhereHas('product', function($pq) use ($searchTerm) {
                                  $pq->where('name', 'like', "%{$searchTerm}%");
                              });
                        });
                    })
                    ->get()
                    ->map(function ($income) {
                        return [
                            'id' => $income->id,
                            'reference' => $income->reference_number,
                            'amount' => (float) $income->total,
                            'date' => Carbon::parse($income->created_at)->format('Y-m-d'),
                            'source' => $income->product ? $income->product->name : 'Unknown',
                        ];
                    }),
                'outcome' => $warehouse->warehouseOutcome()
                    ->whereBetween('created_at', [$startDate, $endDate])
                    ->when($searchTerm, function($query) use ($searchTerm) {
                        return $query->where(function($q) use ($searchTerm) {
                            $q->where('reference_number', 'like', "%{$searchTerm}%")
                              ->orWhereHas('product', function($pq) use ($searchTerm) {
                                  $pq->where('name', 'like', "%{$searchTerm}%");
                              });
                        });
                    })
                    ->get()
                    ->map(function ($outcome) {
                        return [
                            'id' => $outcome->id,
                            'reference' => $outcome->reference_number,
                            'amount' => (float) $outcome->total,
                            'date' => Carbon::parse($outcome->created_at)->format('Y-m-d'),
                            'destination' => $outcome->product ? $outcome->product->name : 'Unknown',
                        ];
                    }),
                'products' => $warehouse->products()
                    ->with('category')
                    ->when($searchTerm, function($query) use ($searchTerm) {
                        return $query->where(function($q) use ($searchTerm) {
                            $q->where('name', 'like', "%{$searchTerm}%")
                              ->orWhere('sku', 'like', "%{$searchTerm}%")
                              ->orWhereHas('category', function($cq) use ($searchTerm) {
                                  $cq->where('name', 'like', "%{$searchTerm}%");
                              });
                        });
                    })
                    ->get()
                    ->map(function ($product) {
                        return [
                            'id' => $product->id,
                            'name' => $product->name,
                            'sku' => $product->sku,
                            'stock' => (float) $product->stock,
                            'price' => (float) $product->price,
                            'category' => $product->category ? $product->category->name : 'Uncategorized',
                        ];
                    }),
                default => [],
            };

            Log::info('Report generated successfully', [
                'type' => $request->type,
                'data_count' => count($data),
                'search' => $searchTerm
            ]);

            return response()->json([
                'data' => $data,
                'date_range' => [
                    'start' => $startDate->format('Y-m-d'),
                    'end' => $endDate->format('Y-m-d'),
                ],
            ]);
        } catch (\Exception $e) {
            Log::error('Error generating report', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString(),
                'request' => $request->all()
            ]);

            return response()->json([
                'error' => 'An error occurred while generating the report',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}
