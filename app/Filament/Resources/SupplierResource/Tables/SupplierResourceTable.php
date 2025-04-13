<?php

namespace App\Filament\Resources\SupplierResource\Tables;

use Filament\Tables;
use Filament\Tables\Table;
use Filament\Support\Enums\FontWeight;
use Filament\Tables\Enums\FiltersLayout;
use Filament\Tables\Filters\SelectFilter;
use Filament\Tables\Filters\Filter;
use Filament\Forms\Components\DatePicker;
use Illuminate\Database\Eloquent\Builder;

class SupplierResourceTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Company Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold)
                    ->icon('heroicon-o-building-office')
                    ->copyable()
                    ->tooltip('Company name of the supplier')
                    ->extraAttributes(['class' => 'text-primary-600']),

                Tables\Columns\TextColumn::make('contact_name')
                    ->label('Contact Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->icon('heroicon-o-user')
                    ->copyable(),

                Tables\Columns\TextColumn::make('phone')
                    ->label('Phone')
                    ->translateLabel()
                    ->searchable()
                    ->icon('heroicon-o-phone')
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('email')
                    ->label('Email')
                    ->translateLabel()
                    ->searchable()
                    ->icon('heroicon-o-envelope')
                    ->copyable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('invoice_total')
                    ->label('Total Purchases')
                    ->translateLabel()
                    ->money('usd')
                    ->sortable()
                    ->alignRight()
                    ->weight(FontWeight::Bold)
                    ->icon('heroicon-o-banknotes')
                    ->color('success'),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created At')
                    ->translateLabel()
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name', 'asc')
            ->filters([
                Tables\Filters\TrashedFilter::make(),

                SelectFilter::make('has_purchases')
                    ->label('Purchase Status')
                    ->options([
                        'with_purchases' => 'With Purchases',
                        'without_purchases' => 'Without Purchases',
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        if (!$data['value']) {
                            return $query;
                        }

                        return $query->when(
                            $data['value'] === 'with_purchases',
                            fn (Builder $query): Builder => $query->whereHas('purchases'),
                            fn (Builder $query): Builder => $query->doesntHave('purchases')
                        );
                    }),

                Filter::make('created_at')
                    ->form([
                        DatePicker::make('created_from')
                            ->label('Created From'),
                        DatePicker::make('created_until')
                            ->label('Created Until'),
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
                    ->tooltip('View supplier')
                    ->icon('heroicon-o-eye')
                    ->color('info'),

                Tables\Actions\EditAction::make()
                    ->label('')
                    ->tooltip('Edit supplier')
                    ->icon('heroicon-o-pencil-square')
                    ->color('warning'),

                Tables\Actions\DeleteAction::make()
                    ->label('')
                    ->tooltip('Delete supplier')
                    ->icon('heroicon-o-trash')
                    ->color('danger'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make()
                        ->icon('heroicon-o-trash'),
                    Tables\Actions\RestoreBulkAction::make()
                        ->icon('heroicon-o-arrow-path'),
                    Tables\Actions\ForceDeleteBulkAction::make()
                        ->icon('heroicon-o-trash'),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-truck')
            ->emptyStateHeading('No suppliers found')
            ->emptyStateDescription('Create your first supplier to get started.')
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()
                    ->label('Create supplier')
                    ->icon('heroicon-o-plus'),
            ])
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->poll('60s');
    }
}