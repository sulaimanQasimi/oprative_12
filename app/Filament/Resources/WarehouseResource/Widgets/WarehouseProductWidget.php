<?php

namespace App\Filament\Resources\WarehouseResource\Widgets;

use App\Models\WarehouseProduct;
use Filament\Widgets\ChartWidget;

class WarehouseProductWidget extends ChartWidget
{
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
                    'backgroundColor' => '#10B981',
                ],
                [
                    'label' => trans('Outcome Quantity'),
                    'data' => [$data->total_outcome],
                    'backgroundColor' => '#EF4444',
                ],
                [
                    'label' => trans('Remaining Quantity'),
                    'data' => [$data->total_remaining],
                    'backgroundColor' => '#3B82F6',
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
