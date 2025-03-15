<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;
use Filament\Notifications\Notification;

class EditSale extends EditRecord
{
    protected static string $resource = SaleResource::class;

    public function getTitle(): string
    {
        return __('Purchase Payments');
    }

    public static function getNavigationLabel(): string
    {
        return __('Purchase Payments');
    }

    public function mount($record): void
    {
        parent::mount($record);

        if ($this->record->status === 'completed') {
            Notification::make()
                ->warning()
                ->title(trans('Already Completed'))
                ->body(trans('This sale has already been moved to stock.'))
                ->send();
            $this->redirect($this->getResource()::getUrl('view', ['record' => $record]));
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\DeleteAction::make(),
        ];
    }

    protected function getRedirectUrl(): string
    {
        return $this->getResource()::getUrl('index');
    }
}
