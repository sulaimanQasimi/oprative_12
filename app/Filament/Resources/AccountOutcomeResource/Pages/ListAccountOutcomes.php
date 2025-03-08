<?php

namespace App\Filament\Resources\AccountOutcomeResource\Pages;

use App\Filament\Resources\AccountOutcomeResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListAccountOutcomes extends ListRecords
{
    protected static string $resource = AccountOutcomeResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
