<?php

namespace App\Pos\Account\Forms;

use Filament\Forms;

class EditProfileForm
{
    public static function get(): array
    {
        return [
            Forms\Components\Section::make(trans('account::messages.profile.edit.title'))
                ->description(trans('account::messages.profile.edit.description'))
                ->schema([
                    Forms\Components\SpatieMediaLibraryFileUpload::make('avatar')
                        ->avatar()
                        ->circleCropper()
                        ->collection('avatar')
                        ->columnSpan(2)
                        ->label(trans('account::messages.accounts.coulmns.avatar')),
                    Forms\Components\TextInput::make('name')
                        ->columnSpan(2)
                        ->label(trans('account::messages.profile.edit.name'))
                        ->required(),
                    Forms\Components\TextInput::make('email')
                        ->columnSpan(2)
                        ->label(trans('account::messages.profile.edit.email'))
                        ->email()
                        ->required()
                        ->unique(ignoreRecord: true),
                ]),
        ];
    }
}
