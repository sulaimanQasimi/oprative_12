<?php

namespace App\Filament\Resources\AccountIncomeResource\Pages;

use App\Filament\Resources\AccountIncomeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAccountIncome extends EditRecord
{
    protected static string $resource = AccountIncomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }
}
