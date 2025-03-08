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
            ->label(trans('account::messages.accounts.export.title'))
            ->requiresConfirmation()
            ->color('info')
            ->icon('heroicon-o-arrow-down-on-square')
            ->fillForm([
                'columns' => [
                    'id' => trans('account::messages.accounts.coulmns.id'),
                    'name' => trans('account::messages.accounts.coulmns.name'),
                    'email' => trans('account::messages.accounts.coulmns.email'),
                    'phone' => trans('account::messages.accounts.coulmns.phone'),
                    'address' => trans('account::messages.accounts.coulmns.address'),
                    'type' => trans('account::messages.accounts.coulmns.type'),
                    'is_login' => trans('account::messages.accounts.coulmns.is_login'),
                    'is_active' => trans('account::messages.accounts.coulmns.is_active'),
                    'created_at' => trans('account::messages.accounts.coulmns.created_at'),
                    'updated_at' => trans('account::messages.accounts.coulmns.updated_at'),
                ]
            ])
            ->form([
                Forms\Components\KeyValue::make('columns')
                    ->label(trans('account::messages.accounts.export.columns'))
                    ->required()
                    ->editableKeys(false)
                    ->addable(false)
            ])
            ->action(function (array $data){
                return Excel::download(new ExportAccounts($data), 'accounts.csv');
            });
    }
}
