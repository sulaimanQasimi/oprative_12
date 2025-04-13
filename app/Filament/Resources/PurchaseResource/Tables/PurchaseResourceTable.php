<?php

namespace App\Filament\Resources\PurchaseResource\Tables;

use Filament\Tables\Table;
use Filament\Tables;
use Filament\Tables\Columns\TextColumn;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Filament\Forms\Components\TextInput;
use Illuminate\Database\Eloquent\Builder;

class PurchaseResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('invoice_number')
                    ->label('Invoice Number')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->icon('heroicon-o-document-text')
                    ->color('primary')
                    ->copyable()
                    ->extraAttributes(['class' => 'text-primary-600']),

                Tables\Columns\TextColumn::make('supplier.name')
                    ->label('Company Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-o-building-storefront'),

                Tables\Columns\TextColumn::make('invoice_date')
                    ->label('Invoice Date')
                    ->translateLabel()
                    ->date()
                    ->sortable()
                    ->jalaliDate()
                    ->icon('heroicon-o-calendar'),

                Tables\Columns\TextColumn::make('user.name')
                    ->label('User')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-o-user')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('currency.name')
                    ->label('Currency')
                    ->translateLabel()
                    ->sortable()
                    ->icon('heroicon-o-currency-dollar')
                    ->toggleable(),

                Tables\Columns\TextColumn::make('currency_rate')
                    ->label('Rate')
                    ->translateLabel()
                    ->numeric()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                TextColumn::make('total_amount')
                    ->label('Total Amount')
                    ->translateLabel()
                    ->money('USD')
                    ->sortable()
                    ->searchable()
                    ->alignRight()
                    ->weight(FontWeight::Bold)
                    ->icon('heroicon-o-banknotes')
                    ->color('success'),

                Tables\Columns\TextColumn::make('status')
                    ->label('Status')
                    ->badge()
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->color(fn(string $state): string => match ($state) {
                        'purchase' => 'info',
                        'onway' => 'warning',
                        'on_border' => 'warning',
                        'on_plan' => 'warning',
                        'on_ship' => 'warning',
                        'arrived' => 'success',
                        'warehouse_moved' => 'success',
                        'return' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => match ($state) {
                        'purchase' => trans('Purchase'),
                        'onway' => trans('On Way'),
                        'on_border' => trans('On Border'),
                        'on_plan' => trans('On Plan'),
                        'on_ship' => trans('On Ship'),
                        'arrived' => trans('Arrived'),
                        'warehouse_moved' => trans('Moved to Warehouse'),
                        'return' => trans('Return'),
                        default => $state,
                    }),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('invoice_date', 'desc')
            ->filters([
                Tables\Filters\TrashedFilter::make(),

                SelectFilter::make('status')
                    ->label('Status')
                    ->options([
                        'purchase' => trans('Purchase'),
                        'onway' => trans('On Way'),
                        'on_border' => trans('On Border'),
                        'on_plan' => trans('On Plan'),
                        'on_ship' => trans('On Ship'),
                        'arrived' => trans('Arrived'),
                        'warehouse_moved' => trans('Moved to Warehouse'),
                        'return' => trans('Return'),
                    ]),

                SelectFilter::make('supplier')
                    ->relationship('supplier', 'name')
                    ->searchable()
                    ->preload(),

                Filter::make('invoice_date')
                    ->form([
                        DatePicker::make('invoice_from')
                            ->label('From')
                            ->jalali(),
                        DatePicker::make('invoice_until')
                            ->label('Until')
                            ->jalali(),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['invoice_from'],
                                fn (Builder $query, $date): Builder => $query->whereDate('invoice_date', '>=', $date),
                            )
                            ->when(
                                $data['invoice_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('invoice_date', '<=', $date),
                            );
                    }),

                Filter::make('amount')
                    ->form([
                        TextInput::make('min_amount')
                            ->label('Min Amount')
                            ->numeric(),
                        TextInput::make('max_amount')
                            ->label('Max Amount')
                            ->numeric(),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['min_amount'],
                                fn (Builder $query, $amount): Builder => $query->where('total_amount', '>=', $amount),
                            )
                            ->when(
                                $data['max_amount'],
                                fn (Builder $query, $amount): Builder => $query->where('total_amount', '<=', $amount),
                            );
                    }),
            ], layout: FiltersLayout::AboveContent)
            ->filtersFormColumns(3)
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->label('')
                    ->tooltip('View purchase')
                    ->icon('heroicon-o-eye')
                    ->color('info'),

                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip('Edit purchase')
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
            ->emptyStateIcon('heroicon-o-shopping-cart')
            ->emptyStateHeading('No purchases found')
            ->emptyStateDescription('Create your first purchase to get started.')
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()
                    ->label('Create purchase')
                    ->icon('heroicon-o-plus'),
            ])
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->poll('60s');
    }
}
