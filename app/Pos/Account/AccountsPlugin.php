<?php

namespace App\Pos\Account;

use Filament\Contracts\Plugin;
use Filament\Panel;
use Illuminate\Support\Facades\Config;
use Nwidart\Modules\Module;
use App\Pos\Account\Filament\Resources\AccountRequestResource;
use App\Pos\Account\Filament\Resources\AccountResource;
use App\Pos\Account\Filament\Resources\ContactResource;
use App\Pos\Account\Filament\Resources\TeamResource;
use TomatoPHP\FilamentPlugins\Facades\FilamentPlugins;

class AccountsPlugin implements Plugin
{
    public bool $useTeams = false;
    public bool $useContactUs = false;
    public bool $useRequests = false;
    public bool $useLocations = false;
    public bool $useAccountMeta = false;
    public bool $useNotifications = false;
    public bool $useTypes = false;
    public bool $useLoginBy = false;
    public bool $useAvatar = false;
    public bool $useExport = false;
    public bool $useImport = false;
    public bool $showAddressField = false;
    public bool $showTypeField = false;
    public bool $canLogin = false;
    public bool $canBlocked = false;
    public bool $useImpersonate = false;
    public bool $useAPIs = false;
    public ?string $impersonateRedirect = '/app';

    private bool $isActive = false;

    public function getId(): string
    {
        return 'account';
    }

    public function register(Panel $panel): void
    {
        // if(class_exists(Module::class) && \Nwidart\Modules\Facades\Module::find('FilamentAccounts')?->isEnabled()){
        //     $this->isActive = true;
        // }
        // else {
        //     $this->isActive = true;
        // }

        // if($this->isActive){
            $resources = [
                AccountResource::class
            ];

            // if($this->useRequests){
            //     $resources[] = AccountRequestResource::class;
            // }

            // if($this->useContactUs){
            //     $resources[] = ContactResource::class;
            // }

            // if($this->useTeams){
            //     $resources[] = TeamResource::class;
            // }

            // if($this->useTypes){
            //     $panel->pages([
            //         AccountResource\Pages\AccountTypes::class,
            //         ContactResource\Pages\ContactStatusTypes::class,
            //         AccountRequestResource\Pages\RequestsStatus::class,
            //         AccountRequestResource\Pages\RequestsTypes::class
            //     ]);
            // }

            $panel->resources($resources);
        // }
    }

    public function useExport(bool $useExport = true): static
    {
        $this->useExport = $useExport;
        return $this;
    }

    public function useImport(bool $useImport = true): static
    {
        $this->useImport = $useImport;
        return $this;
    }

    public function useTeams(bool $useTeams = true): static
    {
        $this->useTeams = $useTeams;
        return $this;
    }

    public function useContactUs(bool $useContactUs = true): static
    {
        $this->useContactUs = $useContactUs;
        return $this;
    }

    public function useRequests(bool $useRequests = true): static
    {
        $this->useRequests = $useRequests;
        return $this;
    }

    public function useLocations(bool $useLocations = true): static
    {
        $this->useLocations = $useLocations;
        return $this;
    }

    public function useAccountMeta(bool $useAccountMeta = true): static
    {
        $this->useAccountMeta = $useAccountMeta;
        return $this;
    }

    public function useNotifications(bool $useNotifications = true): static
    {
        $this->useNotifications = $useNotifications;
        return $this;
    }

    public function useTypes(bool $useTypes = true): static
    {
        $this->useTypes = $useTypes;
        return $this;
    }

    public function useAvatar(bool $useAvatar = true): static
    {
        $this->useAvatar = $useAvatar;
        return $this;
    }

    public function useLoginBy(bool $useLoginBy = true): static
    {
        $this->useLoginBy = $useLoginBy;
        return $this;
    }

    public function showAddressField(bool $showAddressField = true): static
    {
        $this->showAddressField = $showAddressField;
        return $this;
    }

    public function canLogin(bool $canLogin = true): static
    {
        $this->canLogin = $canLogin;
        return $this;
    }

    public function canBlocked(bool $canBlocked = true): static
    {
        $this->canBlocked = $canBlocked;
        return $this;
    }

    public function useImpersonate(bool $useImpersonate = true): static
    {
        $this->useImpersonate = $useImpersonate;
        return $this;
    }

    public function impersonateRedirect(?string $impersonateRedirect): static
    {
        $this->impersonateRedirect = $impersonateRedirect;
        return $this;
    }

    public function useAPIs(bool $useAPIs = true): static
    {
        $this->useAPIs = $useAPIs;
        return $this;
    }

    public function showTypeField(bool $showTypeField = true): static
    {
        $this->showTypeField = $showTypeField;
        return $this;
    }



    public function boot(Panel $panel): void
    {
        if($this->isActive){
            Config::set('account.features.locations', $this->useLocations);
            Config::set('account.features.meta', $this->useAccountMeta);
            Config::set('account.features.requests', $this->useRequests);
            Config::set('account.features.contacts', $this->useContactUs);
            Config::set('account.features.notifications', $this->useNotifications);
            Config::set('account.features.loginBy', $this->useLoginBy);
            Config::set('account.features.types', $this->useTypes);
            Config::set('account.features.avatar', $this->useAvatar);
            Config::set('account.features.apis', $this->useAPIs);
            Config::set('account.features.impersonate.active', $this->useImpersonate);
            Config::set('account.features.impersonate.redirect', $this->impersonateRedirect);
        }

    }

    public static function make(): static
    {
        return new static();
    }
}
