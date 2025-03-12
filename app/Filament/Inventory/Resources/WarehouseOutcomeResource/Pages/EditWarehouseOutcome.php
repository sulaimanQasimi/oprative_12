<?php

namespace App\Filament\Inventory\Resources\WarehouseOutcomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseOutcomeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWarehouseOutcome extends EditRecord
{
    protected static string $resource = WarehouseOutcomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
