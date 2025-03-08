<?php

namespace App\Pos\Account\Filament\Pages\EditProfile;

use Filament\Forms\Form;
use App\Pos\Account\Forms\BrowserSessionsForm;

trait HasBrowserSessions
{
    public function browserSessionsForm(Form $form): Form
    {
        return $form
            ->schema(BrowserSessionsForm::get());
    }
}
