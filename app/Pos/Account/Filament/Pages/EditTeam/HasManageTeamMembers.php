<?php

namespace App\Pos\Account\Filament\Pages\EditTeam;

use Filament\Facades\Filament;
use Filament\Forms\Components\Section;
use Filament\Forms\Form;
use App\Pos\Account\Forms\ManageTeamMembersForm;

trait HasManageTeamMembers
{
    public function manageTeamMembersForm(Form $form): Form
    {
        return $form->schema([
            Section::make(trans('account::messages.teams.members.title'))
                ->description(trans('account::messages.teams.members.description'))
                ->schema(ManageTeamMembersForm::get(Filament::getTenant()))
        ])
            ->model(Filament::getTenant())
            ->statePath('manageTeamMembersData');
    }
}
