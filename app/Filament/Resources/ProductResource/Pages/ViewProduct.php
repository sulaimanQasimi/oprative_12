<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\PurchaseItem;
use App\Models\SaleItem;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;
use App\Filament\Resources\ProductResource\Widgets\ProductStatsOverview;

class ViewProduct extends ViewRecord
{
    protected static string $resource = ProductResource::class;

    public static function getNavigationLabel(): string
    {
        return __('View Product');
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
        ];
    }

    protected function getHeaderWidgets(): array
    {
        return [
            ProductStatsOverview::class,
        ];
    }

}
