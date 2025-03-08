<?php

namespace App\Pos\Account\Facades;

use Illuminate\Support\Facades\Facade;

/**
 * @method static array getApiValidationCreate()
 * @method static array getApiValidationEdit()
 * @method static array getAttachedItems()
 * @const string LOGIN_BY_EMAIL
 * @const string LOGIN_BY_PHONE
 * @method void  registerAccountActions(array $actions)
 * @method void  registerAccountRelation(array $relations)
 * @method array loadRelations()
 * @method array loadActions()
 * @method static \App\Pos\Account\Services\FilamentAccountsServices make()
 */
class FilamentAccounts extends Facade
{
    public static function getFacadeAccessor(): string
    {
        return 'filament-accounts';
    }
}
