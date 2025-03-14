<?php

namespace App\Filament\Resources\CustomerResource\Tables;

use Filament\Tables\Table;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;

class CustomerResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label('Name')
                    ->translateLabel(),
                TextColumn::make('email')
                    ->searchable()
                    ->sortable()
                    ->label('Email')
                    ->translateLabel(),
                TextColumn::make('phone')
                    ->searchable()
                    ->label('Phone')
                    ->translateLabel(),
                TextColumn::make('balance')
                    ->money()
                    ->sortable()
                    ->label('Balance')
                    ->translateLabel(),
                ToggleColumn::make('status')
                    ->sortable()
                    ->label('Status')
                    ->translateLabel(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->label('Created At')
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