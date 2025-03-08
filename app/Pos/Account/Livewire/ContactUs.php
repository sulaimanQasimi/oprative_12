<?php

namespace App\Pos\Account\Livewire;

use Filament\Actions\Action;
use Filament\Actions\Concerns\InteractsWithActions;
use Filament\Actions\Contracts\HasActions;
use Filament\Forms\Components\Grid;
use Filament\Forms\Components\Textarea;
use Filament\Forms\Components\TextInput;
use Filament\Forms\Concerns\InteractsWithForms;
use Filament\Forms\Contracts\HasForms;
use Filament\Notifications\Notification;
use Illuminate\Contracts\View\View;
use Livewire\Component;
use App\Pos\Account\Models\Contact;

class ContactUs extends Component implements HasForms,HasActions
{
    use InteractsWithActions;
    use InteractsWithForms;

    public function render(): View
    {
        return view('account::livewire.contact-us');
    }

    public function getContactUsAction(): Action
    {
        return Action::make('getContactUsAction')
            ->link()
            ->modalHeading(trans('account::messages.contact-us.modal'))
            ->form([
                Grid::make([
                    "md" => 2,
                    "sm" => 1
                ])->schema([
                    TextInput::make('name')
                        ->label(trans('account::messages.contact-us.form.name'))
                        ->autofocus()
                        ->required()
                        ->columnSpan(2),
                    TextInput::make('email')
                        ->label(trans('account::messages.contact-us.form.email'))
                        ->email()
                        ->required(),
                    TextInput::make('phone')
                        ->label(trans('account::messages.contact-us.form.phone'))
                        ->tel()
                        ->required(),
                    TextInput::make('subject')
                        ->label(trans('account::messages.contact-us.form.subject'))
                        ->required()
                        ->columnSpan(2),
                    Textarea::make('message')
                        ->label(trans('account::messages.contact-us.form.message'))
                        ->autosize()
                        ->required()
                        ->columnSpan(2),
                ])
            ])
            ->label(trans('account::messages.contact-us.label'))
            ->action(function(array $data){
                // Send email to admin
                Contact::query()->create($data);

                Notification::make()
                    ->title(trans('account::messages.contact-us.notification.title'))
                    ->body(trans('account::messages.contact-us.notification.body'))
                    ->success()
                    ->send();
            });
    }
}
