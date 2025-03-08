<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Releations;

use Filament\Facades\Filament;
use App\Pos\Account\Facades\FilamentAccounts;

class AccountReleations
{
    public static function get(): array
    {
        $loadRelations = FilamentAccounts::loadRelations();

        $relations = [];

        if(config('account.features.meta')){
            $relations[] = \App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountMetaManager::make();
        }
        if(config('account.features.locations')){
            $relations[] = \App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountLocationsManager::make();
        }
        if(config('account.features.requests')){
            $relations[] = \App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountRequestsManager::make();
        }
        return array_merge($relations,$loadRelations);
    }
}
