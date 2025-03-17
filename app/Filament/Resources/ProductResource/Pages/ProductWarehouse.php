<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;

class ProductWarehouse extends ManageRelatedRecords
{
    protected static string $resource = ProductResource::class;

    protected static string $relationship = 'warehouseProducts';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $modelLabel = 'Purchase';

    protected static ?string $pluralModelLabel = 'Purchases';

    public function getTitle(): string
    {
        return trans('Product Warehouses');
    }

    public static function getNavigationLabel(): string
    {
        return trans('Product Warehouses');
    }

    public function table(Table $table): Table
    {
        return   $table
            ->modifyQueryUsing(fn($query) => $query->orderBy('product_id'))
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('income_quantity')
                    ->label('Income Qty')
                    ->translateLabel()
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('income_total')
                    ->label('Income Total')
                    ->translateLabel()
                    ->money('AFN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('outcome_quantity')
                    ->label('Outcome Qty')
                    ->translateLabel()
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('outcome_total')
                    ->label('Outcome Total')
                    ->translateLabel()
                    ->money('AFN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('profit')
                    ->label('Profit')
                    ->translateLabel()
                    ->money('AFN')
                    ->sortable(),
            ]);
    }
}
