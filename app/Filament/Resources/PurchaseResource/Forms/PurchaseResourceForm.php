<?php

namespace App\Filament\Resources\PurchaseResource\Forms;

use Filament\Forms;
use Filament\Forms\Form;
use Str;

class PurchaseResourceForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Purchase Details'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('supplier_id')
                                    ->label('Supplier')
                                    ->translateLabel()
                                    ->relationship('supplier', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-truck')
                                    ->required()
                                    ->exists('suppliers', 'id'),
                                Forms\Components\Select::make('currency_id')
                                    ->label('Currency')
                                    ->translateLabel()
                                    ->relationship('currency', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ->required()
                                    ->exists('currencies', 'id'),
                                Forms\Components\TextInput::make('invoice_number')
                                    ->label('Invoice Number')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-document-text')
                                    ->required()
                                    ->unique('purchases', 'invoice_number', ignoreRecord: true),
                                Forms\Components\DatePicker::make('invoice_date')
                                    ->jalali()
                                    ->label('Invoice Date')
                                    ->translateLabel()
                                    ->prefixIcon('heroicon-o-calendar')
                                    ->required()
                                    ->date()
                                    ->default(now()),
                                Forms\Components\TextInput::make('currency_rate')
                                    ->label('Currency Rate')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ->required()
                                    ->numeric()
                                    ->default(1),
                                Forms\Components\Select::make('status')
                                    ->label('Status')
                                    ->translateLabel()
                                    ->options([
                                        'purchase' => trans('Purchase'),
                                        'onway' => trans('On Way'),
                                        'on_border' => trans('On Border'),
                                        'on_plan' => trans('On Plan'),
                                        'on_ship' => trans('On Ship'),
                                        'arrived' => trans('Arrived'),
                                        'warehouse_moved' => trans('Moved to Warehouse'),
                                        'return' => trans('Return'),
                                    ])
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-check-circle')
                                    ->required()
                                    ->in([
                                        'purchase',
                                        'onway',
                                        'on_border',
                                        'on_plan',
                                        'on_ship',
                                        'arrived',
                                        'warehouse_moved',
                                        'return',
                                    ])->default('purchase'),
                                Forms\Components\Select::make('warehouse_id')
                                    ->label('Warehouse')
                                    ->translateLabel()
                                    ->relationship('warehouse', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-building-office')
                                    ->visible(fn($record) => $record?->status === 'arrived' && !$record?->is_moved_to_warehouse)
                                    ->exists('warehouses', 'id'),
                                Forms\Components\Repeater::make('additional_costs')
                                    ->label(trans('Additional Cost'))
                                    ->collapsed()
                                    ->collapsible()
                                    ->relationship()
                                    ->cloneable()
                                    ->schema([
                                        Forms\Components\TextInput::make('name')
                                            ->label(__('Name'))
                                            ->required()
                                            ->maxLength(255)
                                            ->prefixIcon('heroicon-o-document-text'),
                                        Forms\Components\TextInput::make('amount')
                                            ->label(__('Amount'))
                                            ->numeric()
                                            ->live(debounce: 2000)
                                            ->prefixIcon('heroicon-o-currency-dollar'),
                                    ])->columns(2)
                                    ->columnSpanFull()
                                    ->default([]),
                            ]),
                    ]),
            ]);
    }
}
