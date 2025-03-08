<?php

namespace App\Filament\Resources\MarketOrderResource\Pages;

use App\Filament\Resources\MarketOrderResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditMarketOrder extends EditRecord
{
    protected static string $resource = MarketOrderResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
