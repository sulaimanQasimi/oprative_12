<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Actions;

use Filament\Notifications\Notification;
use Filament\Tables\Actions\Action;
use Filament\Forms;
use Maatwebsite\Excel\Facades\Excel;
use App\Pos\Account\Import\ImportAccounts;

class ImportAccountsAction
{
     public static function make(): Action
     {
         return Action::make('import')
             ->label(trans('account::messages.accounts.import.title'))
             ->form([
                Forms\Components\FileUpload::make('excel')
                    ->hint(trans('account::messages.accounts.import.hint'))
                    ->label(trans('account::messages.accounts.import.excel'))
                    ->acceptedFileTypes(['text/csv', 'application/vnd.ms-excel'])
                    ->required()
             ])
             ->action(function (array $data){
                 try {
                     Excel::import(new ImportAccounts(), storage_path('app/public/' . $data['excel']));


                     Notification::make()
                         ->title(trans('account::messages.accounts.import.success'))
                         ->body(trans('account::messages.accounts.import.body'))
                         ->success()
                         ->send();
                 }catch (\Exception $e) {
                     Notification::make()
                         ->title(trans('account::messages.accounts.import.error'))
                         ->body(trans('account::messages.accounts.import.error-body'))
                         ->danger()
                         ->send();
                 }

             })
             ->color('warning')
             ->icon('heroicon-o-arrow-up-on-square');
     }
}
