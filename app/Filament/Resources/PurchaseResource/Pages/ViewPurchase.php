<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use App\Models\Purchase;
use App\Models\WarehouseIncome;
use App\Models\WarehouseIncomeItem;
use Filament\Actions;
use Filament\Resources\Pages\ViewRecord;

class ViewPurchase extends ViewRecord
{
    protected static string $resource = PurchaseResource::class;

    protected function getHeaderWidgets(): array
    {
        return [
            PurchaseResource\Widgets\PurchaseTotalWidget::class,
            PurchaseResource\Widgets\TotalPaymentAmountWidget::class,
        ];
    }

    public static function getNavigationLabel(): string
    {
        return __('View Purchase');
    }
    protected function getHeaderActions(): array
    {
        return [
            Actions\EditAction::make()
                ->icon('heroicon-o-pencil-square')
                ->visible(fn ($record) => $record->status !== 'warehouse_moved'),
            Actions\Action::make('viewInvoice')
                ->label('View Invoice')
                ->translateLabel()
                ->icon('heroicon-o-document-text')
                ->url(fn (Purchase $record): string => route('filament.admin.resources.purchases.invoice', $record))
                ->openUrlInNewTab(),
            Actions\Action::make('moveToWarehouse')
                ->label('Move to Warehouse')
                ->translateLabel()
                ->icon('heroicon-o-building-office')
                ->requiresConfirmation()
                ->visible(fn ($record) => $record->status === 'arrived' && !$record->is_moved_to_warehouse)
                ->action(function ($record) {
                    if (!$record->warehouse_id) {
                        return;
                    }

                    // Begin transaction to ensure data consistency
                    \Illuminate\Support\Facades\DB::transaction(function () use ($record) {


                        // Move all purchase items to warehouse inventory
                        foreach ($record->purchaseItems as $purchaseItem) {
                            // Create warehouse income item
                            WarehouseIncome::create([
                                'reference_number'=>"PO-".$record->id,
                                'warehouse_id' => $record->warehouse_id,
                                'product_id' => $purchaseItem->product_id,
                                'quantity' => $purchaseItem->quantity,
                                'price'=> $purchaseItem->price,
                                'total'=> $purchaseItem->total_price,
                            ]);
                        }

                        // Update purchase status
                        $record->update([
                            'status' => 'warehouse_moved',
                            'is_moved_to_warehouse' => true,
                        ]);
                    });
                }),
        ];
    }
}
