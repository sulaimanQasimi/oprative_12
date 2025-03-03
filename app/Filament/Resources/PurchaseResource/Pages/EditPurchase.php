<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Filament\Resources\PurchaseResource;
use Filament\Actions;
use Filament\Resources\Pages\EditRecord;

class EditPurchase extends EditRecord
{
    protected static string $resource = PurchaseResource::class;

    public function mount($record): void
    {
        parent::mount($record);

        if ($this->record->status === 'warehouse_moved') {
            $this->redirect($this->getResource()::getUrl('view', ['record' => $record]));
        }
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\ViewAction::make(),
            Actions\DeleteAction::make(),
            Actions\ForceDeleteAction::make(),
            Actions\RestoreAction::make(),
        ];
    }

    public static function getNavigationLabel(): string
    {
        return __('Edit Purchase');
    }
}
