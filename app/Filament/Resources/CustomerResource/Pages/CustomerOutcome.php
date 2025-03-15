<?php

namespace App\Filament\Resources\CustomerResource\Pages;

use App\Filament\Resources\CustomerResource;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;

class CustomerOutcome extends ManageRelatedRecords
{
    protected static string $resource = CustomerResource::class;

    protected static string $relationship = 'customerStockOutcome';

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
            ->headerActions([
                // Tables\Actions\Action::make('view_report')
                //     ->label(__('View Report'))
                //     ->url(fn () => route('filament.pages.warehouse-income-report'))
                //     ->icon('heroicon-o-document-chart-bar')
                //     ->color('success')
            ])
            ->columns([
                Tables\Columns\TextColumn::make('reference_number')
                    ->label('Reference Number')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('customer.name')
                    ->label('Customer')
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
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Date')
                    ->translateLabel()
                    ->date()
                    ->sortable(),
            ]);
    }

    public function getTableRecordKey(mixed $record): string
    {
        return (string) $record->product_id;
    }
}