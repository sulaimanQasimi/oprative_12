<?php

namespace App\Pos\Account\Filament\Pages\EditTeam;

use Filament\Facades\Filament;
use Filament\Forms\Form;
use App\Pos\Account\Forms\DeleteTeamForm;

trait HasDeleteTeam
{
    public function deleteTeamFrom(Form $form): Form
    {
        return $form
            ->schema(DeleteTeamForm::get(Filament::getTenant()))
            ->model(Filament::getTenant())
            ->statePath('deleteTeamData');
    }
}
