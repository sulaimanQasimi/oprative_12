<?php

namespace App\Filament\Inventory\Resources\WarehouseOutcomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseOutcomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewWarehouseOutcome extends ViewRecord
{
    protected static string $resource = WarehouseOutcomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
