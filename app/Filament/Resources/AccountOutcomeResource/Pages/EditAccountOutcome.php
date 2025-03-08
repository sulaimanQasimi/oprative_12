<?php

namespace App\Filament\Resources\AccountOutcomeResource\Pages;

use App\Filament\Resources\AccountOutcomeResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditAccountOutcome extends EditRecord
{
    protected static string $resource = AccountOutcomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
        ];
    }
}
