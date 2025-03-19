<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class SaleItems extends ManageRelatedRecords
{
    protected static string $resource = SaleResource::class;

    protected static string $relationship = 'saleItems';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        $totalAmount = $this->getOwnerRecord()->total_amount;
        $currencyCode = $this->getOwnerRecord()->currency->code;

        return "Sale Items - Total: {$currencyCode} " . number_format($totalAmount, 2);
    }

    public static function getNavigationLabel(): string
    {
        return __('Sale Items');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Grid::make(2)
                    ->schema([
                        Forms\Components\Select::make('product_id')
                            ->relationship('product', 'name')
                            ->searchable()
                            ->preload()
                            ->required()
                            ->live()
                            ->disabled(fn() => $this->getOwnerRecord()->status === 'completed')
                            ->afterStateUpdated(function ($state, Forms\Set $set) {
                                if ($state) {
                                    $product = Product::find($state);
                                    if ($product) {
                                        $set('unit_price', $product->wholesale_price);
                                    }
                                }
                            })
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
                            ->disabled(fn() => $this->getOwnerRecord()->status === 'completed')
                            ->afterStateUpdated(function ($state, Forms\Set $set, $get) {
                                if ($state && $get('unit_price')) {
                                    $set('total', $state * $get('unit_price'));
                                }
                            })
                            ->required()
                            ->prefixIcon('heroicon-o-hashtag'),

                        Forms\Components\TextInput::make('unit_price')
                            ->label('Unit Price')
                            ->translateLabel()
                            ->numeric()
                            ->minValue(0)
                            ->required()
                            ->live(onBlur: true)
                            ->disabled(fn() => $this->getOwnerRecord()->status === 'completed')
                            ->afterStateUpdated(function ($state, Forms\Set $set, $get) {
                                if ($state && $get('quantity')) {
                                    $set('total', $state * $get('quantity'));
                                }
                            })
                            ->mask('999999.99')
                            ->prefixIcon('heroicon-o-currency-dollar')
                            ->suffixAction(
                                Forms\Components\Actions\Action::make('selectPrice')
                                    ->icon('heroicon-m-chevron-down')
                                    ->label('Select Price')
                                    ->disabled(fn() => $this->getOwnerRecord()->status === 'completed')
                                    ->form([
                                        Forms\Components\Select::make('price_type')
                                            ->options([
                                                'wholesale' => trans('Wholesale Price'),
                                                'retail' => trans('Retail Price'),
                                            ])
                                            ->required()
                                            ->label('Select Price Type')
                                    ])
                                    ->action(function (array $data, Forms\Set $set, $get) {
                                        $productId = $get('product_id');
                                        if ($productId) {
                                            $product = Product::find($productId);
                                            if ($product) {
                                                $price = $data['price_type'] === 'wholesale'
                                                    ? $product->wholesale_price
                                                    : $product->retail_price;
                                                $set('unit_price', $price);
                                                if ($get('quantity')) {
                                                    $set('total', $price * $get('quantity'));
                                                }
                                            }
                                        }
                                    })
                            ),

                        Forms\Components\Hidden::make('price')
                            ->default(0),
                        Forms\Components\TextInput::make('total')
                            ->label('Total')
                            ->translateLabel()
                            ->disabled()
                            ->numeric()
                            ->prefixIcon('heroicon-o-calculator'),
                    ])
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
                    ->label('Quantity')
                    ->sortable()
                    ->alignCenter(),
                Tables\Columns\TextColumn::make('unit_price')
                    ->label('Unit Price')
                    ->money('usd')
                    ->sortable()
                    ->alignRight(),
                Tables\Columns\TextColumn::make('price')
                    ->label('Price')
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
                    ->label('Created At')
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
                    ->query(fn(Builder $query): Builder => $query->where('subtotal', '>', 1000)),

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
                                fn(Builder $query, $price): Builder => $query->where('unit_price', '>=', $price)
                            )
                            ->when(
                                $data['price_until'],
                                fn(Builder $query, $price): Builder => $query->where('unit_price', '<=', $price)
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
                    ->modalHeading('Add New Sale Item')
                    ->hidden(fn() => $this->getOwnerRecord()->status === 'completed'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make()
                        ->modalHeading('Edit Sale Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Sale Item'),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            ->emptyStateHeading('No items yet')
            ->emptyStateDescription('Start by adding your first sale item.')
            ->emptyStateIcon('heroicon-o-shopping-cart')
            ->poll('10s');
    }
}
