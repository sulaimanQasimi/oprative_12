<?php

namespace App\Pos\Account\Filament\Resources\ContactResource\Pages;

use App\Pos\Account\Filament\Resources\ContactResource;
use Filament\Actions;
use Filament\Resources\Pages\CreateRecord;

class CreateContact extends CreateRecord
{
    protected static string $resource = ContactResource::class;
}
