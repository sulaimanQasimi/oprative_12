<?php

namespace App\Filament\Resources\Tables;

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
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('warehouse.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('currency.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('paid_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('due_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'processing' => 'warning',
                        'cancelled' => 'danger',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'warning',
                        'overdue' => 'danger',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('sale_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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