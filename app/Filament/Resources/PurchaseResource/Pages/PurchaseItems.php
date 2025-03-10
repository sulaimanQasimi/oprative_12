<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use App\Models\Product;
use App\Models\PurchaseItem;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class PurchaseItems extends ManageRelatedRecords
{
    protected static string $resource = PurchaseResource::class;

    protected static string $relationship = 'purchaseItems';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        $totalAmount = $this->getOwnerRecord()->total_amount;
        $currencyCode = $this->getOwnerRecord()->currency->code;

        return "Purchase Items - Total: {$currencyCode} " . number_format($totalAmount, 2);
    }

    public static function getNavigationLabel(): string
    {
        return __('Purchase Items');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Item Details')
                    ->description('Add purchase item details')
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
                                        $price = floatval($get('price') ?? 0);
                                        $quantity = floatval($state);
                                        $set('total_price', round($quantity * $price, 2));
                                    })
                                    ->prefixIcon('heroicon-o-hashtag'),

                                Forms\Components\TextInput::make('price')
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
                                        $set('total_price', round($quantity * $price, 2));
                                    })
                                    ->prefixIcon('heroicon-o-currency-dollar'),

                                Forms\Components\TextInput::make('total_price')
                                    ->label('Total Price')
                                    ->translateLabel()
                                    // ->disabled()
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
                Tables\Columns\TextColumn::make('price')
                    ->label('Unit Price')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
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
                    ->query(fn(Builder $query): Builder => $query->where('total_price', '>', 1000)),

                Tables\Filters\Filter::make('created_until')
                    ->form([
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Created Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query->when(
                            $data['created_until'],
                            fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
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
                                fn(Builder $query, $price): Builder => $query->where('price', '>=', $price)
                            )
                            ->when(
                                $data['price_until'],
                                fn(Builder $query, $price): Builder => $query->where('price', '<=', $price)
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
                                fn(Builder $query, $quantity): Builder => $query->where('quantity', '>=', $quantity)
                            )
                            ->when(
                                $data['max_quantity'],
                                fn(Builder $query, $quantity): Builder => $query->where('quantity', '<=', $quantity)
                            );
                    }),
            ])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add Item')
                    ->modalHeading('Add New Purchase Item'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make()
                        ->modalHeading('Edit Purchase Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Purchase Item'),
                ]),
                Tables\Actions\Action::make('update_prices')
                    ->label('Update Product Prices')
                    ->icon('heroicon-o-currency-dollar')
                    ->form([
                        Forms\Components\TextInput::make('purchase_price')
                            ->label(__('Purchase Price'))
                            ->numeric()
                            ->default(0)
                            ->live(debounce: 2000)
                            ->afterStateUpdated(function ($state, $get, $set) {
                                $purchasePrice = floatval($state);
                                $wholesaleProfit = floatval($get('wholesale_profit'));
                                $set('wholesale_price', $purchasePrice + $wholesaleProfit);
                            })->columnSpanFull()
                            ->prefixIcon('heroicon-o-currency-dollar'),
                        Forms\Components\TextInput::make('wholesale_profit')
                            ->label(__('Wholesale Profit'))
                            ->numeric()
                            ->default(0)
                            ->live(debounce: 2000)
                            ->afterStateUpdated(function ($state, $get, $set) {
                                $purchasePrice = floatval($get('purchase_price'));
                                $wholesaleProfit = floatval($state);
                                $set('wholesale_price', $purchasePrice + $wholesaleProfit);
                            })
                            ->prefixIcon('heroicon-o-currency-dollar'),

                        Forms\Components\TextInput::make('retail_profit')
                            ->label(__('Retail Profit'))
                            ->numeric()
                            ->default(0)
                            ->live(debounce: 2000)
                            ->afterStateUpdated(function ($state, $get, $set) {
                                $retailProfit = floatval($state);
                                $wholesalePrice = floatval($get('wholesale_price'));
                                $set('retail_price', $wholesalePrice + $retailProfit);
                            })
                            ->prefixIcon('heroicon-o-currency-dollar'),
                        Forms\Components\TextInput::make('wholesale_price')
                            ->label(__('Wholesale Price'))
                            ->numeric()
                            ->default(0)
                            ->live()
                            ->columnSpanFull()
                            ->prefixIcon('heroicon-o-currency-dollar'),

                        Forms\Components\TextInput::make('retail_price')
                            ->label(__('Retail Price'))
                            ->numeric()
                            ->default(0)
                            ->live()
                            ->columnSpanFull()
                            ->prefixIcon('heroicon-o-currency-dollar'),

                    ])
                    ->action(function (PurchaseItem $record, array $data): void {
                        $product = $record->product;
                        $product->update([
                            'purchase_price' => $data['purchase_price'],
                            'wholesale_price' => $data['wholesale_price'] ?? 0,
                            'retail_price' => $data['retail_price'] ?? 0,
                            'wholesale_profit' => $data['wholesale_profit'] ?? 0,
                            'retail_profit' => $data['retail_profit'] ?? 0,
                        ]);
                        // Filament\Notifications\Notification::make()
                        //     ->success()
                        //     ->title('Product prices updated successfully')
                        //     ->send();
                    })
                    ->modalHeading('Update Product Prices')
                    ->modalDescription('Update product prices based on this purchase item.'),


            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No items yet')
            ->emptyStateDescription('Start by adding your first purchase item.')
            ->emptyStateIcon('heroicon-o-shopping-cart')
            ->poll('10s');
    }
}
