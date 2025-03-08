<?php

namespace App\Pos\Account\Filament\Resources;

use TomatoPHP\FilamentIcons\Components\IconPicker;
use Filament\Resources\Concerns\Translatable;
use App\Pos\Account\Components\TypeColumn;
use App\Pos\Account\Filament\Resources\TypeResource\Pages;
use App\Pos\Account\Models\Type;
use Filament\Forms;
use Filament\Forms\Form;
use Filament\Resources\Resource;
use Filament\Tables;
use Filament\Tables\Table;

class TypeResource extends Resource
{
    use Translatable;

    protected static ?string $model = Type::class;

    protected static ?string $navigationIcon = 'heroicon-o-tag';

    public static function getNavigationLabel(): string
    {
        return trans('Account Types');
    }

    public static function getLabel(): ?string
    {
        return  trans('Account Type');
    }

    public static function getPluralLabel(): ?string
    {
        return trans('Account Types');
    }

    public static function getNavigationGroup(): ?string
    {
        return trans('Account Types');
    }

    public static function form(Form $form): Form
    {
        return $form
            ->schema([
                Forms\Components\SpatieMediaLibraryFileUpload::make('image')
                    ->label(trans('Image'))
                    ->columnSpan(2)
                    ->collection('Image')
                    ->image()
                    ->maxFiles(1),
                Forms\Components\TextInput::make('name')
                    ->label(trans('Name'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\TextInput::make('key')
                    ->label(trans('Key'))
                    ->required()
                    ->maxLength(255),
                Forms\Components\Textarea::make('description')
                    ->label(trans('Description'))
                    ->columnSpanFull(),
                Forms\Components\ColorPicker::make('color')
                    ->required()
                    ->label(trans('Color')),
                IconPicker::make('icon')
                    ->required()
                    ->label(trans('icon')),

                Forms\Components\Toggle::make('is_activated')
                    ->label(trans('Is Activated')),
            ]);
    }

    public static function table(Table $table): Table
    {
        return $table
            ->columns([
                Tables\Columns\TextColumn::make('for')
                    ->label(trans('filament-types::messages.form.for'))
                    ->searchable(),
                Tables\Columns\TextColumn::make('type')
                    ->label(trans('filament-types::messages.form.type'))
                    ->searchable(),
                TypeColumn::make('key')
                    ->for(fn($record) => $record->for)
                    ->type(fn($record) => $record->type)
                    ->label(trans('filament-types::messages.form.key'))
                    ->searchable(),
                Tables\Columns\ToggleColumn::make('is_activated')
                    ->label(trans('filament-types::messages.form.is_activated')),
                Tables\Columns\TextColumn::make('created_at')
                    ->label(trans('filament-types::messages.form.created_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
                Tables\Columns\TextColumn::make('updated_at')
                    ->label(trans('filament-types::messages.form.updated_at'))
                    ->dateTime()
                    ->sortable()
                    ->toggleable(isToggledHiddenByDefault: true),
            ])
            ->groups([
                Tables\Grouping\Group::make('for'),
                Tables\Grouping\Group::make('type'),
            ])
            ->defaultGroup('for')
            ->defaultSort('order')
            ->reorderable('order')
            ->filters([])
            ->actions([
                Tables\Actions\EditAction::make()
                    ->tooltip(__('filament-actions::edit.single.label'))
                    ->iconButton(),
                Tables\Actions\ReplicateAction::make()
                    ->tooltip(__('filament-actions::replicate.single.label'))
                    ->iconButton(),
                Tables\Actions\DeleteAction::make()
                    ->tooltip(__('filament-actions::delete.single.label'))
                    ->iconButton(),
            ])
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                ]),
            ]);
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
            'index' => Pages\ListTypes::route('/')
        ];
    }
}
