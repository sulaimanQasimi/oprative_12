<?php

namespace App\Filament\Resources;

use App\Filament\Resources\BranchResource\Pages;
use App\Models\Branch;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Form;
use Filament\Forms;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class BranchResource extends Resource
{
    protected static ?string $model = Branch::class;

    public static function getPluralModelLabel(): string
    {
        return __('Branches');
    }

    public static function getModelLabel(): string
    {
        return __('Branch');
    }

    protected static ?string $navigationIcon = 'heroicon-o-building-office';
    protected static ?string $navigationGroup = 'Organization';
    protected static ?int $navigationSort = 1;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Branch Details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                TextInput::make('name')
                                    ->label('Name')
                                    ->translateLabel()
                                    ->required()
                                    ->prefixIcon('heroicon-o-building-office')
                                    ->maxLength(255),
                                TextInput::make('code')
                                    ->label('Code')
                                    ->translateLabel()
                                    ->required()
                                    ->prefixIcon('heroicon-o-identification')
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),
                                TextInput::make('address')
                                    ->label('Address')
                                    ->translateLabel()
                                    ->prefixIcon('heroicon-o-map-pin')
                                    ->maxLength(255),
                                TextInput::make('phone')
                                    ->label('Phone')
                                    ->translateLabel()
                                    ->prefixIcon('heroicon-o-phone')
                                    ->tel()
                                    ->maxLength(255),
                                TextInput::make('email')
                                    ->label('Email')
                                    ->translateLabel()
                                    ->prefixIcon('heroicon-o-envelope')
                                    ->email()
                                    ->maxLength(255),
                                Toggle::make('is_active')
                                    ->label('Active Status')
                                    ->translateLabel()
                                    ->default(true),
                            ])
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('code')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('address')
                    ->searchable(),
                TextColumn::make('phone')
                    ->searchable(),
                TextColumn::make('email')
                    ->searchable(),
                ToggleColumn::make('is_active')
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                TextColumn::make('updated_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                //
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
            'index' => Pages\ListBranches::route('/'),
            'create' => Pages\CreateBranch::route('/create'),
            'edit' => Pages\EditBranch::route('/{record}/edit'),
        ];
    }
}
