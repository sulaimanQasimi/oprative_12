<?php

namespace App\Filament\Resources\WarehouseResource\Pages;

use App\Filament\Resources\WarehouseResource;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;

class WarehouseProduct extends ManageRelatedRecords
{
    protected static string $resource = WarehouseResource::class;

    protected static string $relationship = 'items';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        return trans("Product");
    }

    public static function getNavigationLabel(): string
    {
        return __('Product');
    }

    public function table(Table $table): Table
    {
        return $table
        ->modifyQueryUsing(fn($query)=>$query->orderBy('product_id'))
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
        // Tables\Columns\TextColumn::make('income_price')
        //     ->label('Income Price')
        //     ->translateLabel()
        //     ->money('AFN')
        //     ->sortable(),
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
        // Tables\Columns\TextColumn::make('outcome_price')
        //     ->label('Outcome Price')
        //     ->translateLabel()
        //     ->money('AFN')
        //     ->sortable(),
        Tables\Columns\TextColumn::make('outcome_total')
            ->label('Outcome Total')
            ->translateLabel()
            ->money('AFN')
            ->sortable(),
        // Tables\Columns\TextColumn::make('net_quantity')
        //     ->label('Net Qty')
        //     ->translateLabel()
        //     ->sortable()
        //     ->alignCenter(),
        // Tables\Columns\TextColumn::make('net_total')
        //     ->label('Net Total')
        //     ->translateLabel()
        //     ->money('AFN')
        //     ->sortable(),
        Tables\Columns\TextColumn::make('profit')
            ->label('Profit')
            ->translateLabel()
            ->money('AFN')
            ->sortable(),
        ]);
    }

    public function getTableRecordKey(mixed $record): string
    {
        return (string) $record->product_id;
    }
}
