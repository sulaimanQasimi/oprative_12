<?php

namespace App\Filament\Resources\AccountIncomeResource\Pages;

use App\Filament\Resources\AccountIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAccountIncomes extends ListRecords
{
    protected static string $resource = AccountIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
