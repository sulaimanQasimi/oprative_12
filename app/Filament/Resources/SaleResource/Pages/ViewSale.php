<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewSale extends ViewRecord
{
    protected static string $resource = SaleResource::class;

    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make(),
            Actions\Action::make('complete')
                ->label(trans('Completed'))
                ->action(function ($record) {
                    // Get All SalesItems
                    $saleItems = $record->saleItems;

                    // Create Output Form Warehouse
                    foreach ($saleItems as $item) {
                        $warehouseOutput = new \App\Models\WarehouseOutcome([
                            'warehouse_id' => $item->warehouse_id,
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'sale_id' => $record->id,
                            'date' => now(),
                        ]);
                        $warehouseOutput->save();
                    }

                    // Create Input From CustomerStockIncome
                    foreach ($saleItems as $item) {
                        $customerStock = new \App\Models\CustomerStockIncome([
                            'customer_id' => $record->customer_id,
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'sale_id' => $record->id,
                            'date' => now(),
                        ]);
                        $customerStock->save();
                    }

                    $record->status = 'completed';
                    $record->save();
                })
                ->color('success')
                ->icon('heroicon-o-check-circle'),
        ];
    }
}
