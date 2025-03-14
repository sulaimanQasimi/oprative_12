<?php

namespace App\Filament\Resources\SaleResource\Tables;

use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Actions\DeleteAction;

class SaleResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->label('Reference')
                    ->searchable()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('customer.name')
                    ->label('Customer')
                    ->searchable()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('warehouse.name')
                    ->label('Warehouse')
                    ->searchable()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('currency.name')
                    ->label('Currency')
                    ->searchable()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('currency_rate')
                    ->label('Currency Rate')
                    ->numeric()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('total_amount')
                    ->label('Total Amount')
                    ->money()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('paid_amount')
                    ->label('Paid Amount')
                    ->money()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('due_amount')
                    ->label('Due Amount')
                    ->money()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'processing' => 'warning',
                        'cancelled' => 'danger',
                        default => 'info',
                    })
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('payment_status')
                    ->label('Payment Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'warning',
                        'overdue' => 'danger',
                        default => 'info',
                    })
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('date')
                    ->label('Date')
                    ->dateTime()
                    ->sortable()
                    ->translateLabel(),
                TextColumn::make('created_at')
                    ->label('Created At')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->translateLabel(),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                //
            ]);
    }
}