<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Actions;

use Filament\Notifications\Notification;
use Filament\Tables;
use Filament\Actions;
use Filament\Forms;
use STS\FilamentImpersonate\Tables\Actions\Impersonate;
use App\Pos\Account\Facades\FilamentAccounts;
use App\Pos\Account\Models\Team;
use TomatoPHP\FilamentAlerts\Models\NotificationsTemplate;
use TomatoPHP\FilamentAlerts\Services\SendNotification;
use TomatoPHP\FilamentHelpers\Contracts\ActionsBuilder;
use TomatoPHP\FilamentIcons\Components\IconPicker;

class AccountsTableActions extends ActionsBuilder
{
    public function actions(): array
    {
        $actions = collect([]);

        //Impersonate
        if(class_exists(\STS\FilamentImpersonate\Tables\Actions\Impersonate::class) && filament('account')->canLogin && filament('account')->useImpersonate){
           $actions->push(AccountImpersonateAction::make());
        }

        //Change Password
        if(filament('account')->canLogin) {
            $actions->push(ChangePasswordAction::make());
        }

        //Teams
        if(filament('account')->useTeams) {
            $actions->push(AccountTeamsAction::make());
        }

        //Notifications
        if(filament('account')->useNotifications){
            $actions->push(AccountNotificationsAction::make());
        }


        //Merge Default Actions
        $actions = $actions->merge([
            Tables\Actions\EditAction::make()
                ->iconButton()
                ->tooltip(trans('account::messages.accounts.actions.edit')),
            Tables\Actions\DeleteAction::make()
                ->iconButton()
                ->tooltip(trans('account::messages.accounts.actions.delete')),
            Tables\Actions\ForceDeleteAction::make()
                ->iconButton()
                ->tooltip(trans('account::messages.accounts.actions.force_delete')),
            Tables\Actions\RestoreAction::make()
                ->iconButton()
                ->tooltip(trans('account::messages.accounts.actions.restore'))
        ]);

        //Merge Provider Actions
        $actions = $actions->merge(FilamentAccounts::loadActions());

        return $actions->toArray();
    }
}
