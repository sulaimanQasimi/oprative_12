<?php

namespace App\Filament\Resources\AccountTypeResource\Pages;

use App\Filament\Resources\AccountTypeResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewAccountType extends ViewRecord
{
    protected static string $resource = AccountTypeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
