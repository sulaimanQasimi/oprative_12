<?php

namespace App\Pos\Account\Filament\Resources\AccountResource\Forms;

use Filament\Forms\Form;
use Filament\Forms;
use TomatoPHP\FilamentHelpers\Contracts\FormBuilder;
use TomatoPHP\FilamentTypes\Models\Type;

class AccountsForm extends FormBuilder
{
    public function form(Form $form): Form
    {
        $components = collect([
            Forms\Components\SpatieMediaLibraryFileUpload::make('avatar')
                ->alignCenter()
                ->collection('avatar')
                ->avatar()
                ->columnSpan(2)
                ->hiddenLabel()
                ->label("Avatar")
                ->translateLabel(),

            Forms\Components\TextInput::make('name')
                ->label("Name")
                ->columnSpan(2)
                ->required()
                ->maxLength(255)
                ->translateLabel(),

            Forms\Components\TextInput::make('email')
                ->label("Email")
                ->required(fn(Forms\Get $get) => $get('loginBy') === 'email')
                ->email()
                ->maxLength(255),

            Forms\Components\TextInput::make('phone')
                ->label("Phone")
                ->required(fn(Forms\Get $get) => $get('loginBy') === 'phone')
                ->tel()
                ->maxLength(255)
                ->translateLabel(),

            Forms\Components\Textarea::make('address')
                ->label("Address")
                ->columnSpanFull()
                ->translateLabel(),
            Forms\Components\Select::make('type')
                ->label("Type")
                ->searchable()
                ->required()
                ->options(Type::query()->where('for', 'accounts')->where('type', 'type')->pluck('name', 'key')->toArray())
                ->default('account')
                ->translateLabel(),
            Forms\Components\TextInput::make('type')
                ->label("Type")
                ->required()
                ->default('account')
                ->translateLabel(),
            Forms\Components\Select::make('loginBy')
                ->label("Login By")
                ->searchable()
                ->options([
                    'email' => trans('Email'),
                    'phone' => trans('Phone'),
                ])
                ->required()
                ->default('email')
                ->translateLabel(),
            Forms\Components\Toggle::make('is_active')
                ->columnSpan(2)
                ->label("Is Active")
                ->default(false)
                ->required()
                ->translateLabel(),
            Forms\Components\Toggle::make('is_login')->default(false)
                ->columnSpan(2)
                ->label("Is Login")
                ->live()
                ->translateLabel(),
            Forms\Components\TextInput::make('password')
                ->label("Password")
                ->confirmed()
                ->hidden(fn(Forms\Get $get) => !$get('is_login') || $get('id') !== null)
                ->password()
                ->maxLength(255)
                ->translateLabel(),
            Forms\Components\TextInput::make('password_confirmation')
                ->label("Password Confirmation")
                ->hidden(fn(Forms\Get $get) => !$get('is_login') || $get('id') !== null)
                ->password()
                ->maxLength(255)
                ->translateLabel(),

        ]);
        return
            $form->schema([$components->toArray()]);
    }
}
