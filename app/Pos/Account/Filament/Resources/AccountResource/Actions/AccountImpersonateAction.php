<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Actions;

use Filament\Tables\Actions\Action;
use STS\FilamentImpersonate\Tables\Actions\Impersonate;

class AccountImpersonateAction
{
    public static function make(): Action
    {
        return Impersonate::make('impersonate')
            ->guard('accounts')
            ->color('info')
            ->tooltip(trans('account::messages.accounts.actions.impersonate'))
            ->redirectTo( config('account.features.impersonate.redirect'));
    }
}
