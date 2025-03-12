<?php

namespace App\Filament\Resources\SupplierResource\Pages;

use App\Filament\Resources\SupplierResource;
use App\Filament\Resources\SupplierResource\Tables\SupplierPurchaseTable;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SupplierPurchases extends ManageRelatedRecords
{
    protected static string $resource = SupplierResource::class;

    protected static string $relationship = 'purchases';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $modelLabel = 'Purchase';

    protected static ?string $pluralModelLabel = 'Purchases';

    public function getHeaderWidgets(): array
    {
        return [];
    }

    public function getTitle(): string
    {
        return __('Purchases');
    }

    public static function getNavigationLabel(): string
    {
        return __('Purchases');
    }

    public function table(Table $table): Table
    {
        return SupplierPurchaseTable::table($table);
    }
}
