<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Actions;

use Filament\Tables\Actions\Action;
use Filament\Forms;
use Maatwebsite\Excel\Facades\Excel;
use App\Pos\Account\Export\ExportAccounts;

class ExportAccountsAction
{
    public static function make(): Action
    {
        return Action::make('export')
            ->label(trans('Export Accounts'))
            ->requiresConfirmation()
            ->color('info')
            ->icon('heroicon-o-arrow-down-on-square')
            ->fillForm([
                'columns' => [
                    'id' => trans('Id'),
                    'name' => trans('Name'),
                    'email' => trans('Email'),
                    'phone' => trans('Phone'),
                    'address' => trans('Address'),
                    'type' => trans('Type'),
                    'is_active' => trans('Is Active'),
                 ]
            ])
            ->form([
                Forms\Components\KeyValue::make('columns')
                    ->label(trans('Export Columns'))
                    ->required()
                    ->editableKeys(false)
                    ->addable(false)
            ])
            ->action(function (array $data){
                return Excel::download(new ExportAccounts($data), 'accounts.csv');
            });
    }
}
