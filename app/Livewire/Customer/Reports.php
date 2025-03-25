<?php

namespace App\Livewire\Customer;

use Livewire\Component;
use Livewire\WithPagination;
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
use Illuminate\Pagination\LengthAwarePaginator;

class Reports extends Component
{
    use WithPagination;

    public $dateFrom;
    public $dateTo;
    public $reportType = 'all';
    public $searchTerm = '';
    public $sortField = 'created_at';
    public $sortDirection = 'desc';
    public $perPage = 10;

    protected $queryString = [
        'dateFrom' => ['except' => ''],
        'dateTo' => ['except' => ''],
        'reportType' => ['except' => 'all'],
        'searchTerm' => ['except' => ''],
        'sortField' => ['except' => 'created_at'],
        'sortDirection' => ['except' => 'desc'],
        'perPage' => ['except' => 10],
    ];

    public function mount()
    {
        $this->dateFrom = now()->startOfMonth()->format('Y-m-d');
        $this->dateTo = now()->format('Y-m-d');
    }

    public function updatedDateFrom()
    {
        $this->resetPage();
    }

    public function updatedDateTo()
    {
        $this->resetPage();
    }

    public function updatedReportType()
    {
        $this->resetPage();
    }

    public function updatedSearchTerm()
    {
        $this->resetPage();
    }

    public function updatedPerPage()
    {
        $this->resetPage();
    }

    public function sortBy($field)
    {
        if ($this->sortField === $field) {
            $this->sortDirection = $this->sortDirection === 'asc' ? 'desc' : 'asc';
        } else {
            $this->sortField = $field;
            $this->sortDirection = 'asc';
        }
        $this->resetPage();
    }

    public function getReportData()
    {
        $query = null;
        $dateFrom = $this->dateFrom ? Carbon::parse($this->dateFrom)->startOfDay() : null;
        $dateTo = $this->dateTo ? Carbon::parse($this->dateTo)->endOfDay() : null;

        switch ($this->reportType) {
            case 'market_orders':
                $query = MarketOrder::where('customer_id', auth()->guard('customer')->id());
                break;
            case 'stocks':
                $query = CustomerStock::where('customer_id', auth()->guard('customer')->id());
                break;
            case 'sales':
                $query = Sale::where('customer_id', auth()->guard('customer')->id());
                break;
            case 'accounts':
                $query = Account::where('customer_id', auth()->guard('customer')->id());
                break;
            case 'incomes':
                $query = AccountIncome::whereHas('account', function ($q) {
                    $q->where('customer_id', auth()->guard('customer')->id());
                });
                break;
            case 'outcomes':
                $query = AccountOutcome::whereHas('account', function ($q) {
                    $q->where('customer_id', auth()->guard('customer')->id());
                });
                break;
            default:
                return collect();
        }

        if ($dateFrom && $dateTo) {
            $query->whereBetween('created_at', [$dateFrom, $dateTo]);
        }

        if ($this->searchTerm) {
            $query->where(function ($q) {
                $q->where('id', 'like', '%' . $this->searchTerm . '%')
                  ->orWhere('created_at', 'like', '%' . $this->searchTerm . '%');
            });
        }

        return $query->orderBy($this->sortField, $this->sortDirection);
    }

    public function exportExcel()
    {
        $data = $this->getReportData()->get();
        return Excel::download(new CustomerReportExport($data, $this->reportType), 'customer-report.xlsx');
    }

    public function exportPDF()
    {
        $data = $this->getReportData()->get();
        $pdf = PDF::loadView('customer.reports.pdf', [
            'data' => $data,
            'reportType' => $this->reportType,
            'dateFrom' => $this->dateFrom,
            'dateTo' => $this->dateTo
        ]);

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, 'customer-report.pdf');
    }

    public function render()
    {
        $query = $this->getReportData();

        if ($query instanceof \Illuminate\Support\Collection) {
            $items = $query->forPage($this->getPage(), $this->perPage);
            $total = $query->count();

            return view('livewire.customer.reports', [
                'records' => new LengthAwarePaginator(
                    $items,
                    $total,
                    $this->perPage,
                    $this->getPage(),
                    ['path' => request()->url()]
                )
            ]);
        }

        return view('livewire.customer.reports', [
            'records' => $query->paginate($this->perPage)
        ]);
    }

    protected function getPage()
    {
        return request()->query('page', 1);
    }
}
