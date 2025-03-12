<?php

namespace App\Filament\Inventory\Resources\WarehouseIncomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewWarehouseIncome extends ViewRecord
{
    protected static string $resource = WarehouseIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
