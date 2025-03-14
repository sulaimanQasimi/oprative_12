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
             ->label(trans('Export Account'))
             ->form([
                Forms\Components\FileUpload::make('excel')
                    ->hint(trans('hint'))
                    ->label(trans('excel'))
                    ->acceptedFileTypes(['text/csv', 'application/vnd.ms-excel'])
                    ->required()
             ])
             ->action(function (array $data){
                 try {
                     Excel::import(new ImportAccounts(), storage_path('app/public/' . $data['excel']));


                     Notification::make()
                         ->title(trans('success'))
                         ->body(trans('body'))
                         ->success()
                         ->send();
                 }catch (\Exception $e) {
                     Notification::make()
                         ->title(trans('error'))
                         ->body(trans('error-body'))
                         ->danger()
                         ->send();
                 }

             })
             ->color('warning')
             ->icon('heroicon-o-arrow-up-on-square');
     }
}
