<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SupplierResource\Pages;
use App\Filament\Resources\SupplierResource\RelationManagers;
use App\Models\Supplier;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SupplierResource extends Resource
{
    protected static ?string $model = Supplier::class;

    public static function getPluralModelLabel(): string
    {
        return __('Suppliers');
    }

    public static function getModelLabel(): string
    {
        return __('Supplier');
    }

    protected static ?string $navigationIcon = 'heroicon-o-truck';

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
                                    ->prefixIcon('heroicon-o-user'),
                                Forms\Components\TextInput::make('contact_name')
                                    ->label('Contact Name')
                                    ->translateLabel()
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

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Company Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('contact_name')
                    ->label('Contact Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),
                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('invoice_total')
                    ->label('Total Purchases')
                    ->translateLabel()
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\EditAction::make(),
                Tables\Actions\DeleteAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
    }


    public static function infolist(\Filament\Infolists\Infolist $infolist): \Filament\Infolists\Infolist
    {
        return $infolist
            ->schema([
                \Filament\Infolists\Components\Section::make('Supplier Details')
                    ->schema([
                        \Filament\Infolists\Components\Grid::make(2)
                            ->schema([
                                \Filament\Infolists\Components\ImageEntry::make('image')
                                    ->label('Image')
                                    ->translateLabel(),
                                \Filament\Infolists\Components\TextEntry::make('name')
                                    ->label('Company Name')
                                    ->translateLabel()
                                    ->icon('heroicon-o-user')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('contact_name')
                                    ->label('Contact Name')
                                    ->translateLabel()
                                    ->icon('heroicon-o-user')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('phone')
                                    ->label('Phone')
                                    ->translateLabel()
                                    ->icon('heroicon-o-phone')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('email')
                                    ->label('Email')
                                    ->translateLabel()
                                    ->icon('heroicon-o-envelope')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('address')
                                    ->label('Address')
                                    ->translateLabel()
                                    ->icon('heroicon-o-map')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('city')
                                    ->label('City')
                                    ->translateLabel()
                                    ->icon('heroicon-o-building-office')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('state')
                                    ->label('State')
                                    ->translateLabel()
                                    ->icon('heroicon-o-building-office')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('country')
                                    ->label('Country')
                                    ->translateLabel()
                                    ->icon('heroicon-o-globe-alt')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('postal_code')
                                    ->label('Postal Code')
                                    ->translateLabel()
                                    ->icon('heroicon-o-envelope')
                                    ->iconPosition('before'),
                                \Filament\Infolists\Components\TextEntry::make('id_number')
                                    ->label('ID Number')
                                    ->translateLabel()
                                    ->icon('heroicon-o-identification')
                                    ->iconPosition('before'),
                            ]),
                    ]),
            ]);
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListSuppliers::route('/'),
            'create' => Pages\CreateSupplier::route('/create'),
            'view' => Pages\ViewSupplier::route('/{record}'),
            'edit' => Pages\EditSupplier::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
