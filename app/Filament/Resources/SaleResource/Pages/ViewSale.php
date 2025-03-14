<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Actions;
use Filament;
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
                    if ($record->status === 'completed') {
                        Filament\Notifications\Notification::make()
                            ->warning()
                            ->title('Already Completed')
                            ->body('This sale has already been moved to stock.')
                            ->send();
                        return;
                    }

                    // Get All SalesItems
                    $saleItems = $record->saleItems;

                    // Create Output Form Warehouse
                    foreach ($saleItems as $item) {
                        $warehouseOutput = new \App\Models\WarehouseOutcome([
                            'reference_number' => 'SALE-' . $record->id,
                            'warehouse_id' => $record->warehouse_id,
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'price' => $item->unit_price,
                            'total' => $item->total_price,
                            'model_type' => get_class($record),
                            'model_id' => $record->id,
                        ]);
                        $warehouseOutput->save();
                    }

                    // Create Input From CustomerStockIncome
                    foreach ($saleItems as $item) {
                        $customerStock = new \App\Models\CustomerStockIncome([
                            'reference_number' => 'SALE-' . $record->id,
                            'customer_id' => $record->customer_id,
                            'product_id' => $item->product_id,
                            'quantity' => $item->quantity,
                            'unit_price' => $item->unit_price,
                            'total_price' => $item->total_price,
                            'sale_id' => $record->id,
                            'date' => now(),
                            'model_type' => get_class($record),
                            'model_id' => $record->id,
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
