<?php

namespace App\Filament\Resources\SaleResource\Pages;

use App\Filament\Resources\SaleResource;
use Filament\Resources\Pages\Page;
use Filament\Actions;

class SalePayments extends ManageRelatedRecords
{
    protected static string $resource = SaleResource::class;
    protected static string $relationship = 'payments';
    protected static ?string $navigationIcon = 'heroicon-o-currency-dollar';
    protected static ?string $navigationLabel = 'Payments';
    protected static ?string $title = 'Sale Payments';

    protected function getHeaderActions(): array
    {
        return [
            Actions\Action::make('new_payment')
                ->label('New Payment')
                ->url(route('filament.admin.resources.sales.create'))
                ->icon('heroicon-o-plus'),
        ];
    }
}
