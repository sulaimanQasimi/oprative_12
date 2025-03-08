<?php

namespace App\Pos\Account\Filament\Resources\AccountRequestResource\Pages;

use App\Pos\Account\Filament\Resources\AccountRequestResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateAccountRequest extends CreateRecord
{
    protected static string $resource = AccountRequestResource::class;
}
