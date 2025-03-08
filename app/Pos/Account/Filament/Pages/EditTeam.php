<?php

namespace App\Pos\Account\Filament\Pages;

use App\Models\Team;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Facades\Filament;
use Filament\Forms\Components\Actions\Action;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\Select;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Form;
use Filament\Notifications\Notification;
use Filament\Pages\Tenancy\EditTenantProfile;
use Filament\Support\Exceptions\Halt;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\HtmlString;
use Laravel\Jetstream\Contracts\AddsTeamMembers;
use Laravel\Jetstream\Contracts\InvitesTeamMembers;
use Laravel\Jetstream\Events\InvitingTeamMember;
use Laravel\Jetstream\Events\TeamMemberRemoved;
use Laravel\Jetstream\Events\TeamMemberUpdated;
use Laravel\Jetstream\Features;
use Laravel\Jetstream\Jetstream;
use Laravel\Jetstream\Mail\TeamInvitation;
use Laravel\Jetstream\Role;
use App\Pos\Account\Filament\Pages\EditTeam\HasCancelTeamInvitation;
use App\Pos\Account\Filament\Pages\EditTeam\HasDeleteTeam;
use App\Pos\Account\Filament\Pages\EditTeam\HasEditTeam;
use App\Pos\Account\Filament\Pages\EditTeam\HasLeavingTeam;
use App\Pos\Account\Filament\Pages\EditTeam\HasManageRoles;
use App\Pos\Account\Filament\Pages\EditTeam\HasManageTeamMembers;
use App\Pos\Account\Filament\Pages\EditTeam\HasNotifications;
use App\Pos\Account\Filament\Pages\EditTeam\HasTeamInvitation;
use App\Pos\Account\Forms\DeleteTeamForm;
use App\Pos\Account\Forms\ManageTeamMembersForm;
use App\Pos\Account\Forms\MembersListForm;
use App\Pos\Account\Forms\UpdateTeamForm;

class EditTeam extends EditTenantProfile
{
    use HasEditTeam;
    use HasDeleteTeam;
    use HasManageRoles;
    use HasManageTeamMembers;
    use HasTeamInvitation;
    use HasCancelTeamInvitation;
    use HasLeavingTeam;
    use HasNotifications;

    protected static string $view = 'account::teams.edit-team';

    /**
     * @return bool
     */
    public static function isShouldRegisterNavigation(): bool
    {
        return false;
    }

    public static function getLabel(): string
    {
        return trans('account::messages.teams.title');
    }

    public ?array $deleteTeamData = [];
    public ?array $editTeamData = [];
    public ?array $manageTeamMembersData = [];

    public function mount(): void
    {
        $this->fillForms();
    }

    protected function getForms(): array
    {
        return [
            'editTeamForm',
            'deleteTeamFrom',
            'manageTeamMembersForm',
        ];
    }

    protected function fillForms(): void
    {
        $data = Filament::getTenant();

        $this->editTeamForm->fill($data->toArray());
        $this->deleteTeamFrom->fill($data->toArray());
        $this->manageTeamMembersForm->fill($data->toArray());
    }

    protected function getViewData(): array
    {
        return [
            'team' => Filament::getTenant(),
        ];
    }
}
