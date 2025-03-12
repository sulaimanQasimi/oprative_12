<?php

namespace App\Filament\Resources\ProductResource\Pages;

use App\Filament\Resources\ProductResource;
use App\Models\Purchase;
use App\Models\PurchaseItem;
use Filament\Actions;
use Filament\Facades\Filament;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class ProductPurchases extends ManageRelatedRecords
{
    protected static string $resource = ProductResource::class;

    protected static string $relationship = 'purchaseItems';

    protected static ?string $navigationIcon = 'heroicon-o-shopping-bag';

    protected static ?string $modelLabel = 'Purchase';

    protected static ?string $pluralModelLabel = 'Purchases';

    public function getTitle(): string
    {
        return trans('Product Purchases');
    }

    public static function getNavigationLabel(): string
    {
        return trans('Product Purchases');
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('purchase.invoice_number')
                    ->label('Invoice Number')
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->searchable(query: function (Builder $query, string $search): Builder {
                        return $query->whereHas('purchase', function ($q) use ($search) {
                            return $q->where('invoice_number', 'like', "%{$search}%");
                        });
                    }),
                Tables\Columns\TextColumn::make('purchase.invoice_date')
                    ->label('Invoice Date')
                    ->date()
                    ->sortable(query: function (Builder $query, string $direction): Builder {
                        return $query->orderBy(Purchase::select('invoice_date')
                            ->whereColumn('purchases.id', 'purchase_items.purchase_id')
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
                Tables\Filters\SelectFilter::make('purchase_id')
                    ->relationship('purchase', 'invoice_number')
                    ->label('Invoice')
                    ->searchable()
                    ->preload(),
                Tables\Filters\Filter::make('high_value')
                    ->label('High Value Items')
                    ->query(fn(Builder $query): Builder => $query->where('total', '>', 1000)),
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
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\ViewAction::make()
                        ->modalHeading('View Purchase Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Purchase Item'),
                    Tables\Actions\Action::make('invoice')
                        ->label('Invoice')
                        ->icon('heroicon-o-document-text')
                        ->url(fn(PurchaseItem $record): string => route('filament.admin.resources.purchases.invoice', ['purchase' => $record->purchase_id]))
                        ->openUrlInNewTab(),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No purchases yet')
            ->emptyStateDescription('No purchase records found for this product.')
            ->emptyStateIcon('heroicon-o-shopping-bag')
            ->poll('10s');
    }
}
