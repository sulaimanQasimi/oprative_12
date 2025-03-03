<?php

namespace App\Filament\Resources\ProductResource\Widgets;

use App\Models\PurchaseItem;
use App\Models\SaleItem;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Database\Eloquent\Model;

class ProductStatsOverview extends BaseWidget
{
    public ?string $filter = 'today';

    public ?Model $record = null;

    public function mount($record): void
    {
        $this->record = $record;
    }

    protected function getStats(): array
    {

        $product = $this->record;

        $totalPurchases = PurchaseItem::where('product_id', $product->id)
            ->selectRaw('SUM(quantity) as total_quantity, SUM(quantity * price) as total_value')
            ->first();

        $totalSales = SaleItem::where('product_id', $product->id)
            ->selectRaw('SUM(quantity) as total_quantity, SUM(quantity * price) as total_value')
            ->first();

        $remainingQuantity = ($totalPurchases->total_quantity ?? 0) - ($totalSales->total_quantity ?? 0);
        $stockStatus = 'danger';
        
        if ($remainingQuantity > 50) {
            $stockStatus = 'success';
        } elseif ($remainingQuantity > 20) {
            $stockStatus = 'warning';
        }

        return [
            Stat::make(__('Total Purchased Quantity'), number_format($totalPurchases->total_quantity ?? 0))
                ->description(__('Total units purchased'))
                ->color('success'),

            Stat::make(__('Total Purchase Value'), number_format($totalPurchases->total_value ?? 0, 2))
                ->description(__('Total purchase value in base currency'))
                ->color('success'),

            Stat::make(__('Total Sales Quantity'), number_format($totalSales->total_quantity ?? 0))
                ->description(__('Total units sold'))
                ->color('warning'),

            Stat::make(__('Total Sales Value'), number_format($totalSales->total_value ?? 0, 2))
                ->description(__('Total sales value in base currency'))
                ->color('warning'),

            Stat::make(__('Remaining Stock'), number_format($remainingQuantity))
                ->description(__('Current stock level'))
                ->color($stockStatus),
        ];
    }
}
