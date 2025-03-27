<?php

namespace App\Filament\Resources\CustomerResource\Forms;

use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms;
use App\Models\User;
use Filament\Forms\Components\Select;

class CustomerResourceForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Customer Information'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->required()
                                    ->maxLength(255)
                                    ->label('Name')
                                    ->translateLabel(),
                                TextInput::make('phone')
                                    ->tel()
                                    ->maxLength(255)
                                    ->label('Phone')
                                    ->translateLabel(),
                                Toggle::make('status')
                                    ->default(true)
                                    ->label('Status')
                                    ->translateLabel(),
                            ])
                    ]),
                Forms\Components\Section::make(__('Address & Notes'))
                    ->schema([
                        Textarea::make('address')
                            ->maxLength(65535)
                            ->columnSpanFull()
                            ->label('Address')
                            ->translateLabel(),
                        Textarea::make('notes')
                            ->maxLength(65535)
                            ->columnSpanFull()
                            ->label('Notes')
                            ->translateLabel(),
                    ])
            ]);
    }
}
