<?php

namespace App\Pos\Account\Forms;

use Filament\Forms;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;

class EditPasswordForm
{
    public static function get(): array
    {
        return [
            Forms\Components\Section::make(trans('account::messages.profile.password.title'))
                ->description(trans('account::messages.profile.password.description'))
                ->schema([
                    Forms\Components\TextInput::make('Current password')
                        ->label(trans('account::messages.profile.password.current_password'))
                        ->password()
                        ->required()
                        ->currentPassword()
                        ->revealable(),
                    Forms\Components\TextInput::make('password')
                        ->label(trans('account::messages.profile.password.new_password'))
                        ->password()
                        ->required()
                        ->rule(Password::default())
                        ->autocomplete('new-password')
                        ->dehydrateStateUsing(fn ($state): string => Hash::make($state))
                        ->live(debounce: 500)
                        ->same('passwordConfirmation')
                        ->revealable(),
                    Forms\Components\TextInput::make('passwordConfirmation')
                        ->label(trans('account::messages.profile.password.confirm_password'))
                        ->password()
                        ->required()
                        ->dehydrated(false)
                        ->revealable(),
                ]),
        ];
    }
}
