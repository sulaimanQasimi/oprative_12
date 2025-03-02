<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Resources\Pages\Page;
use Filament\Actions;

class SaleItems extends Page
{
    protected static string $resource = SaleResource::class;

    protected static string $view = 'filament.resources.sale-resource.pages.sale-items';

    public function mount(int|string $record): void
    {
        static::authorizeResourceAccess();

        $this->record = $this->resolveRecord($record);

        static::authorizeAccess();
    }

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('add_item')
                ->label('Add Item')
                ->url(route('filament.admin.resources.sales.items.create', ['record' => $this->record]))
                ->icon('heroicon-o-plus'),
        ];
    }
}