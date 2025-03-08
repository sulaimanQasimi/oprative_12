<?php

namespace App\Pos\Account;

use Filament\Events\Auth\Registered;
use Filament\Events\TenantSet;
use Illuminate\Support\Facades\Event;
use Illuminate\Support\ServiceProvider;
use Laravel\Fortify\Fortify;
use Laravel\Jetstream\Jetstream;
use Livewire\Livewire;
use App\Pos\Account\Events\SendOTP;
use App\Pos\Account\Listeners\CreatePersonalTeam;
use App\Pos\Account\Listeners\SwitchTeam;
use App\Pos\Account\Livewire\ContactUs;
use App\Pos\Account\Livewire\Otp;
use App\Pos\Account\Livewire\SanctumTokens;
use App\Pos\Account\Models\Membership;
use App\Pos\Account\Models\Team;
use App\Pos\Account\Models\TeamInvitation;
use TomatoPHP\FilamentAlerts\Services\SendNotification;
use TomatoPHP\FilamentPlugins\Facades\FilamentPlugins;
use TomatoPHP\FilamentTypes\Facades\FilamentTypes;


class AccountsServiceProvider extends ServiceProvider
{
    public function register(): void
    {
        //Register generate command
        $this->commands([
            \App\Pos\Account\Console\FilamentAccountsInstall::class,
        ]);

        //Register Config file
        $this->mergeConfigFrom(__DIR__ . '/../config/account.php', 'account');

        //Publish Config
        $this->publishes([
            __DIR__ . '/../config/account.php' => config_path('account.php'),
        ], 'account-config');

        //Register Migrations
        $this->loadMigrationsFrom(__DIR__ . '/../database/migrations');

        //Publish Migrations
        $this->publishes([
            __DIR__ . '/../database/migrations' => database_path('migrations'),
        ], 'account-migrations');
        //Register views
        $this->loadViewsFrom(__DIR__ . '/../resources/views', 'account');

        //Publish Views
        $this->publishes([
            __DIR__ . '/../resources/views' => resource_path('views/vendor/account'),
        ], 'account-views');

        //Register Langs
        $this->loadTranslationsFrom(__DIR__ . '/../resources/lang', 'account');

        //Publish Lang
        $this->publishes([
            __DIR__ . '/../resources/lang' => base_path('lang/vendor/account'),
        ], 'account-lang');

        //Register Routes
        $this->loadRoutesFrom(__DIR__ . '/../routes/web.php');
        $this->loadRoutesFrom(__DIR__ . '/../routes/api.php');

        $this->publishes([
            __DIR__ . '/../publish/Account.php' => app_path('Models/Account.php'),
        ], 'account-model');

        $this->publishes([
            __DIR__ . '/../publish/migrations/create_teams_table.php' => database_path('migrations/' .  date('Y_m_d_His', ((int)time()) + 1) . '_create_teams_table.php'),
            __DIR__ . '/../publish/migrations/create_team_invitations_table.php' => database_path('migrations/' .  date('Y_m_d_His', ((int)time()) + 2) . '_create_team_invitations_table.php'),
            __DIR__ . '/../publish/migrations/create_team_user_table.php' => database_path('migrations/' .  date('Y_m_d_His', ((int)time()) + 3) . '_create_team_user_table.php'),
        ], 'account-teams-migrations');

        $this->publishes([
            __DIR__ . '/../publish/Team.php' => app_path('Models/Team.php'),
            __DIR__ . '/../publish/TeamInvitation.php' => app_path('Models/TeamInvitation.php'),
            __DIR__ . '/../publish/Membership.php' => app_path('Models/Membership.php'),
        ], 'account-teams');


        $this->app->bind('account', function () {
            return new \App\Pos\Account\Services\FilamentAccountsServices();
        });

        $this->app->bind('account-auth', function () {
            return new \App\Pos\Account\Services\BuildAuth();
        });


        Livewire::component('sanctum-tokens', SanctumTokens::class);
        Livewire::component('otp', Otp::class);
        Livewire::component(\App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountMetaManager::class);
        Livewire::component(\App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountLocationsManager::class);
        Livewire::component(\App\Pos\Account\Filament\Resources\AccountResource\RelationManagers\AccountRequestsManager::class);
        Livewire::component('tomato-contact-us-form', ContactUs::class);
    }

    public function boot(): void
    {
        if (config('account.features.types')) {
            FilamentTypes::register([
                'types',
                'groups'
            ], 'accounts');

            FilamentTypes::register([
                'status',
                'type',
            ], 'contacts');
        }
    }
}
