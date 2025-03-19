<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Filament\Resources\WarehouseResource\Widgets\WarehouseProductWidget;
use Filament\Pages\Dashboard as PagesDashboard;

class Dashboard extends PagesDashboard
{

    public function getWidgets(): array
    {
        return [
            WarehouseProductWidget::class,
        ];
    }
}
