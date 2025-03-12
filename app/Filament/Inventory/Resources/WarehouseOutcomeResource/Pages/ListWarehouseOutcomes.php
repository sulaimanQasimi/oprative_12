<?php

namespace App\Filament\Inventory\Resources\WarehouseOutcomeResource\Pages;

use App\Filament\Inventory\Resources\WarehouseOutcomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListWarehouseOutcomes extends ListRecords
{
    protected static string $resource = WarehouseOutcomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
