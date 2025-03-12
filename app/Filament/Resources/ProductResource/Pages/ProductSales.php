<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\Sale;
use App\Models\SaleItem;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductSales extends ManageRelatedRecords
{
    protected static string $resource = ProductResource::class;

    protected static string $relationship = 'saleItems';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-cart';

    protected static ?string $modelLabel = 'Sale';

    protected static ?string $pluralModelLabel = 'Sales';

    public function getTitle(): string
    {
        return trans('Product Sales');
    }

    public static function getNavigationLabel(): string
    {
        return trans('Product Sales');
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('sale.reference')
                    ->label('Invoice Number')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('sale', function ($q) use ($search) {
                            return $q->where('reference', 'like', "%{$search}%");
                        });
                    }),
                Tables\Columns\TextColumn::make('sale.date')
                    ->label('Invoice Date')
                    ->date()
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderBy(Sale::select('date')
                            ->whereColumn('sales.id', 'sale_items.sale_id')
                            ->latest(), $direction);
                    }),
                Tables\Columns\TextColumn::make('quantity')
                    ->label('Qty')
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Unit Price')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('total')
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
                Tables\Filters\SelectFilter::make('sale_id')
                    ->relationship('sale', 'reference')
                    ->label('Invoice')
                    ->searchable()
                    ->preload(),
                Tables\Filters\Filter::make('high_value')
                    ->label('High Value Items')
                    ->query(fn (Builder $query): Builder => $query->where('total', '>', 1000)),
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
                                fn (Builder $query, $price): Builder => $query->where('price', '>=', $price)
                            )
                            ->when(
                                $data['price_until'],
                                fn (Builder $query, $price): Builder => $query->where('price', '<=', $price)
                            );
                    }),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\ViewAction::make()
                        ->modalHeading('View Sale Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Sale Item'),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No sales yet')
            ->emptyStateDescription('No sales records found for this product.')
            ->emptyStateIcon('heroicon-o-shopping-cart')
            ->poll('10s');
    }
}
