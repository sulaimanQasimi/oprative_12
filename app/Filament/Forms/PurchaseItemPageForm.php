<?php

namespace App\Filament\Forms;

use Filament\Forms;
use Filament\Forms\Form;

class PurchaseItemPageForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Item Details')
                    ->description('Add purchase item details')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('product_id')
                                    ->relationship('product', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->createOptionForm([
                                        Forms\Components\TextInput::make('name')
                                            ->required(),
                                        Forms\Components\TextInput::make('barcode')
                                            ->required()
                                            ->unique('products', 'barcode'),
                                    ])
                                    ->prefixIcon('heroicon-o-cube'),

                                Forms\Components\TextInput::make('quantity')
                                    ->label('Quantity')
                                    ->translateLabel()
                                    ->numeric()
                                    ->minValue(1)
                                    ->default(1)
                                    ->live(onBlur: true)
                                    ->required()
                                    ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                        $price = floatval($get('price') ?? 0);
                                        $quantity = floatval($state);
                                        $set('total_price', round($quantity * $price, 2));
                                    })
                                    ->prefixIcon('heroicon-o-hashtag'),

                                Forms\Components\TextInput::make('price')
                                    ->label('Unit Price')
                                    ->translateLabel()
                                    ->numeric()
                                    ->minValue(0)
                                    ->required()
                                    ->live(onBlur: true)
                                    ->mask('999999.99')
                                    ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                        $quantity = floatval($get('quantity') ?? 0);
                                        $price = floatval($state);
                                        $set('total_price', round($quantity * $price, 2));
                                    })
                                    ->prefixIcon('heroicon-o-currency-dollar'),

                                Forms\Components\TextInput::make('total_price')
                                    ->label('Total Price')
                                    ->translateLabel()
                                    ->numeric()
                                    ->prefixIcon('heroicon-o-calculator'),
                            ]),
                    ]),
            ]);
    }
}