<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class ProductImportStats extends BaseWidget
{
    protected function getStats(): array
    {
        $importStats = PurchaseItem::query()
            ->join('purchases', 'purchase_items.purchase_id', '=', 'purchases.id')
            ->where('purchases.status', 'warehouse_moved')
            ->select(
                DB::raw('COUNT(DISTINCT purchases.id) as total_imports'),
                DB::raw('SUM(purchase_items.quantity) as total_quantity'),
                DB::raw('SUM(purchase_items.total_price) as total_value')
            )
            ->first();

        return [
            Stat::make(__('Total Imports'), $importStats->total_imports)
                ->description(__('Completed warehouse imports'))
                ->icon('heroicon-o-truck'),

            Stat::make(__('Total Imported Quantity'), number_format($importStats->total_quantity))
                ->description(__('Units moved to warehouse'))
                ->icon('heroicon-o-cube'),

            Stat::make(__('Total Import Value'), number_format($importStats->total_value, 2))
                ->description(__('Value of imported products'))
                ->icon('heroicon-o-currency-dollar'),
        ];
    }
}