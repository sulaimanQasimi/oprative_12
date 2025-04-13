<?php

namespace App\Filament\Resources\ProductResource\Tables;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;

class ProductResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('type')
                    ->label(__('Type'))
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'standard' => 'info',
                        'digital' => 'success',
                        'service' => 'warning',
                        default => 'gray',
                    })
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('name')
                    ->label(__('Name'))
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->icon('heroicon-o-cube')
                    ->copyable()
                    ->tooltip('Product name')
                    ->extraAttributes(['class' => 'text-primary-600']),

                Tables\Columns\TextColumn::make('barcode')
                    ->label(__('Barcode'))
                    ->icon('heroicon-o-bars-4')
                    ->searchable()
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\ImageColumn::make('image')
                    ->label(__('Image'))
                    ->circular()
                    ->defaultImageUrl(url('/images/placeholder.png'))
                    ->toggleable(true),
                Tables\Columns\TextColumn::make('purchase_price')
                    ->label(__('Purchase Price'))
                    ->money("AFN")
                    ->sortable()
                    ->icon('heroicon-o-banknotes')
                    ->color('danger')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('wholesale_price')
                    ->label(__('Wholesale Price'))
                    ->money("AFN")
                    ->sortable()
                    ->icon('heroicon-o-banknotes')
                    ->color('warning')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('retail_price')
                    ->label(__('Retail Price'))
                    ->money("AFN")
                    ->sortable()
                    ->icon('heroicon-o-banknotes')
                    ->color('success')
                    ->alignRight()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('created_at')
                    ->label(__('Created At'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->label(__('Updated At'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name', 'asc')
            ->filters([
                SelectFilter::make('type')
                    ->label(__('Product Type'))
                    ->options([
                        'standard' => __('Standard'),
                        'digital' => __('Digital'),
                        'service' => __('Service'),
                    ]),

                Filter::make('price_range')
                    ->form([
                        TextInput::make('min_price')
                            ->label(__('Min Price'))
                            ->numeric(),
                        TextInput::make('max_price')
                            ->label(__('Max Price'))
                            ->numeric(),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['min_price'],
                                fn (Builder $query, $price): Builder => $query->where('retail_price', '>=', $price)
                            )
                            ->when(
                                $data['max_price'],
                                fn (Builder $query, $price): Builder => $query->where('retail_price', '<=', $price)
                            );
                    }),

                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')
                            ->label(__('Created From')),
                        DatePicker::make('created_until')
                            ->label(__('Created Until')),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date),
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date),
                            );
                    }),
            ], layout: FiltersLayout::AboveContent)
            ->filtersFormColumns(3)
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('')
                    ->tooltip(__('View product'))
                    ->icon('heroicon-o-eye')
                    ->color('info'),

                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip(__('Edit product'))
                    ->icon('heroicon-o-pencil-square')
                    ->color('warning'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->icon('heroicon-o-trash'),
                    Tables\Actions\ForceDeleteBulkAction::make()
                        ->icon('heroicon-o-trash'),
                    Tables\Actions\RestoreBulkAction::make()
                        ->icon('heroicon-o-arrow-path'),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-cube')
            ->emptyStateHeading(__('No products found'))
            ->emptyStateDescription(__('Create your first product to get started.'))
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()
                    ->label(__('Create product'))
                    ->icon('heroicon-o-plus'),
            ])
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->poll('60s');
    }
}