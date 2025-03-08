<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Pages;

use Filament\Resources\Pages\ManageRecords;
use Filament\Resources\Pages\ViewRecord;
use App\Pos\Account\Filament\Resources\AccountResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Pos\Account\Models\Account;

class ViewAccount extends ViewRecord
{
    protected static string $resource = AccountResource::class;
}
