<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PurchaseItemResource\Pages;
use App\Filament\Resources\PurchaseItemResource\RelationManagers;
use App\Models\PurchaseItem;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PurchaseItemResource extends Resource
{
    protected static ?string $model = PurchaseItem::class;
    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Purchase Item Details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('purchase_id')
                                    ->label('Purchase ID')
                                    ->translateLabel()
                                    ->relationship('purchase', 'id')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-shopping-cart'),
                                Forms\Components\Select::make('product_id')
                                    ->label('Product')
                                    ->translateLabel()
                                    ->relationship('product', 'name')
                                    ->searchable()
                                    ->getSearchResultsUsing(function (string $search) {
                                        return \App\Models\Product::query()
                                            ->where('barcode', 'like', "%{$search}%")
                                            ->orWhere('name', 'like', "%{$search}%")
                                            ->pluck('name', 'id');
                                    })
                                    ->preload()
                                    ->prefixIcon('heroicon-o-cube'),
                                Forms\Components\TextInput::make('quantity')
                                    ->label('Quantity')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-hashtag'),

                                Forms\Components\TextInput::make('price')
                                    ->label('Price')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ,

                                Forms\Components\TextInput::make('total_price')
                                    ->label('Total Price')
                                    ->translateLabel()
                                    ->numeric()
                                    ->prefixIcon('heroicon-o-calculator'),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('purchase_id')
                    ->label('Purchase ID')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('product_id')
                    ->label('Product ID')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total Price')
                    ->translateLabel()
                    ->numeric()
                    ->sortable()
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
            'index' => Pages\ListPurchaseItems::route('/'),
            'create' => Pages\CreatePurchaseItem::route('/create'),
            'view' => Pages\ViewPurchaseItem::route('/{record}'),
            'edit' => Pages\EditPurchaseItem::route('/{record}/edit'),
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
