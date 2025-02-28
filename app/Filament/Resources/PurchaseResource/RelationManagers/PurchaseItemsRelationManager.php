<?php

namespace App\Filament\Resources\PurchaseResource\RelationManagers;

use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\RelationManagers\RelationManager;
use Filament\Tables;
use Filament\Tables\Table;

class PurchaseItemsRelationManager extends RelationManager
{
    protected static string $relationship = 'purchaseItems';

    protected static ?string $recordTitleAttribute = 'id';

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Select::make('product_id')
                    ->relationship('product', 'name')
                    ->searchable()
                    ->preload()
                    ->required(),
                Forms\Components\TextInput::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->maxLength(255)
                    ->numeric()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                        $price = floatval($get('price'));
                        $quantity = floatval($state);
                        $set('total_price', $quantity * $price);
                    })
                    ->prefixIcon('heroicon-o-hashtag'),

                Forms\Components\TextInput::make('price')
                    ->label('Price')
                    ->translateLabel()
                    ->maxLength(255)
                    ->numeric()
                    ->live(onBlur: true)
                    ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                        $quantity = floatval($get('quantity'));
                        $price = floatval($state);
                        $set('total_price', $quantity * $price);
                    })
                    ->prefixIcon('heroicon-o-currency-dollar'),

                Forms\Components\TextInput::make('total_price')
                    ->label('Total Price')
                    ->translateLabel()
                    ->numeric()
                    ->disabled()
                    ->dehydrated(false)
                    ->prefixIcon('heroicon-o-calculator'),
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('product.name'),
                Tables\Columns\TextColumn::make('quantity'),
                Tables\Columns\TextColumn::make('unit_price'),
                Tables\Columns\TextColumn::make('total_price'),
            ])
            ->filters([
                //
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }
}
