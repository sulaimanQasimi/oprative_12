<?php

namespace App\Filament\Resources\WarehouseTransferResource\Pages;

use App\Filament\Resources\WarehouseTransferResource;
use Filament\Resources\Pages\CreateRecord;

class CreateWarehouseTransfer extends CreateRecord
{
    protected static string $resource = WarehouseTransferResource::class;

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}