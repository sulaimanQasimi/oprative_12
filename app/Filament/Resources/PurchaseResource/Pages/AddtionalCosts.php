<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use App\Models\Product;
use Filament\Actions;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Pages\ManageRelatedRecords;
use Filament\Support\Enums\FontWeight;
use Filament\Tables;
use Filament\Tables\Table;
use Illuminate\Database\Eloquent\Builder;

class AddtionalCosts extends ManageRelatedRecords
{
    protected static string $resource = PurchaseResource::class;

    protected static string $relationship = 'additional_costs';

    protected static ?string $navigationIcon = 'heroicon-o-cube';

    protected static ?string $modelLabel = 'Item';

    protected static ?string $pluralModelLabel = 'Items';

    public function getTitle(): string
    {
        return trans("Additional Cost");
    }

    public static function getNavigationLabel(): string
    {
        return __('Additional Cost');
    }

    public function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\TextInput::make('name')
                    ->label(__('Name'))
                    ->required()
                    ->maxLength(255)
                    ->prefixIcon('heroicon-o-document-text'),
                Forms\Components\TextInput::make('amount')
                    ->label(__('Amount'))
                    ->numeric()
                    ->default(0)
                    ->live(debounce: 2000)
                    ->prefixIcon('heroicon-o-currency-dollar'),


            ]);
    }

    public function table(Table $table): Table
    {
        return $table
            ->recordTitleAttribute('id')
            ->defaultSort('id', 'desc')
            ->columns([
                Tables\Columns\TextColumn::make('name')
                    ->label('Name')
                    ->translateLabel()
                    ->searchable()
                    ->sortable()
                    ->weight(FontWeight::Bold),
                Tables\Columns\TextColumn::make('amount')
                    ->label('Amount')
                    ->money('AFN')
                    ->sortable()
                    ->translateLabel()
                    ->weight(FontWeight::Bold)
                    ->summarize([
                        Tables\Columns\Summarizers\Sum::make()
                            ->money('AFN'),
                    ]),
            ])
            ->filters([])
            ->headerActions([
                Tables\Actions\CreateAction::make()
                    ->label('Add Item')
                    ->modalHeading('Add New Purchase Item'),
            ])
            ->actions([
                Tables\Actions\ActionGroup::make([
                    Tables\Actions\EditAction::make()
                        ->modalHeading('Edit Purchase Item'),
                    Tables\Actions\DeleteAction::make()
                        ->modalHeading('Delete Purchase Item'),
                ]),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ])
            // ->emptyStateHeading('No items yet')
            // ->emptyStateDescription('Start by adding your first purchase item.')
            // ->emptyStateIcon('heroicon-o-shopping-cart')
            ->poll('10s');
    }
}
