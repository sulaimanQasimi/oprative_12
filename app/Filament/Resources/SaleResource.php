<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SaleResource\Pages;
use App\Models\Sale;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Forms;
use Filament\Pages\SubNavigationPosition;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SaleResource extends Resource
{
    protected static ?string $model = Sale::class;
    protected static SubNavigationPosition $subNavigationPosition = SubNavigationPosition::Top;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Sales';
    protected static ?int $navigationSort = 2;

    public static function getPluralModelLabel(): string
    {
        return __('Sales');
    }

    public static function getModelLabel(): string
    {
        return __('Sale');
    }

    public static function form(Form $form): Form
    {
        return \App\Filament\Resources\Forms\SaleResourceForm::form($form);
    }

    public static function table(Table $table): Table
    {
        return \App\Filament\Resources\Tables\SaleResourceTable::table($table);
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
            'index' => Pages\ListSales::route('/'),
            'create' => Pages\CreateSale::route('/create'),
            'edit' => Pages\EditSale::route('/{record}/edit'),
            'payments' => Pages\SalePayments::route('/{record}/payments'),
            'items' => Pages\SaleItems::route('/{record}/items'),
        ];
    }

    public static function getRecordSubNavigation(\Filament\Resources\Pages\Page $page): array
    {
        return $page->generateNavigationItems([
            // Pages\ViewSales::class,
            Pages\EditSale::class,
            Pages\SalePayments::class, //
            Pages\SaleItems::class, //
            // Pages\ExpenseResourceRelationPage::class,
            // Pages\ViewM16Outcome::class,
            // Pages\EditM16Outcome::class,
            // Pages\LogActivity::class,
        ]);
    }
}
