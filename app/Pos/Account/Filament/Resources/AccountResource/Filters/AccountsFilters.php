<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Filters;

use Filament\Tables;
use Filament\Forms;
use App\Pos\Account\Models\Team;
use TomatoPHP\FilamentHelpers\Contracts\FiltersBuilder;
use TomatoPHP\FilamentTypes\Models\Type;

class AccountsFilters extends FiltersBuilder
{
    public function filters(): array
    {
        $filters = [
            Tables\Filters\TrashedFilter::make(),
        ];

        if(filament('account')->useTypes){
            $filters[] = Tables\Filters\SelectFilter::make('type')
                ->label(trans('account::messages.accounts.filters.type'))
                ->searchable()
                ->preload()
                ->options(Type::query()->where('for', 'accounts')->where('type', 'type')->pluck('name', 'key')->toArray());
        }

        if(filament('account')->useTeams) {
            $filters[] = Tables\Filters\SelectFilter::make('teams')
                ->label(trans('account::messages.accounts.filters.teams'))
                ->searchable()
                ->preload()
                ->relationship('teams', 'name')
                ->options(Team::query()->pluck('name', 'id')->toArray());
        }

        if(filament('account')->canLogin) {
            $filters[] = Tables\Filters\TernaryFilter::make('is_login')
                ->label(trans('account::messages.accounts.filters.is_login'));
        }

        if(filament('account')->canBlocked) {
            $filters[] = Tables\Filters\TernaryFilter::make('is_active')
                ->label(trans('account::messages.accounts.filters.is_active'));
        }
        return $filters;
    }
}
