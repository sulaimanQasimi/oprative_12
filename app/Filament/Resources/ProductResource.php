<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use App\Filament\Resources\ProductResource\Form\ProductResourceForm;
use App\Filament\Resources\ProductResource\Tables\ProductResourceTable;
use BezhanSalleh\FilamentShield\Contracts\HasShieldPermissions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Pages\SubNavigationPosition;

class ProductResource extends Resource  implements HasShieldPermissions
{
    // Model Configuration
    protected static ?string $model = Product::class;

    // Navigation Settings
    protected static ?string $navigationIcon = 'heroicon-o-cube';
    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    // Labels
    public static function getModelLabel(): string
    {
        return __('Product');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Products');
    }

    public static function getPermissionPrefixes(): array
    {
        return [
            'view',
            'view_any',
            'create',
            'update',
            'delete',
            'delete_any',
            'publish'
        ];
    }

    // Form and Table Methods
    public static function form(Form $form): Form
    {
        return ProductResourceForm::form($form);
    }

    public static function table(Table $table): Table
    {
        return ProductResourceTable::table($table);
    }

    // Relations
    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    // Pages
    public static function getPages(): array
    {
        return [
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'view' => Pages\ViewProduct::route('/{record}'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
            'purchases' => Pages\ProductPurchases::route('/{record}/purchases'),
            'sales' => Pages\ProductSales::route('/{record}/sales'),
        ];
    }

    // Navigation Items
    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ViewProduct::class,
            Pages\EditProduct::class,
            Pages\ProductPurchases::class,
            Pages\ProductSales::class,
        ]);
    }

    // Query Modifications
    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery();
    }
}
