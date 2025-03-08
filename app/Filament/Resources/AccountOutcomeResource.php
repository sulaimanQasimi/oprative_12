<?php

namespace App\Filament\Resources;

use App\Filament\Resources\AccountOutcomeResource\Pages;
use App\Filament\Resources\AccountOutcomeResource\RelationManagers;
use App\Models\AccountOutcome;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class AccountOutcomeResource extends Resource
{
    protected static ?string $model = AccountOutcome::class;

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
            'index' => Pages\ListAccountOutcomes::route('/'),
            'create' => Pages\CreateAccountOutcome::route('/create'),
            'view' => Pages\ViewAccountOutcome::route('/{record}'),
            'edit' => Pages\EditAccountOutcome::route('/{record}/edit'),
        ];
    }
}
