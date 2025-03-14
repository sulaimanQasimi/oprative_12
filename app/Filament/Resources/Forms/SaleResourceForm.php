<?php

namespace App\Filament\Resources\Forms;

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
                                    ->relationship('customer', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('customers', 'id')
                                    ->label('Customer'),
                                Select::make('warehouse_id')
                                    ->relationship('warehouse', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('warehouses', 'id')
                                    ->label('Warehouse'),
                                Select::make('currency_id')
                                    ->relationship('currency', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('currencies', 'id')
                                    ->label('Currency'),
                                TextInput::make('currency_rate')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->minValue(0.01)
                                    ->step(0.01)
                                    ->label('Currency Rate'),
                                DateTimePicker::make('date')
                                    ->required()
                                    ->before('tomorrow')
                                    ->label('Sale Date'),
                                TextInput::make('reference')
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true)
                                    ->regex('/^[A-Za-z0-9-]+$/')
                                    ->helperText('Only letters, numbers, and hyphens are allowed')
                                    ->label('Reference Number'),
                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'processing' => 'Processing',
                                        'completed' => 'Completed',
                                        'cancelled' => 'Cancelled'
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->label('Status'),
                            ])
                    ]),
                Forms\Components\Section::make(trans('Additional Information'))
                    ->schema([
                        Textarea::make('notes')
                            ->maxLength(65535)
                            ->columnSpanFull()
                            ->label('Notes')
                            ->nullable()
                    ])
            ]);
    }
}