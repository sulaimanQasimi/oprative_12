<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Pages;

class AccountPagesList
{
    public static function routes(): array
    {
        return [
            'index' => \App\Pos\Account\Filament\Resources\AccountResource\Pages\ListAccounts::route('/'),
            'edit' => \App\Pos\Account\Filament\Resources\AccountResource\Pages\EditAccount::route('/{record}/edit'),
        ];
    }
}
