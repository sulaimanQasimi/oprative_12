<?php

namespace App\Filament\Inventory\Resources;

use App\Filament\Inventory\Resources\WarehouseOutcomeResource\Pages;
use App\Filament\Inventory\Resources\WarehouseOutcomeResource\RelationManagers;
use App\Models\WarehouseOutcome;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class WarehouseOutcomeResource extends Resource
{
    protected static ?string $model = WarehouseOutcome::class;

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
            'index' => Pages\ListWarehouseOutcomes::route('/'),
            'create' => Pages\CreateWarehouseOutcome::route('/create'),
            'view' => Pages\ViewWarehouseOutcome::route('/{record}'),
            'edit' => Pages\EditWarehouseOutcome::route('/{record}/edit'),
        ];
    }
}
