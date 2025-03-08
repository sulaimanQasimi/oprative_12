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
        $components = collect([]);

        if(filament('account')->useAvatar) {
            $components->push(
                Forms\Components\SpatieMediaLibraryFileUpload::make('avatar')
                    ->alignCenter()
                    ->collection('avatar')
                    ->avatar()
                    ->columnSpan(2)
                    ->hiddenLabel()
                    ->label(trans('account::messages.accounts.coulmns.avatar'))
            );
        }

        $components->push(
            Forms\Components\TextInput::make('name')
                ->label(trans('account::messages.accounts.coulmns.name'))
                ->columnSpan(2)
                ->required()
                ->maxLength(255),
            Forms\Components\TextInput::make('email')
                ->label(trans('account::messages.accounts.coulmns.email'))
                ->required(fn(Forms\Get $get) => $get('loginBy') === 'email')
                ->email()
                ->maxLength(255),
            Forms\Components\TextInput::make('phone')
                ->label(trans('account::messages.accounts.coulmns.phone'))
                ->required(fn(Forms\Get $get) => $get('loginBy') === 'phone')
                ->tel()
                ->maxLength(255)
        );

        if(filament('account')->showAddressField) {
            $components->push(
                Forms\Components\Textarea::make('address')
                    ->label(trans('account::messages.accounts.coulmns.address'))
                    ->columnSpanFull()
            );
        }
        if(filament('account')->useTypes) {
            $components->push(
                Forms\Components\Select::make('type')
                    ->label(trans('account::messages.accounts.coulmns.type'))
                    ->searchable()
                    ->required()
                    ->options(Type::query()->where('for', 'accounts')->where('type', 'type')->pluck('name', 'key')->toArray())
                    ->default('account')
            );
        }
        else if(filament('account')->showTypeField) {
            $components->push(
                Forms\Components\TextInput::make('type')
                    ->label(trans('account::messages.accounts.coulmns.type'))
                    ->required()
                    ->default('account')
            );
        }
        if(filament('account')->useLoginBy) {
            $components->push(
                Forms\Components\Select::make('loginBy')
                    ->label(trans('account::messages.accounts.coulmns.loginBy'))
                    ->searchable()
                    ->options([
                        'email' => trans('account::messages.accounts.coulmns.email'),
                        'phone' => trans('account::messages.accounts.coulmns.phone')
                    ])
                    ->required()
                    ->default('email')
            );
        }
        if(filament('account')->canBlocked) {
            $components->push(
                Forms\Components\Toggle::make('is_active')
                    ->columnSpan(2)
                    ->label(trans('account::messages.accounts.coulmns.is_active'))
                    ->default(false)
                    ->required()
            );
        }
        if(filament('account')->canLogin) {
            $components = $components->merge([
                Forms\Components\Toggle::make('is_login')->default(false)
                    ->columnSpan(2)
                    ->label(trans('account::messages.accounts.coulmns.is_login'))
                    ->live(),
                Forms\Components\TextInput::make('password')
                    ->label(trans('account::messages.accounts.coulmns.password'))
                    ->confirmed()
                    ->hidden(fn(Forms\Get $get) => !$get('is_login') || $get('id') !== null)
                    ->password()
                    ->maxLength(255),
                Forms\Components\TextInput::make('password_confirmation')
                    ->label(trans('account::messages.accounts.coulmns.password_confirmation'))
                    ->hidden(fn(Forms\Get $get) => !$get('is_login') || $get('id') !== null)
                    ->password()
                    ->maxLength(255),
            ]);
        }

        return $form->schema($components->toArray());
    }
}
