<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use App\Filament\Resources\ProductResource\Form\ProductResourceForm;
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

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    public static function getPluralModelLabel(): string
    {
        return __('Products');
    }

    public static function getModelLabel(): string
    {
        return __('Product');
    }

    public static function form(Form $form): Form
    {
        return ProductResourceForm::form($form);
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
