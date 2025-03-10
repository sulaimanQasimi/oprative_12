<?php

namespace App\Filament\Resources\SupplierResource\Forms;

use Filament\Forms;
use Filament\Forms\Form;

class SupplierResourceForm
{
    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make(__('Supplier Details'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->label('Company Name')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->rules('required')
                                    ->prefixIcon('heroicon-o-building-office'),
                                Forms\Components\TextInput::make('contact_name')
                                    ->label('Contact Name')
                                    ->translateLabel()
                                    ->required()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-user'),
                                Forms\Components\TextInput::make('phone')
                                    ->label('Phone')
                                    ->translateLabel()
                                    ->tel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-phone'),
                                Forms\Components\TextInput::make('email')
                                    ->label('Email')
                                    ->translateLabel()
                                    ->email()
                                    ->required()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-envelope'),
                            ]),
                    ]),
                Forms\Components\Section::make(__('Address Details'))
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('address')
                                    ->label('Address')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-map'),
                                Forms\Components\TextInput::make('city')
                                    ->label('City')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-building-office'),
                                Forms\Components\TextInput::make('state')
                                    ->label('State')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-building-office'),
                                Forms\Components\TextInput::make('country')
                                    ->label('Country')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-globe-alt'),
                                Forms\Components\TextInput::make('postal_code')
                                    ->label('Postal Code')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-envelope'),
                            ]),
                    ]),
                Forms\Components\Section::make(__('Additional Details'))
                    ->schema([
                        Forms\Components\FileUpload::make('image')
                            ->label('Image')
                            ->translateLabel()
                            ->image(),
                        Forms\Components\TextInput::make('id_number')
                            ->label('ID Number')
                            ->translateLabel()
                            ->maxLength(255)
                            ->prefixIcon('heroicon-o-identification'),
                    ]),
            ]);
    }
}
