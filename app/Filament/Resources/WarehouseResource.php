<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WarehouseResource\Pages;
use App\Models\Warehouse;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Toggle;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Forms;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Columns\ToggleColumn;
use Filament\Tables\Table;

class WarehouseResource extends Resource
{
    protected static ?string $model = Warehouse::class;
    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    public static function getPluralModelLabel(): string
    {
        return __('Warehouses');
    }

    public static function getModelLabel(): string
    {
        return __('Warehouse');
    }
    public static function getNavigationGroup(): ?string
    {
        return trans('Organization');
    }
    protected static ?string $navigationIcon = 'heroicon-o-building-storefront';
    protected static ?string $navigationGroup = 'Organization';
    protected static ?int $navigationSort = 2;

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
                                    ->prefixIcon('heroicon-o-building-storefront')
                                    ->maxLength(255),
                                TextInput::make('code')
                                    ->label('Code')
                                    ->translateLabel()
                                    ->required()
                                    ->prefixIcon('heroicon-o-identification')
                                    ->unique(ignoreRecord: true)
                                    ->maxLength(255),
                                Toggle::make('is_active')
                                    ->label('Active Status')
                                    ->translateLabel()
                                    ->default(true)
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
                    ->searchable()
                    ->wrap(),
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
            WarehouseResource\RelationManagers\WarehouseItemsRelationManager::class,
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListWarehouses::route('/'),
            'create' => Pages\CreateWarehouse::route('/create'),
            'edit' => Pages\EditWarehouse::route('/{record}/edit'),
            'products' => Pages\WarehouseProduct::route('/{record}/products'),
        ];
    }

    // Navigation Items
    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            // Pages\ViewWarehouse::class,
            Pages\EditWarehouse::class,
            Pages\WarehouseProduct::class,
            // Pages\WarehousePurchases::class,
            // Pages\ProductSales::class,
        ]);
    }
}
