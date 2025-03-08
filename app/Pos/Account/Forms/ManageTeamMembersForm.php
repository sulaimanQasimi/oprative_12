<?php

namespace App\Pos\Account\Forms;

use Filament\Forms;
use Filament\Forms\Components\Actions;
use Filament\Forms\Components\Section;
use Filament\Forms\Components\SpatieMediaLibraryFileUpload;
use Filament\Forms\Components\TextInput;
use Filament\Notifications\Notification;
use Illuminate\Database\Query\Builder;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use Laravel\Jetstream\Jetstream;
use Laravel\Jetstream\Role;

class ManageTeamMembersForm
{
    public static function get($team): array
    {
        return [
            Forms\Components\ViewField::make('manageTeamMembers')
                ->label(trans('account::messages.teams.members.title'))
                ->hiddenLabel()
                ->view('account::forms.components.team-members', ['team' => $team]),
            TextInput::make('email')->label('Email')
                ->label(trans('account::messages.teams.members.email'))
                ->rules([
                    'required',
                    'email',
                    'not_in:' . $team->owner->email,
                    Rule::unique('team_invitations', 'email')
                        ->where(function (Builder $query) use ($team) {
                            $query->where('team_id', $team->id);
                        }),
                ])
                ->validationMessages([
                    'email.not_in' => trans('account::messages.teams.members.not_in'),
                    'email.required' => trans('account::messages.teams.members.required'),
                    'email.unique' =>  trans('account::messages.teams.members.unique'),
                ])
                ->disabled(fn() => auth('accounts')->user()->id !== $team->account_id),
            Forms\Components\Select::make('role')
                ->label(trans('account::messages.teams.members.role'))
                ->searchable()
                ->preload()
                ->options(function (){
                    $roles = collect(Jetstream::$roles)->transform(function ($role) {
                        return (new Role(
                            $role->key,
                            $role->name,
                            $role->permissions
                        ))->description($role->description);
                    })->values();
                    return $roles->pluck('name', 'key');
                })
                ->rules(Jetstream::hasRoles()
                    ? ['required', 'string', new \Laravel\Jetstream\Rules\Role]
                    : null,)
                ->validationMessages([
                    'role.required' => trans('account::messages.teams.members.role_required'),
                ])
                ->disabled(fn() => auth('accounts')->user()->id !== $team->account_id)
        ];
    }

    public static function sendErrorDeleteAccount(string $message): void
    {
        Notification::make()
            ->danger()
            ->title($message)
            ->send();
    }
}
