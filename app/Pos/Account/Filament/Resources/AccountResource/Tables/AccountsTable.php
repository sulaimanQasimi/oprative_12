<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Tables;

use Filament\Tables\Table;
use Filament\Tables;
use Filament\Forms;
use Maatwebsite\Excel\Facades\Excel;
use App\Pos\Account\Components\AccountColumn;
use App\Pos\Account\Export\ExportAccounts;
use App\Pos\Account\Filament\Resources\AccountResource\Actions\AccountsTableActions;
use App\Pos\Account\Filament\Resources\AccountResource\Actions\ExportAccountsAction;
use App\Pos\Account\Filament\Resources\AccountResource\Actions\ImportAccountsAction;
use App\Pos\Account\Filament\Resources\AccountResource\Filters\AccountsFilters;
use TomatoPHP\FilamentHelpers\Contracts\TableBuilder;
use TomatoPHP\FilamentTypes\Components\TypeColumn;

class AccountsTable extends TableBuilder
{
    public function table(Table $table): Table
    {
        $colums = collect([]);

        $colums->add(
            // AccountColumn::make('id')
            //     ->label(trans('account::messages.accounts.coulmns.id')),
            Tables\Columns\TextColumn::make('name')
                ->label("Name of Account")
                ->translateLabel()
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->searchable()
        );

        $colums->add(
            Tables\Columns\TextColumn::make('name')
                ->label("Name")
                ->translateLabel()
                ->toggleable()
                ->sortable()
                ->searchable()
        );

        $colums->add(
            TypeColumn::make('type')
                ->label("Type")
                ->translateLabel()
                ->toggleable()
                ->sortable()
                ->searchable()
        );

        $colums->add(
            Tables\Columns\TextColumn::make('type')
                ->label("Type")
                ->translateLabel()
                ->toggleable()
                ->sortable()
                ->searchable()
        );

        $colums->add(
            Tables\Columns\TextColumn::make('teams.name')
                ->badge()
                ->icon('heroicon-o-user-group')
                ->label("Teams")
                ->translateLabel()
                ->toggleable()
                ->searchable()
        );
        $colums = $colums->merge([
            Tables\Columns\TextColumn::make('email')
                ->label("Email")
                ->translateLabel()
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->searchable(),
            Tables\Columns\TextColumn::make('phone')
                ->label("Phone")
                ->translateLabel()
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->searchable()
        ]);



        $colums->add(
            Tables\Columns\IconColumn::make('is_active')
                ->label("Is Active")
                ->translateLabel()
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->boolean()
        );

        $colums = $colums->merge([
            Tables\Columns\TextColumn::make('deleted_at')
                ->label("Deleted At")
                ->translateLabel()
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
            Tables\Columns\TextColumn::make('created_at')
                ->label("Created At")
                ->translateLabel()
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
            Tables\Columns\TextColumn::make('updated_at')
                ->label("Updated At")
                ->translateLabel()
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ]);

        $actions = collect([]);
        $actions->add(ExportAccountsAction::make());
        $actions->add(ImportAccountsAction::make());

        return $table
            ->headerActions($actions->toArray())
            ->columns($colums->toArray())
            ->filters(AccountsFilters::make())
            ->actions(AccountsTableActions::make())
            ->defaultSort('id', 'desc')
            ->bulkActions([
                Tables\Actions\BulkActionGroup::make([
                    Tables\Actions\DeleteBulkAction::make(),
                    Tables\Actions\ForceDeleteBulkAction::make(),
                    Tables\Actions\RestoreBulkAction::make(),
                ]),
            ]);
    }
}
