<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use App\Models\Product;
use App\Models\PurchaseItem;
use App\Filament\Forms\PurchaseItemPageForm;
use App\Filament\Resources\PurchaseResource\Tables\PurchaseItemPageTable;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;

class PurchaseItems extends ManageRelatedRecords
{
    protected static string $resource = PurchaseResource::class;

    protected static string $relationship = 'purchaseItems';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        return trans("Purchase Items");
    }

    public static function getNavigationLabel(): string
    {
        return __('Purchase Items');
    }

    public function form(Form $form): Form
    {
        return PurchaseItemPageForm::form($form);
    }

    public function table(Table $table): Table
    {
        return PurchaseItemPageTable::table($table);
    }
}
