<?php

namespace App\Pos\Account\Filament\Pages;

use Filament\Pages\Page;
use Illuminate\Contracts\Support\Htmlable;

class ApiTokens extends Page
{
    protected static ?string $navigationIcon = 'heroicon-o-key';

    protected static string $view = 'account::teams.api-tokens';

    public static function getNavigationLabel(): string
    {
        return trans('account::messages.profile.token.title');
    }

    public function getTitle(): string|Htmlable
    {
        return trans('account::messages.profile.token.title');
    }

    /**
     * @return bool
     */
    public static function isShouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function shouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function getNavigationSort(): ?int
    {
        return 1;
    }
}
