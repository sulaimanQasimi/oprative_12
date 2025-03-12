<?php

namespace App\Filament\Resources\ProductResource\Form;

use Filament\Forms;
use Filament\Forms\Form;

class ProductResourceForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Product Details'))
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Select::make('type')
                                            ->label(__('Type'))
                                            ->translateLabel()
                                            ->default('product')
                                            ->options([
                                                'product' => __('Product'),
                                                'service' => __('Service'),
                                            ])
                                            ->prefixIcon('heroicon-o-tag'),
                                        Forms\Components\TextInput::make('barcode')
                                            ->label(__('Barcode'))
                                            ->translateLabel()
                                            ->unique(table: 'products', column: 'barcode', ignoreRecord: true)
                                            ->prefixIcon('heroicon-o-bars-4'),
                                        Forms\Components\TextInput::make('name')
                                            ->label(__('Name'))
                                            ->translateLabel()
                                            ->required()
                                            ->maxLength(255)
                                            ->prefixIcon('heroicon-o-document-text')
                                    ]),
                            ])->collapsible(),
                    ]),
                Forms\Components\Group::make()
                    ->schema([
                        Forms\Components\Section::make(__('Pricing Details'))
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\TextInput::make('purchase_price')
                                            ->label(__('Purchase Price'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->live(debounce: 2000)
                                            ->afterStateUpdated(function ($state, $get, $set) {
                                                $purchasePrice = floatval($state);
                                                $wholesaleProfit = floatval($get('wholesale_profit'));
                                                $set('wholesale_price', $purchasePrice + $wholesaleProfit);
                                            })->columnSpanFull()
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('wholesale_profit')
                                            ->label(__('Wholesale Profit'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->live(debounce: 2000)
                                            ->afterStateUpdated(function ($state, $get, $set) {
                                                $purchasePrice = floatval($get('purchase_price'));
                                                $wholesaleProfit = floatval($state);
                                                $set('wholesale_price', $purchasePrice + $wholesaleProfit);
                                            })
                                            ->prefixIcon('heroicon-o-currency-dollar'),

                                        Forms\Components\TextInput::make('retail_profit')
                                            ->label(__('Retail Profit'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->live(debounce: 2000)
                                            ->afterStateUpdated(function ($state, $get, $set) {
                                                $retailProfit = floatval($state);
                                                $wholesalePrice = floatval($get('wholesale_price'));
                                                $set('retail_price', $wholesalePrice + $retailProfit);
                                            })
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('wholesale_price')
                                            ->label(__('Wholesale Price'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->disabled()
                                            ->live()
                                            ->afterStateUpdated(function ($state, $get, $set) {
                                                $purchasePrice = floatval($get('purchase_price'));
                                                $wholesaleProfit = floatval($get('wholesale_profit'));
                                                $set('wholesale_price', $purchasePrice + $wholesaleProfit);
                                            })->columnSpanFull()
                                            ->prefixIcon('heroicon-o-currency-dollar'),


                                        Forms\Components\TextInput::make('retail_price')
                                            ->label(__('Retail Price'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->disabled()
                                            ->live()
                                            ->afterStateUpdated(function ($state, $get, $set) {
                                                $retailProfit = floatval($get('retail_profit'));
                                                $wholesalePrice = floatval($get('wholesale_price'));
                                                $set('retail_price', $wholesalePrice + $retailProfit);
                                            })->columnSpanFull()
                                            ->prefixIcon('heroicon-o-currency-dollar'),

                                    ])
                            ])->collapsible(),
                        Forms\Components\Section::make(__('Status'))
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Toggle::make('is_activated')
                                            ->label(__('Is Activated'))
                                            ->translateLabel()
                                            ->default(true),
                                        Forms\Components\Toggle::make('is_in_stock')
                                            ->label(__('Is In Stock'))
                                            ->translateLabel()
                                            ->default(true),
                                        Forms\Components\Toggle::make('is_shipped')
                                            ->label(__('Is Shipped'))
                                            ->translateLabel()
                                            ->default(false),
                                        Forms\Components\Toggle::make('is_trend')
                                            ->label(__('Is Trending'))
                                            ->translateLabel()
                                            ->default(false),
                                    ])
                            ])->collapsible(),
                        Forms\Components\Section::make(__('Media'))
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->label(__('Image'))
                                    ->translateLabel()
                                    ->image()
                                    ->columnSpanFull()
                            ])->collapsible(),
                    ])
            ]);
    }
}
