<?php

namespace App\Filament\Resources\WarehouseResource\Widgets;

use Filament\Widgets\ChartWidget;

class WarehouseProductWidget extends ChartWidget
{
    protected static ?string $heading = 'Chart';

    protected function getData(): array
    {
        return [
            //
        ];
    }

    protected function getType(): string
    {
        return 'line';
    }
}
