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
                                            ->columnSpanFull()
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('wholesale_price')
                                            ->label(__('Wholesale Price'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->live()
                                            ->prefixIcon('heroicon-o-currency-dollar')
                                            ->columnSpanFull(),


                                        Forms\Components\TextInput::make('retail_price')
                                            ->label(__('Retail Price'))
                                            ->translateLabel()
                                            ->numeric()
                                            ->default(0)
                                            ->live()
                                            ->prefixIcon('heroicon-o-currency-dollar')
                                            ->columnSpanFull(),

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
