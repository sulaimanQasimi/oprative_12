<?php

namespace App\Filament\Resources;

use App\Filament\Resources\CurrencyResource\Pages;
use App\Filament\Resources\CurrencyResource\RelationManagers;
use App\Models\Currency;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\SoftDeletingScope;
use Filament\Tables\Enums\FiltersLayout;

class CurrencyResource extends Resource
{
    protected static ?string $model = Currency::class;

    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';

    protected static ?string $recordTitleAttribute = 'name';

    protected static ?int $navigationSort = 3;

    public static function getPluralModelLabel(): string
    {
        return __('Currencies');
    }

    public static function getModelLabel(): string
    {
        return __('Currency');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\Section::make('Currency Details')
                    ->schema([
                        Forms\Components\Grid::make(2)
                            ->schema([
                                Forms\Components\TextInput::make('name')
                                    ->required()
                                    ->minLength(2)
                                    ->maxLength(255)
                                    ->unique(table: 'currencies', column: 'name', ignoreRecord: true)
                                    ->regex('/^[A-Za-z\s]+$/')
                                    ->label('Name')
                                    ->placeholder('Enter currency name')
                                    ->prefixIcon('heroicon-o-currency-dollar')
                                    ->translateLabel(),
                                Forms\Components\TextInput::make('code')
                                    ->required()
                                    ->length(3)
                                    ->unique(table: 'currencies', column: 'code', ignoreRecord: true)
                                    ->regex('/^[A-Z]+$/')
                                    ->label('Code')
                                    ->placeholder('Enter currency code')
                                    ->prefixIcon('heroicon-o-document-text')
                                    ->helperText('Use standard 3-letter currency code (e.g. USD, EUR, GBP)')
                                    ->translateLabel(),
                            ]),
                    ]),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->searchable()
                    ->sortable()
                    ->label(__('Name'))
                    ->icon('heroicon-o-currency-dollar')
                    ->weight('medium')
                    ->copyable()
                    ->tooltip('Currency name')
                    ->extraAttributes(['class' => 'text-primary-600']),

                Tables\Columns\TextColumn::make('code')
                    ->searchable()
                    ->sortable()
                    ->label(__('Code'))
                    ->badge()
                    ->color('success')
                    ->alignCenter()
                    ->copyable()
                    ->tooltip('ISO currency code'),

                Tables\Columns\TextColumn::make('created_at')
                    ->sortable()
                    ->label(__('Created At'))
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),

                Tables\Columns\TextColumn::make('updated_at')
                    ->sortable()
                    ->label(__('Updated At'))
                    ->dateTime()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->defaultSort('name', 'asc')
            ->filters([
                Tables\Filters\TrashedFilter::make(),
                Tables\Filters\SelectFilter::make('code')
                    ->options(function() {
                        return Currency::pluck('code', 'code')->toArray();
                    })
                    ->label(__('Currency Code')),
            ], layout: FiltersLayout::AboveContent)
            ->filtersFormColumns(3)
            ->actions([
                Tables\Actions\ViewAction::make()
                    ->icon('heroicon-o-eye')
                    ->color('info'),
                Tables\Actions\EditAction::make()
                    ->icon('heroicon-o-pencil')
                    ->color('warning'),
                Tables\Actions\DeleteAction::make()
                    ->icon('heroicon-o-trash')
                    ->color('danger'),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ])
            ->emptyStateIcon('heroicon-o-currency-dollar')
            ->emptyStateHeading('No currencies found')
            ->emptyStateDescription('Create your first currency to get started.')
            ->emptyStateActions([
                Tables\Actions\CreateAction::make()
                    ->label('Create currency')
                    ->icon('heroicon-o-plus'),
            ])
            ->striped()
            ->paginated([10, 25, 50, 100])
            ->poll('60s');
    }

    public static function getRelations(): array
    {
        return [
            //
        ];
    }

    public static function getPages(): array
    {
        return [
            'index' => Pages\ListCurrencies::route('/'),
            'create' => Pages\CreateCurrency::route('/create'),
            'view' => Pages\ViewCurrency::route('/{record}'),
            'edit' => Pages\EditCurrency::route('/{record}/edit'),
        ];
    }

    public static function getEloquentQuery(): Builder
    {
        return parent::getEloquentQuery()
            ->withoutGlobalScopes([
                SoftDeletingScope::class,
            ]);
    }
}
