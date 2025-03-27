<?php

namespace App\Filament\Resources\CustomerResource\Pages\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditCustomerUser extends EditRecord
{
    protected static string $resource = CustomerResource::class;
}
