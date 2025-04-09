<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Repositories\Customer\CustomerRepository;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\MarketOrder;
use App\Models\CustomerStock;
use App\Models\Sale;
use App\Models\Account;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use App\Exports\CustomerReportExport;
use Maatwebsite\Excel\Facades\Excel;
use Barryvdh\DomPDF\Facade\Pdf;
use Carbon\Carbon;
use Illuminate\Support\Collection;

class ReportsController extends Controller
{
    public function index()
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $dateFrom = now()->startOfMonth()->format('Y-m-d');
        $dateTo = now()->format('Y-m-d');

        // Get initial data for each report type
        $sales = $this->getSalesData($customer->id, $dateFrom, $dateTo);
        $marketOrders = $this->getMarketOrdersData($customer->id, $dateFrom, $dateTo);
        $accounts = $this->getAccountsData($customer->id, $dateFrom, $dateTo);
        $incomes = $this->getIncomesData($customer->id, $dateFrom, $dateTo);
        $outcomes = $this->getOutcomesData($customer->id, $dateFrom, $dateTo);

        return Inertia::render('Customer/Reports', [
            'sales' => $sales,
            'marketOrders' => $marketOrders,
            'accounts' => $accounts,
            'incomes' => $incomes,
            'outcomes' => $outcomes,
            'dateRange' => [
                'start' => $dateFrom,
                'end' => $dateTo,
            ],
        ]);
    }

    public function generate(Request $request)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $validated = $request->validate([
            'type' => 'required|string|in:sales,market_orders,accounts,incomes,outcomes',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'search' => 'nullable|string',
        ]);

        $reportType = $validated['type'];
        $dateFrom = $validated['start_date'];
        $dateTo = $validated['end_date'];
        $searchTerm = $validated['search'] ?? '';

        $data = [];

        switch ($reportType) {
            case 'sales':
                $data = $this->getSalesData($customer->id, $dateFrom, $dateTo, $searchTerm);
                break;
            case 'market_orders':
                $data = $this->getMarketOrdersData($customer->id, $dateFrom, $dateTo, $searchTerm);
                break;
            case 'accounts':
                $data = $this->getAccountsData($customer->id, $dateFrom, $dateTo, $searchTerm);
                break;
            case 'incomes':
                $data = $this->getIncomesData($customer->id, $dateFrom, $dateTo, $searchTerm);
                break;
            case 'outcomes':
                $data = $this->getOutcomesData($customer->id, $dateFrom, $dateTo, $searchTerm);
                break;
        }

        return response()->json([
            'status' => 'success',
            'data' => $data,
        ]);
    }

    public function exportExcel(Request $request)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $validated = $request->validate([
            'type' => 'required|string|in:sales,market_orders,accounts,incomes,outcomes',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'search' => 'nullable|string',
        ]);

        $reportType = $validated['type'];
        $dateFrom = $validated['start_date'];
        $dateTo = $validated['end_date'];
        $searchTerm = $validated['search'] ?? '';

        $data = $this->getReportData($customer->id, $reportType, $dateFrom, $dateTo, $searchTerm);
        $collection = collect($data);

        return Excel::download(new CustomerReportExport($collection, $reportType), 'customer-report.xlsx');
    }

    public function exportPDF(Request $request)
    {
        $customer = CustomerRepository::currentUserCustomer()->model;
        $validated = $request->validate([
            'type' => 'required|string|in:sales,market_orders,accounts,incomes,outcomes',
            'start_date' => 'required|date',
            'end_date' => 'required|date|after_or_equal:start_date',
            'search' => 'nullable|string',
        ]);

        $reportType = $validated['type'];
        $dateFrom = $validated['start_date'];
        $dateTo = $validated['end_date'];
        $searchTerm = $validated['search'] ?? '';

        $data = $this->getReportData($customer->id, $reportType, $dateFrom, $dateTo, $searchTerm);

        $pdf = PDF::loadView('customer.reports.pdf', [
            'data' => $data,
            'reportType' => $reportType,
            'dateFrom' => $dateFrom,
            'dateTo' => $dateTo
        ]);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'customer-report.pdf');
    }

    private function getReportData($customerId, $reportType, $dateFrom, $dateTo, $searchTerm = '')
    {
        switch ($reportType) {
            case 'sales':
                return $this->getSalesData($customerId, $dateFrom, $dateTo, $searchTerm);
            case 'market_orders':
                return $this->getMarketOrdersData($customerId, $dateFrom, $dateTo, $searchTerm);
            case 'accounts':
                return $this->getAccountsData($customerId, $dateFrom, $dateTo, $searchTerm);
            case 'incomes':
                return $this->getIncomesData($customerId, $dateFrom, $dateTo, $searchTerm);
            case 'outcomes':
                return $this->getOutcomesData($customerId, $dateFrom, $dateTo, $searchTerm);
            default:
                return [];
        }
    }

    private function getSalesData($customerId, $dateFrom, $dateTo, $searchTerm = '')
    {
        $query = Sale::where('customer_id', $customerId);

        if ($dateFrom && $dateTo) {
            $fromDate = Carbon::parse($dateFrom)->startOfDay();
            $toDate = Carbon::parse($dateTo)->endOfDay();
            $query->whereBetween('created_at', [$fromDate, $toDate]);
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', "%{$searchTerm}%")
                  ->orWhere('amount', 'like', "%{$searchTerm}%")
                  ->orWhereHas('product', function($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $sales = $query->orderBy('created_at', 'desc')->get();

        return $sales->map(function($sale) {
            return [
                'id' => $sale->id,
                'reference' => "S-" . str_pad($sale->id, 5, '0', STR_PAD_LEFT),
                'date' => $sale->created_at->format('Y-m-d'),
                'product' => $sale->product->name ?? 'N/A',
                'quantity' => $sale->quantity,
                'amount' => $sale->amount,
                'customer' => $sale->customer->name ?? 'N/A',
                'status' => $sale->status ?? 'completed',
                'created_at' => $sale->created_at->format('Y-m-d H:i:s')
            ];
        })->toArray();
    }

    private function getMarketOrdersData($customerId, $dateFrom, $dateTo, $searchTerm = '')
    {
        $query = MarketOrder::where('customer_id', $customerId);

        if ($dateFrom && $dateTo) {
            $fromDate = Carbon::parse($dateFrom)->startOfDay();
            $toDate = Carbon::parse($dateTo)->endOfDay();
            $query->whereBetween('created_at', [$fromDate, $toDate]);
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', "%{$searchTerm}%")
                  ->orWhere('total_amount', 'like', "%{$searchTerm}%")
                  ->orWhere('status', 'like', "%{$searchTerm}%");
            });
        }

        $orders = $query->orderBy('created_at', 'desc')->get();

        return $orders->map(function($order) {
            return [
                'id' => $order->id,
                'reference' => "MO-" . str_pad($order->id, 5, '0', STR_PAD_LEFT),
                'date' => $order->created_at->format('Y-m-d'),
                'customer' => $order->customer->name ?? 'N/A',
                'amount' => $order->total_amount,
                'status' => $order->status,
                'created_at' => $order->created_at->format('Y-m-d H:i:s')
            ];
        })->toArray();
    }

    private function getAccountsData($customerId, $dateFrom, $dateTo, $searchTerm = '')
    {
        $query = Account::where('customer_id', $customerId);

        if ($dateFrom && $dateTo) {
            $fromDate = Carbon::parse($dateFrom)->startOfDay();
            $toDate = Carbon::parse($dateTo)->endOfDay();
            $query->whereBetween('created_at', [$fromDate, $toDate]);
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', "%{$searchTerm}%")
                  ->orWhere('name', 'like', "%{$searchTerm}%")
                  ->orWhere('balance', 'like', "%{$searchTerm}%");
            });
        }

        $accounts = $query->orderBy('created_at', 'desc')->get();

        return $accounts->map(function($account) {
            return [
                'id' => $account->id,
                'reference' => "A-" . str_pad($account->id, 5, '0', STR_PAD_LEFT),
                'name' => $account->name,
                'balance' => $account->balance,
                'date' => $account->created_at->format('Y-m-d'),
                'created_at' => $account->created_at->format('Y-m-d H:i:s')
            ];
        })->toArray();
    }

    private function getIncomesData($customerId, $dateFrom, $dateTo, $searchTerm = '')
    {
        $query = AccountIncome::whereHas('account', function($q) use ($customerId) {
            $q->where('customer_id', $customerId);
        });

        if ($dateFrom && $dateTo) {
            $fromDate = Carbon::parse($dateFrom)->startOfDay();
            $toDate = Carbon::parse($dateTo)->endOfDay();
            $query->whereBetween('created_at', [$fromDate, $toDate]);
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', "%{$searchTerm}%")
                  ->orWhere('amount', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhereHas('account', function($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $incomes = $query->orderBy('created_at', 'desc')->get();

        return $incomes->map(function($income) {
            return [
                'id' => $income->id,
                'reference' => "I-" . str_pad($income->id, 5, '0', STR_PAD_LEFT),
                'date' => $income->created_at->format('Y-m-d'),
                'source' => $income->account->name ?? 'N/A',
                'account_id' => $income->account_id,
                'amount' => $income->amount,
                'description' => $income->description,
                'created_at' => $income->created_at->format('Y-m-d H:i:s')
            ];
        })->toArray();
    }

    private function getOutcomesData($customerId, $dateFrom, $dateTo, $searchTerm = '')
    {
        $query = AccountOutcome::whereHas('account', function($q) use ($customerId) {
            $q->where('customer_id', $customerId);
        });

        if ($dateFrom && $dateTo) {
            $fromDate = Carbon::parse($dateFrom)->startOfDay();
            $toDate = Carbon::parse($dateTo)->endOfDay();
            $query->whereBetween('created_at', [$fromDate, $toDate]);
        }

        if ($searchTerm) {
            $query->where(function($q) use ($searchTerm) {
                $q->where('id', 'like', "%{$searchTerm}%")
                  ->orWhere('amount', 'like', "%{$searchTerm}%")
                  ->orWhere('description', 'like', "%{$searchTerm}%")
                  ->orWhereHas('account', function($q) use ($searchTerm) {
                      $q->where('name', 'like', "%{$searchTerm}%");
                  });
            });
        }

        $outcomes = $query->orderBy('created_at', 'desc')->get();

        return $outcomes->map(function($outcome) {
            return [
                'id' => $outcome->id,
                'reference' => "O-" . str_pad($outcome->id, 5, '0', STR_PAD_LEFT),
                'date' => $outcome->created_at->format('Y-m-d'),
                'destination' => $outcome->account->name ?? 'N/A',
                'account_id' => $outcome->account_id,
                'amount' => $outcome->amount,
                'description' => $outcome->description,
                'created_at' => $outcome->created_at->format('Y-m-d H:i:s')
            ];
        })->toArray();
    }
}
