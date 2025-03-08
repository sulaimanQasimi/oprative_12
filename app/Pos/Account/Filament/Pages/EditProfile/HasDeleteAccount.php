<?php

namespace App\Pos\Account\Filament\Pages\EditProfile;

use Filament\Forms\Form;
use App\Pos\Account\Forms\DeleteAccountForm;

trait HasDeleteAccount
{
    public function deleteAccountForm(Form $form): Form
    {
        return $form
            ->schema(DeleteAccountForm::get())
            ->model($this->getUser())
            ->statePath('deleteAccountData');
    }
}
