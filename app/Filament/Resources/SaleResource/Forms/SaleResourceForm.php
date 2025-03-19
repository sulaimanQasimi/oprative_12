<?php

namespace App\Filament\Resources\SaleResource\Forms;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;

class SaleResourceForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(trans('Sale Details'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Select::make('customer_id')
                                    ->label('Customer')
                                    ->relationship('customer', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('customers', 'id')
                                    ->translateLabel(),
                                Select::make('warehouse_id')
                                    ->label('Warehouse')
                                    ->relationship('warehouse', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('warehouses', 'id')
                                    ->translateLabel(),
                                Select::make('currency_id')
                                    ->label('Currency')
                                    ->relationship('currency', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('currencies', 'id')
                                    ->translateLabel()
                                    ->default(1),
                                TextInput::make('currency_rate')
                                    ->label('Currency Rate')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->minValue(0.01)
                                    ->step(0.01)
                                    ->translateLabel()
                                    ->default(1),
                                DateTimePicker::make('date')
                                    ->label('Date')
                                    ->required()
                                    ->before('tomorrow')
                                    ->translateLabel()
                                    ->jalali()
                                    ->default(now()),
                                TextInput::make('reference')
                                    ->label('Reference')
                                    ->maxLength(255)
                                    ->default(function () {
                                        $latestSale = \App\Models\Sale::latest()->first();
                                        $nextId = $latestSale ? (intval(substr($latestSale->reference, -4)) + 1) : 1;
                                        return 'Store-' . now()->format('Ymd') . '-' . str_pad($nextId, 4, '0', STR_PAD_LEFT);
                                    })
                                    ->disabled()
                                    ->dehydrated()
                                    ->unique(ignoreRecord: true)
                                    ->translateLabel(),
                                Select::make('status')
                                    ->label('Status')
                                    ->options([
                                        'pending' => trans('Pending'),
                                        'processing' => trans('Processing'),
                                        'completed' => trans('Completed'),
                                        'cancelled' => trans('Cancelled')
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->translateLabel(),
                            ])
                    ]),
                Forms\Components\Section::make(trans('Additional Information'))
                    ->schema([
                        Textarea::make('notes')
                            ->label('Notes')
                            ->maxLength(65535)
                            ->columnSpanFull()
                            ->translateLabel()
                            ->nullable()
                    ])
            ]);
    }
}