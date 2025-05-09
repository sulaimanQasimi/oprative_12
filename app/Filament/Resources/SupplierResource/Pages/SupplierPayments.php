<?php

namespace App\Filament\Resources\SupplierResource\Pages;

use App\Filament\Resources\SupplierResource;
use App\Filament\Resources\SupplierResource\Tables\SupplierPaymentTable;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SupplierPayments extends ManageRelatedRecords
{
    protected static string $resource = SupplierResource::class;

    protected static string $relationship = 'purchasePayment';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $modelLabel = 'Payment';

    protected static ?string $pluralModelLabel = 'Payments';

    public function getHeaderWidgets(): array
    {
        return [];
    }

    public function getTitle(): string
    {
        return __('Supplier Payments');
    }

    public static function getNavigationLabel(): string
    {
        return __('Supplier Payments');
    }
    public function table(Table $table): Table
    {
        return SupplierPaymentTable::table($table);
    }
}
