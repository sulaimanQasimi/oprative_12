<?php

namespace App\Filament\Inventory\Resources\WarehouseIncomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditWarehouseIncome extends EditRecord
{
    protected static string $resource = WarehouseIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
