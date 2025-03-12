<?php

namespace App\Filament\Inventory\Resources\WarehouseIncomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWarehouseIncomes extends ListRecords
{
    protected static string $resource = WarehouseIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
