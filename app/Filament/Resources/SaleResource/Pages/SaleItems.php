<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SaleItems extends ManageRelatedRecords
{
    protected static string $resource = SaleResource::class;

    protected static string $relationship = 'saleItems';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        $totalAmount = $this->getOwnerRecord()->total_amount;
        $currencyCode = $this->getOwnerRecord()->currency->code;

        return "Sale Items - Total: {$currencyCode} " . number_format($totalAmount, 2);
    }

    public static function getNavigationLabel(): string
    {
        return 'Sale Items';
    }

    public function form(Form $form): Form
    {
        return $form
        ->schema([
            Forms\Components\Section::make('Item Details')
                ->description('Add sale item details')
                ->collapsible()
                ->schema([
                    Forms\Components\Grid::make(2)
                        ->schema([
                            Forms\Components\Select::make('product_id')
                                ->relationship('product', 'name')
                                ->searchable()
                                ->preload()
                                ->required()
                                ->createOptionForm([
                                    Forms\Components\TextInput::make('name')
                                        ->required(),
                                    Forms\Components\TextInput::make('barcode')
                                        ->required()
                                        ->unique('products', 'barcode'),
                                ])
                                ->prefixIcon('heroicon-o-cube'),

                            Forms\Components\TextInput::make('quantity')
                                ->label('Quantity')
                                ->translateLabel()
                                ->numeric()
                                ->minValue(1)
                                ->default(1)
                                ->live(onBlur: true)
                                ->required()
                                ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                    $price = floatval($get('unit_price') ?? 0);
                                    $quantity = floatval($state);
                                    $subtotal = $quantity * $price;

                                    $taxPercentage = floatval($get('tax_percentage') ?? 0);
                                    $discountPercentage = floatval($get('discount_percentage') ?? 0);

                                    $taxAmount = ($subtotal * $taxPercentage) / 100;
                                    $discountAmount = ($subtotal * $discountPercentage) / 100;

                                    $set('tax_amount', round($taxAmount, 2));
                                    $set('discount_amount', round($discountAmount, 2));
                                    $set('subtotal', round($subtotal - $discountAmount + $taxAmount, 2));
                                })
                                ->prefixIcon('heroicon-o-hashtag'),

                            Forms\Components\TextInput::make('unit_price')
                                ->label('Unit Price')
                                ->translateLabel()
                                ->numeric()
                                ->minValue(0)
                                ->required()
                                ->live(onBlur: true)
                                ->mask('999999.99')
                                ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                    $quantity = floatval($get('quantity') ?? 0);
                                    $price = floatval($state);
                                    $subtotal = $quantity * $price;

                                    $taxPercentage = floatval($get('tax_percentage') ?? 0);
                                    $discountPercentage = floatval($get('discount_percentage') ?? 0);

                                    $taxAmount = ($subtotal * $taxPercentage) / 100;
                                    $discountAmount = ($subtotal * $discountPercentage) / 100;

                                    $set('tax_amount', round($taxAmount, 2));
                                    $set('discount_amount', round($discountAmount, 2));
                                    $set('subtotal', round($subtotal - $discountAmount + $taxAmount, 2));
                                })
                                ->prefixIcon('heroicon-o-currency-dollar'),

                            Forms\Components\TextInput::make('tax_percentage')
                                ->label('Tax %')
                                ->translateLabel()
                                ->numeric()
                                ->minValue(0)
                                ->default(0)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                    $quantity = floatval($get('quantity') ?? 0);
                                    $price = floatval($get('unit_price') ?? 0);
                                    $subtotal = $quantity * $price;

                                    $taxAmount = ($subtotal * floatval($state)) / 100;
                                    $discountAmount = floatval($get('discount_amount') ?? 0);

                                    $set('tax_amount', round($taxAmount, 2));
                                    $set('subtotal', round($subtotal - $discountAmount + $taxAmount, 2));
                                })
                                ->prefixIcon('heroicon-o-receipt-percent'),

                            Forms\Components\TextInput::make('discount_percentage')
                                ->label('Discount %')
                                ->translateLabel()
                                ->numeric()
                                ->minValue(0)
                                ->default(0)
                                ->live(onBlur: true)
                                ->afterStateUpdated(function ($state, Forms\Get $get, Forms\Set $set) {
                                    $quantity = floatval($get('quantity') ?? 0);
                                    $price = floatval($get('unit_price') ?? 0);
                                    $subtotal = $quantity * $price;

                                    $discountAmount = ($subtotal * floatval($state)) / 100;
                                    $taxAmount = floatval($get('tax_amount') ?? 0);

                                    $set('discount_amount', round($discountAmount, 2));
                                    $set('subtotal', round($subtotal - $discountAmount + $taxAmount, 2));
                                })
                                ->prefixIcon('heroicon-o-gift'),

                            Forms\Components\TextInput::make('tax_amount')
                                ->label('Tax Amount')
                                ->translateLabel()
                                ->disabled()
                                ->numeric()
                                ->prefixIcon('heroicon-o-calculator'),

                            Forms\Components\TextInput::make('discount_amount')
                                ->label('Discount Amount')
                                ->translateLabel()
                                ->disabled()
                                ->numeric()
                                ->prefixIcon('heroicon-o-calculator'),

                            Forms\Components\TextInput::make('subtotal')
                                ->label('Subtotal')
                                ->translateLabel()
                                ->disabled()
                                ->numeric()
                                ->prefixIcon('heroicon-o-calculator'),
                        ]),
                ]),
        ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Qty')
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('unit_price')
                    ->label('Unit Price')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('tax_amount')
                    ->label('Tax')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('discount_amount')
                    ->label('Discount')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('subtotal')
                    ->label('Subtotal')
                    ->money('usd')
                    ->sortable()
                    ->alignRight()
                    ->weight(FontWeight::Bold)
                    ->summarize([
                        Tables\Columns\Summarizers\Sum::make()
                            ->money('usd'),
                    ]),
                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('product_id')
                    ->relationship('product', 'name')
                    ->label('Product')
                    ->searchable()
                    ->preload(),
                Tables\Filters\Filter::make('high_value')
                    ->label('High Value Items')
                    ->query(fn (Builder $query): Builder => $query->where('subtotal', '>', 1000)),

                Tables\Filters\Filter::make('created_until')
                    ->form([
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Created Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when(
                            $data['created_until'],
                            fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                        );
                    }),
                Tables\Filters\Filter::make('price_range')
                    ->form([
                        Forms\Components\TextInput::make('price_from')
                            ->numeric()
                            ->label('Price From'),
                        Forms\Components\TextInput::make('price_until')
                            ->numeric()
                            ->label('Price Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['price_from'],
                                fn (Builder $query, $price): Builder => $query->where('unit_price', '>=', $price)
                            )
                            ->when(
                                $data['price_until'],
                                fn (Builder $query, $price): Builder => $query->where('unit_price', '<=', $price)
                            );
                    }),
                Tables\Filters\Filter::make('quantity_range')
                    ->form([
                        Forms\Components\TextInput::make('min_quantity')
                            ->numeric()
                            ->label('Min Quantity'),
                        Forms\Components\TextInput::make('max_quantity')
                            ->numeric()
                            ->label('Max Quantity'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['min_quantity'],
                                fn (Builder $query, $quantity): Builder => $query->where('quantity', '>=', $quantity)
                            )
                            ->when(
                                $data['max_quantity'],
                                fn (Builder $query, $quantity): Builder => $query->where('quantity', '<=', $quantity)
                            );
                    }),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add Item')
                    ->modalHeading('Add New Sale Item'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make()
                        ->modalHeading('Edit Sale Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Sale Item'),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No items yet')
            ->emptyStateDescription('Start by adding your first sale item.')
            ->emptyStateIcon('heroicon-o-shopping-cart')
            ->poll('10s');
    }
}
