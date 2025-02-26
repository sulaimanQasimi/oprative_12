<?php

namespace App\Filament\Resources;

use App\Filament\Resources\ProductResource\Pages;
use App\Filament\Resources\ProductResource\RelationManagers;
use App\Models\Product;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class ProductResource extends Resource
{
    protected static ?string $model = Product::class;

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label('Name')
                    ->translateLabel()
                    ->maxLength(255),
                Forms\Components\FileUpload::make('image')
                    ->label('Image')
                    ->translateLabel()
                    ->image(),
                Forms\Components\TextInput::make('barcode')
                    ->label('Barcode')
                    ->translateLabel()
                    ->maxLength(255)
                    ->unique(table: 'products', column: 'barcode', ignoreRecord: true),
                Forms\Components\Textarea::make('description')
                    ->label('Description')
                    ->translateLabel()
                    ->columnSpanFull(),
                Forms\Components\TextInput::make('price')
                    ->label('Price')
                    ->translateLabel()
                    ->numeric()
                    ->prefix('$'),
                Forms\Components\TextInput::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->numeric(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\ImageColumn::make('image')
                    ->label('Image')
                    ->translateLabel(),
                Tables\Columns\TextColumn::make('barcode')
                    ->label('Barcode')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->translateLabel()
                    ->money()
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\TrashedFilter::make(),
            ])
            ->actions([
                Tables\Actions\ViewAction::make(),
                Tables\Actions\EditAction::make(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
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
            'index' => Pages\ListProducts::route('/'),
            'create' => Pages\CreateProduct::route('/create'),
            'view' => Pages\ViewProduct::route('/{record}'),
            'edit' => Pages\EditProduct::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
