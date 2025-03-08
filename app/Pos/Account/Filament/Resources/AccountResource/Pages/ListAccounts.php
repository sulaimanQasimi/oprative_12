<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Pages;

use Filament\Resources\Pages\ManageRecords;
use App\Pos\Account\Filament\Resources\AccountResource;
use Filament\Actions;
use Filament\Resources\Pages\ListRecords;
use App\Pos\Account\Models\Account;

class ListAccounts extends ManageRecords
{
    protected static string $resource = AccountResource::class;

    protected function getHeaderActions(): array
    {
        $actions = [
            Actions\CreateAction::make()
                ->using(function (array $data) {
                    if (isset($data['password'])) {
                        $data['password'] = bcrypt($data['password']);
                    }
                    if (isset($data['loginBy']) && $data['loginBy'] === 'email') {
                        $data['username'] = $data['email'];
                    } else if (isset($data['loginBy']) && $data['loginBy'] === 'phone') {
                        $data['username'] = $data['phone'];
                    } else {
                        $data['username'] = $data['email'];
                    }

                    return config('account.model')::query()->create($data);
                }),
        ];

        $actions[] = Actions\Action::make('types')
            ->icon('heroicon-s-cog')
            ->tooltip('Accounts Types')
            ->label('Accounts Types')
            ->hiddenLabel()
            ->url(AccountTypes::getUrl());

        return $actions;
    }
}
