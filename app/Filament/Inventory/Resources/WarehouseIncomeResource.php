<?php

namespace App\Filament\Inventory\Resources;

use App\Filament\Inventory\Resources\WarehouseIncomeResource\Pages;
use App\Filament\Inventory\Resources\WarehouseIncomeResource\RelationManagers;
use App\Models\WarehouseIncome;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WarehouseIncomeResource extends Resource
{
    protected static ?string $model = WarehouseIncome::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                //
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                //
            ])
            ->filters([
                //
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
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
            'index' => Pages\ListWarehouseIncomes::route('/'),
            'create' => Pages\CreateWarehouseIncome::route('/create'),
            'view' => Pages\ViewWarehouseIncome::route('/{record}'),
            'edit' => Pages\EditWarehouseIncome::route('/{record}/edit'),
        ];
    }
}
