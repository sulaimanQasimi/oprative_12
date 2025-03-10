<?php

namespace App\Filament\Resources\SupplierResource\Pages;

use App\Filament\Resources\SupplierResource;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class SupplierPayments extends ManageRelatedRecords
{
    protected static string $resource = SupplierResource::class;

    protected static string $relationship = 'purchasePayment';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $modelLabel = 'Payment';

    protected static ?string $pluralModelLabel = 'Payments';

    public function getHeaderWidgets(): array
    {
        return [

        ];
    }

    public function getTitle(): string
    {
        return __('Supplier Payments');
    }

    public static function getNavigationLabel(): string
    {
        return __('Supplier Payments');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('created_at', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('purchase.invoice_number')
                    ->label('Invoice')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('payment_date')
                    ->label('Date')
                    ->date()
                    ->sortable(),

                Tables\Columns\TextColumn::make('amount')
                    ->money('usd')
                    ->sortable()
                    ->alignRight()
                    ->weight(FontWeight::Bold)
                    ->summarize([
                        Tables\Columns\Summarizers\Sum::make()
                            ->money('usd'),
                    ]),

                Tables\Columns\TextColumn::make('currency.name')
                    ->label('Currency')
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('payment_method')
                    ->label('Method')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'cash' => 'success',
                        'bank_transfer' => 'info',
                        'check' => 'warning',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => ucfirst(str_replace('_', ' ', $state)))
                    ->searchable()
                    ->sortable(),

                Tables\Columns\TextColumn::make('reference_number')
                    ->label('Reference')
                    ->searchable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('bank_name')
                    ->label('Bank')
                    ->searchable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('purchase.invoice_date')
                    ->label('Invoice Date')
                    ->date()
                    ->sortable()
                    ->toggleable(),

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('purchase.total_amount')
                    ->label('Total Amount')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),

                Tables\Columns\TextColumn::make('purchase.paid_amount')
                    ->label('Paid Amount')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),

                Tables\Columns\TextColumn::make('purchase.remaining_balance')
                    ->label('Remaining')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),

                Tables\Columns\TextColumn::make('purchase.status')
                    ->label('Status')
                    ->badge()
                    ->color(fn (string $state): string => match ($state) {
                        'paid' => 'success',
                        'partial' => 'warning',
                        'unpaid' => 'danger',
                        default => 'gray',
                    })
                    ->formatStateUsing(fn (string $state): string => trans(ucfirst($state)))
                    ->sortable(),
            ])
            ->filters([
                Tables\Filters\SelectFilter::make('payment_method')
                    ->options([
                        'cash' => 'Cash',
                        'bank_transfer' => 'Bank Transfer',
                        'check' => 'Check',
                        'other' => 'Other'
                    ])
                    ->label('Payment Method'),

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
                                fn (Builder $query, $amount): Builder => $query->where('amount', '>=', $amount)
                            )
                            ->when(
                                $data['amount_until'],
                                fn (Builder $query, $amount): Builder => $query->where('amount', '<=', $amount)
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
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '>=', $date)
                            )
                            ->when(
                                $data['created_until'],
                                fn (Builder $query, $date): Builder => $query->whereDate('created_at', '<=', $date)
                            );
                    })
            ])
            ->headerActions([
                // Removed CreateAction to disable adding new payments
            ])
            ->actions([
            ])
            ->bulkActions([
            ])
            ->emptyStateHeading('No payments yet')
            ->emptyStateDescription('Start by adding your first payment.')
            ->emptyStateIcon('heroicon-o-credit-card')
            ->poll('10s');
    }
}
