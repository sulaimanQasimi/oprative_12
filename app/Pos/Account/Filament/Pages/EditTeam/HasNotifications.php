<?php

namespace App\Pos\Account\Filament\Pages\EditTeam;

use Filament\Facades\Filament;
use Filament\Notifications\Notification;

trait HasNotifications
{
    private function sendSuccessNotification()
    {
        Notification::make()
            ->success()
            ->title(trans('account::messages.saved_successfully'))
            ->send();

        $this->editTeamForm->fill(Filament::getTenant()->toArray());
        $this->deleteTeamFrom->fill(Filament::getTenant()->toArray());
        $this->manageTeamMembersForm->fill([]);
    }
}
