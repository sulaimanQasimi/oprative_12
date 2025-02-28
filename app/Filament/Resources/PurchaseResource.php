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
                                    // ->default(auth()->user()->id)
                                    ->disabled()
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-user')
                                    ->required()
                                    ->exists('users', 'id'),
                                Forms\Components\Select::make('supplier_id')
                                    ->label('Supplier')
                                    ->translateLabel()
                                    ->relationship('supplier', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-truck')
                                    ->required()
                                    ->exists('suppliers', 'id'),
                                Forms\Components\Select::make('currency_id')
                                    ->label('Currency')
                                    ->translateLabel()
                                    ->relationship('currency', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ->required()
                                    ->exists('currencies', 'id'),
                                Forms\Components\TextInput::make('invoice_number')
                                    ->label('Invoice Number')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-document-text')
                                    ->required()
                                    ->unique('purchases', 'invoice_number', ignoreRecord: true),

                                Forms\Components\DatePicker::make('invoice_date')
                                    ->label('Invoice Date')
                                    ->translateLabel()
                                    ->default(now())
                                    ->disabled()
                                    ->prefixIcon('heroicon-o-calendar')
                                    ->required()
                                    ->date(),
                                Forms\Components\TextInput::make('currecy_rate')
                                    ->label('Currency Rate')
                                    ->translateLabel()
                                    ->maxLength(255)
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ->required()
                                    ->numeric(),
                                // Forms\Components\TextInput::make('total_amount')
                                //     ->label('Total Amount')
                                //     ->translateLabel()
                                //     ->maxLength(255)
                                //     ->prefixIcon('heroicon-o-calculator'),
                                Forms\Components\Select::make('status')
                                    ->label('Status')
                                    ->translateLabel()
                                    ->options([
                                        'purchase' => 'Purchase',
                                        'onway' => 'On Way',
                                        'on_border' => 'On Border',
                                        'on_plan' => 'On Plan',
                                        'on_ship' => 'On Ship',
                                        'arrived' => 'Arrived',
                                        'return' => 'Return',
                                    ])
                                    ->searchable()
                                    ->preload()
                                    ->prefixIcon('heroicon-o-check-circle')
                                    ->required()
                                    ->in([
                                        'purchase',
                                        'onway',
                                        'on_border',
                                        'on_plan',
                                        'on_ship',
                                        'arrived',
                                        'return',
                                    ]),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('user.name')
                    ->label('User Name')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('supplier.name')
                    ->label('Company Name')
                    ->translateLabel()
                    ->numeric()
                    ->sortable(),
                Tables\Columns\TextColumn::make('currency.name')
                    ->label('Currency')
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
                // Tables\Columns\TextColumn::make('total_amount')
                //     ->label('Total Amount')
                //     ->translateLabel()
                //     ->searchable(),
                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->translateLabel()
                    ->searchable(),
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
            RelationManagers\PurchaseItemsRelationManager::class,
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
