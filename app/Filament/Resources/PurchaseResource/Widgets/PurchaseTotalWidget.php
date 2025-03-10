<?php

namespace App\Filament\Resources\PurchaseResource\Widgets;

use App\Models\Purchase;
use Filament\Widgets\Widget;

class PurchaseTotalWidget extends Widget
{
    protected static string $view = 'filament.resources.purchase-resource.widgets.purchase-total-widget';

    public Purchase $record;

    protected function getViewData(): array
    {
        return [
            'total' => $this->record->total_amount,
        ];
    }
}
