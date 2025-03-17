<?php

namespace App\Filament\Resources\ProductResource\Tables;

use Filament\Tables;
use Filament\Tables\Table;

class ProductResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('type')
                    ->label(__('Type'))
                    ->badge()
                    ->sortable(),
                Tables\Columns\TextColumn::make('name')
                    ->label(__('Name'))
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('barcode')
                    ->label(__('Barcode'))
                    ->searchable(),
                Tables\Columns\ImageColumn::make('image')
                    ->label(__('Image')),
                Tables\Columns\TextColumn::make('purchase_price')
                    ->label(__('Purchase Price'))
                    ->money("AFN")
                    ->sortable(),
                Tables\Columns\TextColumn::make('wholesale_price')
                    ->label(__('Wholesale Price'))
                    ->money("AFN")
                    ->sortable(),
                Tables\Columns\TextColumn::make('retail_price')
                    ->label(__('Retail Price'))
                    ->money("AFN")
                    ->sortable(),
            ])
            ->filters([

            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}