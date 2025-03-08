<?php

namespace App\Filament\Resources\MarketOrderResource\Pages;

use App\Filament\Resources\MarketOrderResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewMarketOrder extends ViewRecord
{
    protected static string $resource = MarketOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
