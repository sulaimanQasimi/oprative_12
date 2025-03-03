<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\Purchase;
use App\Models\PurchaseItem;
use Filament\Forms\Components\DatePicker;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Support\Facades\DB;

class ProductImportStats extends BaseWidget
{
    protected int|string|null $filterYear = null;
    protected int|string|null $filterMonth = null;

    protected function getFilters(): ?array
    {
        return [
            'filterYear' => DatePicker::make('filterYear')
                ->label('Year')
                ->displayFormat('Y')
                ->format('Y')
                ->default(now())
                ->closeOnDateSelection(),
            'filterMonth' => DatePicker::make('filterMonth')
                ->label('Month')
                ->displayFormat('F')
                ->format('m')
                ->default(now())
                ->closeOnDateSelection(),
        ];
    }

    protected function getStats(): array
    {
        $query = PurchaseItem::query()
            ->join('purchases', 'purchase_items.purchase_id', '=', 'purchases.id')
            ->where('purchases.status', 'warehouse_moved');

        if ($this->filterYear) {
            $query->whereYear('purchases.created_at', $this->filterYear);
        }

        if ($this->filterMonth) {
            $query->whereMonth('purchases.created_at', $this->filterMonth);
        }

        $importStats = $query->select(
            DB::raw('COUNT(DISTINCT purchases.id) as total_imports'),
            DB::raw('SUM(purchase_items.quantity) as total_quantity'),
            DB::raw('SUM(purchase_items.total_price) as total_value')
        )->first();

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
