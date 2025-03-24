<?php

namespace App\Livewire\Customer;

use App\Models\Order;
use App\Models\Stock;
use App\Models\Sale;
use App\Models\Account;
use App\Models\Income;
use App\Models\Outcome;
use Livewire\Component;
use Livewire\WithPagination;
use Maatwebsite\Excel\Facades\Excel;
use App\Exports\CustomerReportExport;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Auth;

class CustomerReports extends Component
{
    use WithPagination;

    public $startDate;
    public $endDate;
    public $reportType = 'orders';
    public $accountId;
    public $warehouseId;
    public $status;
    public $search;

    protected $queryString = [
        'startDate' => ['except' => ''],
        'endDate' => ['except' => ''],
        'reportType' => ['except' => 'orders'],
        'accountId' => ['except' => ''],
        'warehouseId' => ['except' => ''],
        'status' => ['except' => ''],
        'search' => ['except' => ''],
    ];

    public function mount()
    {
        $this->startDate = now()->startOfMonth()->format('Y-m-d');
        $this->endDate = now()->format('Y-m-d');
    }

    public function updatedReportType()
    {
        $this->resetPage();
    }

    public function exportExcel()
    {
        return Excel::download(new CustomerReportExport(
            $this->reportType,
            $this->startDate,
            $this->endDate,
            $this->accountId,
            $this->warehouseId,
            $this->status,
            $this->search
        ), 'customer-report.xlsx');
    }

    public function exportPDF()
    {
        $data = $this->getReportData();
        $pdf = PDF::loadView('exports.customer-report-pdf', [
            'data' => $data,
            'reportType' => $this->reportType,
            'startDate' => $this->startDate,
            'endDate' => $this->endDate,
        ]);
        return response()->streamDownload(function () use ($pdf) {
            echo $pdf->output();
        }, 'customer-report.pdf');
    }

    protected function getReportData()
    {
        $customer = Auth::guard('customer')->user();
        $query = null;

        switch ($this->reportType) {
            case 'orders':
                $query = Order::where('customer_id', $customer->id);
                break;
            case 'stocks':
                $query = Stock::where('customer_id', $customer->id);
                break;
            case 'sales':
                $query = Sale::where('customer_id', $customer->id);
                break;
            case 'incomes':
                $query = Income::where('customer_id', $customer->id);
                break;
            case 'outcomes':
                $query = Outcome::where('customer_id', $customer->id);
                break;
        }

        if ($this->startDate) {
            $query->whereDate('created_at', '>=', $this->startDate);
        }

        if ($this->endDate) {
            $query->whereDate('created_at', '<=', $this->endDate);
        }

        if ($this->accountId) {
            $query->where('account_id', $this->accountId);
        }

        if ($this->warehouseId) {
            $query->where('warehouse_id', $this->warehouseId);
        }

        if ($this->status) {
            $query->where('status', $this->status);
        }

        if ($this->search) {
            $query->where(function ($q) {
                $q->where('reference', 'like', '%' . $this->search . '%')
                  ->orWhere('description', 'like', '%' . $this->search . '%');
            });
        }

        return $query->get();
    }

    public function render()
    {
        $customer = Auth::guard('customer')->user();
        $data = $this->getReportData();
        $accounts = Account::where('customer_id', $customer->id)->get();
        $warehouses = $customer->warehouses;

        return view('livewire.customer.customer-reports', [
            'data' => $data,
            'accounts' => $accounts,
            'warehouses' => $warehouses,
        ]);
    }
}
