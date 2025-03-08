<?php

namespace App\Filament\Resources\MarketOrderResource\Pages;

use App\Filament\Resources\MarketOrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListMarketOrders extends ListRecords
{
    protected static string $resource = MarketOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
