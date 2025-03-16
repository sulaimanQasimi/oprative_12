<?php

namespace App\Filament\Resources\PurchaseResource\Tables;

use App\Models\Product;
use App\Models\PurchaseItem;
use Filament\Forms;
use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;
use Illuminate\Database\Eloquent\Builder;

class PurchaseItemPageTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('product.name')
                    ->label('Product')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Quantity')
                    ->translateLabel()
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Unit Price')
                    ->translateLabel()
                    ->money('usd')
                    ->sortable(),
                Tables\Columns\TextColumn::make('total_price')
                    ->label('Total')
                    ->translateLabel()
                    ->money('usd')
                    ->sortable()
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
                    ->label('Update Product Price')
                    ->translateLabel()
                    ->icon('heroicon-o-currency-dollar')
                    ->form([
                        Forms\Components\TextInput::make('purchase_price')
                            ->label(__('Purchase Price'))
                            ->numeric()
                            ->default(fn(PurchaseItem $record): float => $record->price)
                            ->live(debounce: 2000)
                            ->columnSpanFull()
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
                    })
                    ->modalHeading(trans('Update Product Price'))
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
