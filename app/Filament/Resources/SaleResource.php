<?php

namespace App\Filament\Resources;

use App\Filament\Resources\SaleResource\Pages;
use App\Models\Sale;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Forms;

use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class SaleResource extends Resource
{
    protected static ?string $model = Sale::class;

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';
    protected static ?string $navigationGroup = 'Sales';
    protected static ?int $navigationSort = 2;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Sale Details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Select::make('customer_id')
                                    ->relationship('customer', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('customers', 'id')
                                    ->label('Customer'),
                                Select::make('warehouse_id')
                                    ->relationship('warehouse', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('warehouses', 'id')
                                    ->label('Warehouse'),
                                Select::make('currency_id')
                                    ->relationship('currency', 'name')
                                    ->searchable()
                                    ->preload()
                                    ->required()
                                    ->exists('currencies', 'id')
                                    ->label('Currency'),
                                TextInput::make('currency_rate')
                                    ->numeric()
                                    ->default(1)
                                    ->required()
                                    ->minValue(0.01)
                                    ->step(0.01)
                                    ->label('Currency Rate'),
                                DateTimePicker::make('sale_date')
                                    ->required()
                                    ->before('tomorrow')
                                    ->label('Sale Date'),
                                TextInput::make('reference')
                                    ->maxLength(255)
                                    ->unique(ignoreRecord: true)
                                    ->regex('/^[A-Za-z0-9-]+$/')
                                    ->helperText('Only letters, numbers, and hyphens are allowed')
                                    ->label('Reference Number'),
                                Select::make('status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'processing' => 'Processing',
                                        'completed' => 'Completed',
                                        'cancelled' => 'Cancelled'
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->label('Status'),
                                Select::make('payment_status')
                                    ->options([
                                        'pending' => 'Pending',
                                        'partial' => 'Partial',
                                        'paid' => 'Paid',
                                        'overdue' => 'Overdue'
                                    ])
                                    ->required()
                                    ->default('pending')
                                    ->label('Payment Status'),
                                Select::make('payment_method')
                                    ->options([
                                        'cash' => 'Cash',
                                        'bank_transfer' => 'Bank Transfer',
                                        'credit_card' => 'Credit Card',
                                        'cheque' => 'Cheque'
                                    ])
                                    ->required()
                                    ->label('Payment Method')
                            ])
                    ]),
                Forms\Components\Section::make('Additional Information')
                    ->schema([
                        Textarea::make('notes')
                            ->maxLength(65535)
                            ->columnSpanFull()
                            ->label('Notes')
                            ->nullable()
                    ])
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('reference')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('customer.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('warehouse.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('currency.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('total_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('paid_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('due_amount')
                    ->money()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'processing' => 'warning',
                        'cancelled' => 'danger',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('payment_status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'warning',
                        'overdue' => 'danger',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('sale_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('created_at')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                //
            ])
            ->actions([
                EditAction::make(),
                DeleteAction::make(),
            ])
            ->bulkActions([
                //
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
            'index' => Pages\ListSales::route('/'),
            'create' => Pages\CreateSale::route('/create'),
            'edit' => Pages\EditSale::route('/{record}/edit'),
        ];
    }
}
