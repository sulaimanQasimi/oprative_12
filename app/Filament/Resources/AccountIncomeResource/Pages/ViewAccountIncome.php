<?php

namespace App\Filament\Resources\AccountIncomeResource\Pages;

use App\Filament\Resources\AccountIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAccountIncome extends ViewRecord
{
    protected static string $resource = AccountIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
