<?php

namespace App\Filament\Resources\SupplierResource\Tables;

use Filament\Forms;
use Filament\Forms\Form;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SupplierPaymentTable
{
    public static function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('purchase.invoice_number')
                    ->label('Invoice')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Date')
                    ->translateLabel()
                    ->date()
                    ->sortable(),

                Tables\Columns\TextColumn::make('amount')
                    ->label('Amount')
                    ->translateLabel()
                    ->money('usd')
                    ->sortable()
                    ->weight(FontWeight::Bold),

                Tables\Columns\TextColumn::make('currency.name')
                    ->label('Currency')
                    ->translateLabel()
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Payment Method')
                    ->translateLabel()
                    ->badge()
                    ->color(fn(string $state): string => match ($state) {
                        'cash' => 'success',
                        'bank_transfer' => 'info',
                        'check' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn(string $state): string => ucfirst(str_replace('_', ' ', $state)))
                    ->searchable()
                    ->sortable(),

                // Tables\Columns\TextColumn::make('reference_number')
                //     ->label('Reference')
                //     ->translateLabel()
                //     ->searchable()
                //     ->toggleable(),

                Tables\Columns\TextColumn::make('bank_name')
                    ->label('Bank')
                    ->translateLabel()
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('purchase.invoice_date')
                    ->label('Invoice Date')
                    ->translateLabel()
                    ->date()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                // Tables\Columns\TextColumn::make('purchase.total_amount')
                //     ->label('Total Amount')
                //     ->translateLabel()
                //     ->money('usd'),

                // Tables\Columns\TextColumn::make('purchase.paid_amount')
                //     ->label('Paid Amount')
                //     ->translateLabel()
                //     ->money('usd'),

                // Tables\Columns\TextColumn::make('purchase.remaining_balance')
                //     ->label('Remaining')
                //     ->money('usd'),

                // Tables\Columns\TextColumn::make('purchase.status')
                //     ->label('Status')
                //     ->translateLabel()
                //     ->badge()
                //     ->color(fn(string $state): string => match ($state) {
                //         'paid' => 'success',
                //         'partial' => 'warning',
                //         'unpaid' => 'danger',
                //         default => 'gray',
                //     })
                //     ->formatStateUsing(fn(string $state): string => trans(ucfirst($state)))
                //     ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'cash' => trans('Cash'),
                        'bank_transfer' => trans('Bank Transfer'),
                        'check' => trans('Check'),
                        'other' => trans('Other')
                    ])
                    ->label('Payment Method')
                    ->translateLabel(),

                Tables\Filters\Filter::make('amount_range')
                    ->form([
                        Forms\Components\TextInput::make('amount_from')
                            ->numeric()
                            ->label('Amount From'),
                        Forms\Components\TextInput::make('amount_until')
                            ->numeric()
                            ->label('Amount Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['amount_from'],
                                fn(Builder $query, $amount): Builder => $query->where('amount', '>=', $amount)
                            )
                            ->when(
                                $data['amount_until'],
                                fn(Builder $query, $amount): Builder => $query->where('amount', '<=', $amount)
                            );
                    }),

                Tables\Filters\SelectFilter::make('purchase')
                    ->relationship('purchase', 'invoice_number')
                    ->searchable()
                    ->preload()
                    ->label('Purchase'),

                Tables\Filters\Filter::make('created_at')
                    ->form([
                        Forms\Components\DatePicker::make('created_from')
                            ->label('Created From'),
                        Forms\Components\DatePicker::make('created_until')
                            ->label('Created Until'),
                    ])
                    ->query(function (Builder $query, array $data): Builder {
                        return $query
                            ->when(
                                $data['created_from'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date)
                            )
                            ->when(
                                $data['created_until'],
                                fn(Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date)
                            );
                    })
            ])
            ->headerActions([])
            ->actions([])
            ->bulkActions([])
            ->emptyStateHeading('No payments yet')
            ->emptyStateDescription('Start by adding your first payment.')
            ->emptyStateIcon('heroicon-o-credit-card')
            ->poll('10s');
    }
}
