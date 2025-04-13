<?php

namespace App\Filament\Resources\WarehouseResource\Widgets;

use App\Models\WarehouseProduct;
use Filament\Widgets\ChartWidget;

class WarehouseProductWidget extends ChartWidget
{
    protected static ?string $maxHeight = '300px';

    protected static ?array $options = [
        'plugins' => [
            'legend' => [
                'display' => true,
                'position' => 'bottom',
                'labels' => [
                    'padding' => 20,
                    'font' => [
                        'size' => 12,
                    ],
                ],
            ],
            'tooltip' => [
                'enabled' => true,
                'mode' => 'index',
                'intersect' => false,
            ],
        ],
        'scales' => [
            'y' => [
                'grid' => [
                    'display' => true,
                    'drawBorder' => true,
                    'borderDash' => [2],
                    'color' => 'rgba(0, 0, 0, 0.1)',
                ],
            ],
            'x' => [
                'grid' => [
                    'display' => false,
                ],
            ],
        ],
        'responsive' => true,
        'maintainAspectRatio' => false,
    ];

    protected static function heading(): ?string
    {
        return trans('Warehouse Product Movements');
    }

    protected function getData(): array
    {
        $data = WarehouseProduct::selectRaw('
            SUM(income_quantity) as total_income,
            SUM(outcome_quantity) as total_outcome,
            SUM(net_quantity) as total_remaining,
            SUM(income_total) as total_income_amount,
            SUM(outcome_total) as total_outcome_amount
        ')
            ->first();

        return [
            'datasets' => [
                [
                    'label' => trans('Income Quantity'),
                    'data' => [$data->total_income],
                    'backgroundColor' => 'rgba(16, 185, 129, 0.8)',
                    'borderColor' => 'rgb(16, 185, 129)',
                    'borderWidth' => 2,
                    'borderRadius' => 4,
                    'hoverBackgroundColor' => 'rgba(16, 185, 129, 1)',
                ],
                [
                    'label' => trans('Outcome Quantity'),
                    'data' => [$data->total_outcome],
                    'backgroundColor' => 'rgba(239, 68, 68, 0.8)',
                    'borderColor' => 'rgb(239, 68, 68)',
                    'borderWidth' => 2,
                    'borderRadius' => 4,
                    'hoverBackgroundColor' => 'rgba(239, 68, 68, 1)',
                ],
                [
                    'label' => trans('Remaining Quantity'),
                    'data' => [$data->total_remaining],
                    'backgroundColor' => 'rgba(59, 130, 246, 0.8)',
                    'borderColor' => 'rgb(59, 130, 246)',
                    'borderWidth' => 2,
                    'borderRadius' => 4,
                    'hoverBackgroundColor' => 'rgba(59, 130, 246, 1)',
                ],
            ],
            'labels' => [trans('Product Movements')],
        ];
    }

    protected function getType(): string
    {
        return 'bar';
    }
}
