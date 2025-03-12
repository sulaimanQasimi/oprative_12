<?php

namespace App\Filament\Resources\SupplierResource\Tables;

use App\Filament\Resources\PurchaseResource\Tables\PurchaseResourceTable;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;

class SupplierPurchaseTable
{
    public static function table(Table $table): Table
    {
        return PurchaseResourceTable::table($table)
            ->actions([
            ])
            ->bulkActions([

            ]);
    }
}
