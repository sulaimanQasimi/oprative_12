<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;

class PurchasePayments extends ManageRelatedRecords
{
    protected static string $resource = PurchaseResource::class;

    protected static string $relationship = 'purchasePayments';

    protected static ?string $navigationIcon = 'heroicon-o-rectangle-stack';

    protected static ?string $modelLabel = 'Payment';

    protected static ?string $pluralModelLabel = 'Payments';

    public function getHeaderWidgets(): array
    {
        return [
            PurchasePaymentStats::class,
        ];
    }

    public function getTitle(): string
    {
        return __("Purchase Payments");
    }

    public static function getNavigationLabel(): string
    {
        return __('Purchase Payments');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Payment Details')
                    ->description('Add payment details')
                    ->collapsible()
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('amount')
                                    ->label('Amount')
                                    ->required()
                                    ->numeric()
                                    ->minValue(0)
                                    ->mask('999999.99')
                                    ->prefixIcon('heroicon-o-currency-dollar'),

                                Forms\Components\Select::make('currency_id')
                                    ->relationship('currency', 'name')
                                    ->required()
                                    ->searchable()
                                    ->preload()
                                    ->default(fn ($livewire) => $livewire->getOwnerRecord()->currency_id)
                                    ->prefixIcon('heroicon-o-globe-alt'),

                                Forms\Components\Select::make('payment_method')
                                    ->label('Payment Method')
                                    ->options([
                                        'cash' => 'Cash',
                                        'bank_transfer' => 'Bank Transfer',
                                        'check' => 'Check',
                                        'other' => 'Other'
                                    ])
                                    ->required()
                                    ->prefixIcon('heroicon-o-credit-card'),

                                Forms\Components\DatePicker::make('payment_date')
                                    ->label('Payment Date')
                                    ->required()
                                    ->default(now())
                                    ->prefixIcon('heroicon-o-calendar'),

                                Forms\Components\TextInput::make('reference_number')
                                    ->label('Reference Number')
                                    ->helperText('Check number, transfer reference, etc.')
                                    ->prefixIcon('heroicon-o-hashtag'),

                                Forms\Components\TextInput::make('bank_name')
                                    ->label('Bank Name')
                                    ->prefixIcon('heroicon-o-building-library'),

                                Forms\Components\TextInput::make('bank_account')
                                    ->label('Bank Account')
                                    ->prefixIcon('heroicon-o-identification'),

                                Forms\Components\Textarea::make('notes')
                                    ->label('Notes')
                                    ->columnSpanFull()
                                    ->rows(3),
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

                Tables\Columns\TextColumn::make('created_at')
                    ->label('Created')
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
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
                Tables\Actions\CreateAction::make()
                    ->label('Add Payment')
                    ->modalHeading('Add New Payment'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make()
                        ->modalHeading('Edit Payment'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Payment'),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No payments yet')
            ->emptyStateDescription('Start by adding your first payment.')
            ->emptyStateIcon('heroicon-o-credit-card')
            ->poll('10s');
    }
}
