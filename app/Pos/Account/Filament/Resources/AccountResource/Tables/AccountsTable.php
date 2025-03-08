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

        //Use Avatar
        if(filament('account')->useAvatar) {
            $colums->push(
                AccountColumn::make('id')
                    ->label(trans('account::messages.accounts.coulmns.id')),
                Tables\Columns\TextColumn::make('name')
                    ->label(trans('account::messages.accounts.coulmns.name'))
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->sortable()
                    ->searchable()
            );
        }
        else {
            $colums->push(
                Tables\Columns\TextColumn::make('name')
                    ->label(trans('account::messages.accounts.coulmns.name'))
                    ->toggleable()
                    ->sortable()
                    ->searchable()
            );
        }

        //Use Type Column
        if(filament('account')->useTypes){
            $colums->push(
                TypeColumn::make('type')
                    ->label(trans('account::messages.accounts.coulmns.type'))
                    ->toggleable()
                    ->sortable()
                    ->searchable()
            );
        }
        else if(filament('account')->showTypeField){
            $colums->push(
                Tables\Columns\TextColumn::make('type')
                    ->label(trans('account::messages.accounts.coulmns.type'))
                    ->toggleable()
                    ->sortable()
                    ->searchable()
            );
        }

        //Use Teams
        if(filament('account')->useTeams){
            $colums->push(
                Tables\Columns\TextColumn::make('teams.name')
                    ->badge()
                    ->icon('heroicon-o-user-group')
                    ->label(trans('account::messages.accounts.coulmns.teams'))
                    ->toggleable()
                    ->searchable()
            );
        }

        //Default Columns
        $colums = $colums->merge([
            Tables\Columns\TextColumn::make('email')
                ->label(trans('account::messages.accounts.coulmns.email'))
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->searchable(),
            Tables\Columns\TextColumn::make('phone')
                ->label(trans('account::messages.accounts.coulmns.phone'))
                ->toggleable(isToggledHiddenByDefault: true)
                ->sortable()
                ->searchable()
        ]);

        //Can Login
        if(filament('account')->canLogin){
            $colums->push(
                Tables\Columns\IconColumn::make('is_login')
                    ->label(trans('account::messages.accounts.coulmns.is_login'))
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->sortable()
                    ->boolean()
            );
        }

        //Can Blocked
        if(filament('account')->canBlocked) {
            $colums->push(
                Tables\Columns\IconColumn::make('is_active')
                    ->label(trans('account::messages.accounts.coulmns.is_active'))
                    ->toggleable(isToggledHiddenByDefault: true)
                    ->sortable()
                    ->boolean()
            );
        }

        //Can Verified
        $colums = $colums->merge([
            Tables\Columns\TextColumn::make('deleted_at')
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
            Tables\Columns\TextColumn::make('created_at')
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
            Tables\Columns\TextColumn::make('updated_at')
                ->sortable()
                ->dateTime()
                ->sortable()
                ->toggleable(isToggledHiddenByDefault: true),
        ]);

        $actions = collect([]);
        if(filament('account')->useExport){
            $actions->push(ExportAccountsAction::make());
        }
        if(filament('account')->useImport){
            $actions->push(ImportAccountsAction::make());
        }
        return $table
            ->headerActions($actions->toArray())
            ->columns($colums->toArray())
            ->filters(config('account.accounts.filters') ? config('account.accounts.filters')::make() : AccountsFilters::make())
            ->actions(config('account.accounts.actions') ? config('account.accounts.actions')::make() : AccountsTableActions::make())
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
