<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PurchaseResource\Forms\PurchaseResourceForm;
use App\Filament\Resources\PurchaseResource\Pages;
use App\Filament\Resources\PurchaseResource\RelationManagers;
use App\Filament\Resources\PurchaseResource\Tables\PurchaseResourceTable;
use App\Models\Purchase;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Tables\Columns\TextColumn;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PurchaseResource extends Resource
{
    protected static ?string $model = Purchase::class;

    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?int $navigationSort = 2;

    public static function getNavigationLabel(): string
    {
        return __('Purchases');
    }

    public static function getModelLabel(): string
    {
        return __('Purchase');
    }

    public static function getPluralModelLabel(): string
    {
        return __('Purchases');
    }
    public static function getNavigationGroup(): ?string
    {
        return trans('Organization');
    }

    public static function form(Form $form): Form
    {
        return PurchaseResourceForm::form($form);
    }

    public static function table(Table $table): Table
    {
        return PurchaseResourceTable::table($table);
    }


    public static function getRelations(): array
    {
        return [
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListPurchases::route('/'),
            'create' => Pages\CreatePurchase::route('/create'),
            'view' => Pages\ViewPurchase::route('/{record}'),
            'edit' => Pages\EditPurchase::route('/{record}/edit'),
            'purchase-payment' => Pages\PurchasePayments::route('/{record}/purchase-payment'),
            'additional-costs' => Pages\AddtionalCosts::route('/{record}/additional-costs'),
            'items' => Pages\PurchaseItems::route('/{record}/items'),
        ];
    }
    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            Pages\ViewPurchase::class,
            Pages\EditPurchase::class,
            Pages\PurchasePayments::class, //
            Pages\PurchaseItems::class, //
            Pages\AddtionalCosts::class, //
            // Pages\ExpenseResourceRelationPage::class,
            // Pages\ViewM16Outcome::class,
            // Pages\EditM16Outcome::class,
            // Pages\LogActivity::class,
        ]);
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
