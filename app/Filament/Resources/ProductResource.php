<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Pages\SubNavigationPosition;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    public static function getPluralModelLabel(): string
    {
        return __('Products');
    }

    public static function getModelLabel(): string
    {
        return __('Product');
    }

    protected static ?string $navigationIcon = 'heroicon-o-cube';

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
                                            ->default('product')
                                            ->options([
                                                'product' => __('Product'),
                                                'service' => __('Service'),
                                            ])
                                            ->prefixIcon('heroicon-o-tag'),
                                        Forms\Components\TextInput::make('barcode')
                                            ->label(__('Barcode'))
                                            ->unique(table: 'products', column: 'barcode', ignoreRecord: true)
                                            ->prefixIcon('heroicon-o-bars-4'),
                                        Forms\Components\TextInput::make('name.en')
                                            ->label(__('Name (English)'))
                                            ->required()
                                            ->maxLength(255)
                                            ->prefixIcon('heroicon-o-document-text'),
                                        Forms\Components\TextInput::make('name.ar')
                                            ->label(__('Name (Arabic)'))
                                            ->required()
                                            ->maxLength(255)
                                            ->prefixIcon('heroicon-o-document-text'),
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
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('wholesale_price')
                                            ->label(__('Wholesale Price'))
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('retail_price')
                                            ->label(__('Retail Price'))
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('purchase_profit')
                                            ->label(__('Purchase Profit'))
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('wholesale_profit')
                                            ->label(__('Wholesale Profit'))
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                        Forms\Components\TextInput::make('retail_profit')
                                            ->label(__('Retail Profit'))
                                            ->numeric()
                                            ->default(0)
                                            ->prefix(__('$'))
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                    ])
                            ])->collapsible(),
                        Forms\Components\Section::make(__('Status'))
                            ->schema([
                                Forms\Components\Grid::make(2)
                                    ->schema([
                                        Forms\Components\Toggle::make('is_activated')
                                            ->label(__('Is Activated'))
                                            ->default(true),
                                        Forms\Components\Toggle::make('is_in_stock')
                                            ->label(__('Is In Stock'))
                                            ->default(true),
                                        Forms\Components\Toggle::make('is_shipped')
                                            ->label(__('Is Shipped'))
                                            ->default(false),
                                        Forms\Components\Toggle::make('is_trend')
                                            ->label(__('Is Trending'))
                                            ->default(false),
                                    ])
                            ])->collapsible(),
                        Forms\Components\Section::make(__('Media'))
                            ->schema([
                                Forms\Components\FileUpload::make('image')
                                    ->label(__('Image'))
                                    ->image()
                                    ->columnSpanFull()
                            ])->collapsible(),
                    ])
            ]);
    }

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
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('wholesale_price')
                    ->label(__('Wholesale Price'))
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('retail_price')
                    ->label(__('Retail Price'))
                    ->money()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_activated')
                    ->label(__('Active'))
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_in_stock')
                    ->label(__('In Stock'))
                    ->boolean()
                    ->sortable(),
                Tables\Columns\IconColumn::make('is_trend')
                    ->label(__('Trending'))
                    ->boolean()
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

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'view' => Pages\ViewProduct::route('/{record}'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'purchases' => Pages\ProductPurchases::route('/{record}/purchases'),
            'sales' => Pages\ProductSales::route('/{record}/sales'),
        ];
    }

    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ViewProduct::class,
            Pages\EditProduct::class,
            Pages\ProductPurchases::class,
            Pages\ProductSales::class,
        ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery();
    }
}
