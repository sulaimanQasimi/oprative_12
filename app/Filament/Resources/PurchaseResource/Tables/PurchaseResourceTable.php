<?php

namespace App\Filament\Resources\PurchaseResource\Tables;

use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;

class PurchaseResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User Name')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('supplier.name')
                    ->label('Company Name')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('currency.name')
                    ->label('Currency')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('invoice_number')
                    ->label('Invoice Number')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('invoice_date')
                    ->label('Invoice Date')
                    ->translateLabel()
                    ->date()
                    ->sortable()
                    ->jalaliDate(),
                Tables\Columns\TextColumn::make('currency_rate')
                    ->label('Currency Rate')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->label('Total Amount')
                    ->translateLabel()
                    ->money('USD')
                    ->sortable()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->translateLabel()
                    ->searchable()
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'purchase' => trans('Purchase'),
                        'onway' => trans('On Way'),
                        'on_border' => trans('On Border'),
                        'on_plan' => trans('On Plan'),
                        'on_ship' => trans('On Ship'),
                        'arrived' => trans('Arrived'),
                        'warehouse_moved' => trans('Moved to Warehouse'),
                        'return' => trans('Return'),
                        default => $state,
                    }),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }
}
