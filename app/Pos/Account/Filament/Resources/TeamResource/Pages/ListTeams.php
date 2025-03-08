<?php

namespace App\Pos\Account\Filament\Resources\TeamResource\Pages;

use Filament\Resources\Pages\ManageRecords;
use App\Pos\Account\Filament\Resources\TeamResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;

class ListTeams extends ManageRecords
{
    protected static string $resource = TeamResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\CreateAction::make(),
        ];
    }
}
