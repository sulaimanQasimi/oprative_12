<?php

namespace App\Filament\Pages;

use Filament\Pages\Page;
use App\Filament\Resources\WarehouseResource\Widgets\WarehouseProductWidget;

class Dashboard extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-document-text';

    protected static string $view = 'filament.pages.dashboard';

    protected function getWidgets(): array
    {
        return [
            WarehouseProductWidget::class,
        ];
    }
}
