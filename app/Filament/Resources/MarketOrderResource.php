<?php

namespace App\Filament\Resources;

use App\Filament\Resources\MarketOrderResource\Pages;
use App\Filament\Resources\MarketOrderResource\RelationManagers;
use App\Models\MarketOrder;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class MarketOrderResource extends Resource
{
    protected static ?string $model = MarketOrder::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';
    protected static bool $shouldRegisterNavigation = false;
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
            'index' => Pages\ListMarketOrders::route('/'),
            'create' => Pages\CreateMarketOrder::route('/create'),
            'view' => Pages\ViewMarketOrder::route('/{record}'),
            'edit' => Pages\EditMarketOrder::route('/{record}/edit'),
        ];
    }
}
