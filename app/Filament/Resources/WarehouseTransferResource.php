<?php

namespace App\Filament\Resources;

use App\Filament\Resources\WarehouseTransferResource\Pages;
use App\Models\WarehouseTransfer;
use Filament\Forms\Components\DateTimePicker;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables\Actions\DeleteAction;
use Filament\Tables\Actions\EditAction;
use Filament\Tables\Columns\TextColumn;
use Filament\Tables\Table;

class WarehouseTransferResource extends Resource
{
    protected static ?string $model = WarehouseTransfer::class;

    protected static ?string $navigationIcon = 'heroicon-o-truck';
    protected static ?string $navigationGroup = 'Inventory';
    protected static ?int $navigationSort = 3;

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Select::make('from_warehouse_id')
                    ->relationship('fromWarehouse', 'name')
                    ->required(),
                Select::make('to_warehouse_id')
                    ->relationship('toWarehouse', 'name')
                    ->required()
                    ->different('from_warehouse_id'),
                Select::make('product_id')
                    ->relationship('product', 'name')
                    ->required(),
                TextInput::make('quantity')
                    ->required()
                    ->numeric()
                    ->minValue(1),
                DateTimePicker::make('transfer_date')
                    ->required(),
                Select::make('status')
                    ->options([
                        'pending' => 'Pending',
                        'in_transit' => 'In Transit',
                        'completed' => 'Completed',
                        'cancelled' => 'Cancelled'
                    ])
                    ->required()
                    ->default('pending'),
                Textarea::make('notes')
                    ->maxLength(65535)
                    ->columnSpanFull(),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                TextColumn::make('fromWarehouse.name')
                    ->label('From Warehouse')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('toWarehouse.name')
                    ->label('To Warehouse')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('product.name')
                    ->searchable()
                    ->sortable(),
                TextColumn::make('quantity')
                    ->sortable(),
                TextColumn::make('transfer_date')
                    ->dateTime()
                    ->sortable(),
                TextColumn::make('status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'completed' => 'success',
                        'in_transit' => 'warning',
                        'cancelled' => 'danger',
                        default => 'info',
                    })
                    ->sortable(),
                TextColumn::make('created_by')
                    ->relationship('creator', 'name')
                    ->searchable()
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
            'index' => Pages\ListWarehouseTransfers::route('/'),
            'create' => Pages\CreateWarehouseTransfer::route('/create'),
            'edit' => Pages\EditWarehouseTransfer::route('/{record}/edit'),
        ];
    }
}