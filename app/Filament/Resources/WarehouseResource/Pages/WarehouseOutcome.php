<?php

namespace App\Filament\Resources\WarehouseResource\Pages;

use App\Filament\Resources\WarehouseResource;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;

class WarehouseOutcome extends ManageRelatedRecords
{
    protected static string $resource = WarehouseResource::class;

    protected static string $relationship = 'warehouseOutcome';

    protected static ?string $navigationIcon = 'heroicon-o-arrow-trending-down';

    protected static ?string $modelLabel = 'Outcome';

    protected static ?string $pluralModelLabel = 'Outcomes';

    public function getTitle(): string
    {
        return trans("Outcome");
    }

    public static function getNavigationLabel(): string
    {
        return __("Outcome");
    }

    public function table(Table $table): Table
    {
        return $table
            ->modifyQueryUsing(fn ($query) => $query->orderBy('created_at', 'desc'))
            ->columns([
                Tables\Columns\TextColumn::make('reference_number')
                    ->label('Reference Number')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('warehouse.name')
                    ->label('Warehouse')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Unit Price')
                    ->translateLabel()
                    ->money('AFN')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total')
                    ->label('Total')
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