<?php

namespace App\Exports;

use Maatwebsite\Excel\Concerns\FromCollection;
use Maatwebsite\Excel\Concerns\WithHeadings;
use Maatwebsite\Excel\Concerns\WithMapping;
use Illuminate\Support\Collection;

class CustomerReportExport implements FromCollection, WithHeadings, WithMapping
{
    protected $data;
    protected $reportType;

    public function __construct($data, $reportType)
    {
        $this->data = $data;
        $this->reportType = $reportType;
    }

    public function collection()
    {
        return $this->data;
    }

    public function headings(): array
    {
        switch ($this->reportType) {
            case 'market_orders':
                return ['ID', 'Date', 'Total Amount', 'Status', 'Created At'];
            case 'stocks':
                return ['ID', 'Product', 'Quantity', 'Created At'];
            case 'sales':
                return ['ID', 'Product', 'Quantity', 'Amount', 'Date'];
            case 'accounts':
                return ['ID', 'Name', 'Balance', 'Created At'];
            case 'incomes':
                return ['ID', 'Account', 'Amount', 'Description', 'Date'];
            case 'outcomes':
                return ['ID', 'Account', 'Amount', 'Description', 'Date'];
            default:
                return ['ID', 'Created At'];
        }
    }

    public function map($row): array
    {
        switch ($this->reportType) {
            case 'market_orders':
                return [
                    $row->id,
                    $row->created_at->format('Y-m-d'),
                    $row->total_amount,
                    $row->status,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            case 'stocks':
                return [
                    $row->id,
                    $row->product->name ?? 'N/A',
                    $row->quantity,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            case 'sales':
                return [
                    $row->id,
                    $row->product->name ?? 'N/A',
                    $row->quantity,
                    $row->amount,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            case 'accounts':
                return [
                    $row->id,
                    $row->name,
                    $row->balance,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            case 'incomes':
                return [
                    $row->id,
                    $row->account->name ?? 'N/A',
                    $row->amount,
                    $row->description,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            case 'outcomes':
                return [
                    $row->id,
                    $row->account->name ?? 'N/A',
                    $row->amount,
                    $row->description,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
            default:
                return [
                    $row->id,
                    $row->created_at->format('Y-m-d H:i:s')
                ];
        }
    }
}
