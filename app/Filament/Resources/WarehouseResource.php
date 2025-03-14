<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WarehouseResource\Pages;
use App\Models\Warehouse;
use App\Filament\Resources\WarehouseResource\Forms\FormWarehouseResource;
use App\Filament\Resources\WarehouseResource\Tables\TableWarehouseResource;
use Filament\Forms\Form;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
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
        return FormWarehouseResource::form($form);
    }

    public static function table(Table $table): Table
    {
        return TableWarehouseResource::table($table);
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
            'income' => Pages\WarehouseIncome::route('/{record}/income'),
            'outcome' => Pages\WarehouseOutcome::route('/{record}/outcome'),
        ];
    }

    // Navigation Items
    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            // Pages\ViewWarehouse::class,
            Pages\EditWarehouse::class,
            Pages\WarehouseProduct::class,
            Pages\WarehouseIncome::class,
            Pages\WarehouseOutcome::class,
        ]);
    }
}
