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
                                    ->translateLabel(),
                                TextInput::make('currency_rate')
                                    ->label('Currency Rate')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->minValue(0.01)
                                    ->step(0.01)
                                    ->translateLabel(),
                                DateTimePicker::make('date')
                                    ->label('Date')
                                    ->required()
                                    ->before('tomorrow')
                                    ->translateLabel()
                                    ->jalili(),
                                TextInput::make('reference')
                                    ->label('Reference')
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true)
                                    ->regex('/^[A-Za-z0-9-]+$/')
                                    ->helperText(trans('Only letters, numbers, and hyphens are allowed'))
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