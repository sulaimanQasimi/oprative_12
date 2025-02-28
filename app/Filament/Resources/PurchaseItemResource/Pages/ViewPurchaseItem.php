<?php

namespace App\Filament\Resources\PurchaseItemResource\Pages;

use App\Filament\Resources\PurchaseItemResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPurchaseItem extends ViewRecord
{
    protected static string $resource = PurchaseItemResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }
}
