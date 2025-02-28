<?php

namespace App\Filament\Resources;

use App\Filament\Resources\PurchaseResource\Pages;
use App\Filament\Resources\PurchaseResource\RelationManagers;
use App\Models\Purchase;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PurchaseResource extends Resource
{
    protected static ?string $model = Purchase::class;
    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Purchase Details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\Select::make('user_id')
                                    ->label('User')
                                    ->translateLabel()
                                    ->relationship('user', 'name')
                                    ->default(auth()->user()->id)
                                    ->disabled()
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-user'),
                                Forms\Components\TextInput::make('supplier_id')
                                    ->label('Supplier ID')
                                    ->translateLabel()
                                    ->numeric()
                                    ->prefixIcon('heroicon-o-truck'),
                                Forms\Components\TextInput::make('currency_id')
                                    ->label('Currency ID')
                                    ->translateLabel()
                                    ->numeric()
                                    ->prefixIcon('heroicon-o-currency-dollar'),
                                Forms\Components\TextInput::make('invoice_number')
                                    ->label('Invoice Number')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-document-text'),
                                Forms\Components\DatePicker::make('invoice_date')
                                    ->label('Invoice Date')
                                    ->translateLabel()
                                    ->prefixIcon('heroicon-o-calendar'),
                                Forms\Components\TextInput::make('currecy_rate')
                                    ->label('Currency Rate')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-currency-dollar'),
                                Forms\Components\TextInput::make('total_amount')
                                    ->label('Total Amount')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-calculator'),
                                Forms\Components\TextInput::make('status')
                                    ->label('Status')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-check-circle'),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user_id')
                    ->label('User ID')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('supplier_id')
                    ->label('Supplier ID')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('currency_id')
                    ->label('Currency ID')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('invoice_number')
                    ->label('Invoice Number')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('invoice_date')
                    ->label('Invoice Date')
                    ->translateLabel()
                    ->date()
                    ->sortable(),
                Tables\Columns\TextColumn::make('currecy_rate')
                    ->label('Currency Rate')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('total_amount')
                    ->label('Total Amount')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->translateLabel()
                    ->searchable(),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label('Updated At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('deleted_at')
                    ->label('Deleted At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
            'index' => Pages\ListPurchases::route('/'),
            'create' => Pages\CreatePurchase::route('/create'),
            'view' => Pages\ViewPurchase::route('/{record}'),
            'edit' => Pages\EditPurchase::route('/{record}/edit'),
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
