<?php

namespace App\Filament\Resources\WarehouseResource\Forms;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Forms;

class FormWarehouseResource
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Warehouse Details'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Name')
                                    ->translateLabel()
                                    ->required()
                                    ->minLength(2)
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-building-storefront')
                                    ->placeholder(trans('Enter warehouse name'))
                                    ->helperText(trans('Only letters, numbers, spaces, hyphens and dots are allowed'))
                                    ->rules(['required', 'string', 'min:2', 'max:255']),
                                TextInput::make('code')
                                    ->label('Code')
                                    ->translateLabel()
                                    ->required()
                                    ->minLength(3)
                                    ->maxLength(20)
                                    ->regex('/^[A-Z0-9\-]+$/')
                                    ->prefixIcon('heroicon-o-identification')
                                    ->placeholder(trans('Enter warehouse code'))
                                    ->helperText(trans('Only uppercase letters, numbers and hyphens are allowed'))
                                    ->unique(ignoreRecord: true)
                                    ->rules(['required', 'string', 'min:3', 'max:20', 'regex:/^[A-Z0-9\-]+$/', 'unique:warehouses,code']),
                            ])
                    ]),
                Forms\Components\Section::make(__('Additional Information'))
                    ->schema([
                        Textarea::make('description')
                            ->label('Description')
                            ->translateLabel()
                            ->maxLength(65535)
                            ->columnSpanFull(),
                        Textarea::make('address')
                            ->label('Address')
                            ->translateLabel()
                            ->maxLength(65535)
                            ->columnSpanFull()
                    ])
            ]);
    }
}