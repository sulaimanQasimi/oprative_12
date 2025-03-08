<?php

return [
    /*
    * Features of Tomato CRM
    *
    * accounts: Enable/Disable Accounts Feature
    */
    "features" => [
        "accounts" => true,
        "meta" => true,
        "locations" => true,
        "contacts" => true,
        "requests" => true,
        "notifications" => true,
        "loginBy" => true,
        "avatar" => true,
        "types" => false,
        "teams" => false,
        "apis" => true,
        "send_otp" => true,
        "impersonate" => [
            'active'=> false,
            'redirect' => '/app',
        ],
    ],

    /*
     * Accounts Configurations
     *
     * resource: User Resource Class
     */
    "resource" => null,

    /*
     * Accounts Configurations
     *
     * login_by: Login By Phone or Email
     */
    "login_by" => "email",

    /*
     * Accounts Configurations
     *
     * required_otp: Enable/Disable OTP Verification
     */
    "required_otp" => true,

    /*
     * Accounts Configurations
     *
     * model: User Model Class
     */
    "model" => \App\Pos\Account\Models\Account::class,

    /*
     * Accounts Configurations
     *
     * guard: Auth Guard
     */
    "guard" => "accounts",


    "teams" => [
        "allowed" => false,
        "model" => \App\Pos\Account\Models\Team::class,
        "invitation" => \App\Pos\Account\Models\TeamInvitation::class,
        "membership" => \App\Pos\Account\Models\Membership::class,
        "resource" => \App\Pos\Account\Filament\Resources\TeamResource::class,
    ],

    /**
     * Accounts Relations Managers
     *
     * you can set selected relations to show in account resource
     */
    "relations" => \App\Pos\Account\Filament\Resources\AccountResource\Releations\AccountReleations::class,
    

    /**
     * Accounts Resource Builder
     *
     * you can change the form, table, actions and filters of account resource by using filament-helpers class commands
     *
     * link: https://github.com/tomatophp/filament-helpers
     */
    "accounts" => [
        "form" => \App\Pos\Account\Filament\Resources\AccountResource\Forms\AccountsForm::class,
        "table" => \App\Pos\Account\Filament\Resources\AccountResource\Tables\AccountsTable::class,
        "actions" => \App\Pos\Account\Filament\Resources\AccountResource\Actions\AccountsTableActions::class,
        "filters" => \App\Pos\Account\Filament\Resources\AccountResource\Filters\AccountsFilters::class,
        "pages" => \App\Pos\Account\Filament\Resources\AccountResource\Pages\AccountPagesList::class,
    ]
];
