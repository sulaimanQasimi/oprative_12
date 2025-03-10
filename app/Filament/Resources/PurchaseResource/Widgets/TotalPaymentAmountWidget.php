<?php

namespace App\Filament\Resources\PurchaseResource\Widgets;

use App\Models\Purchase;
use Filament\Widgets\Widget;

class TotalPaymentAmountWidget extends Widget
{
    protected static string $view = 'filament.resources.purchase-resource.widgets.total-payment-amount-widget';

    public Purchase $record;

    protected function getViewData(): array
    {
        return [
            'totalPayment' => $this->record->purchasePayments()->sum('amount'),
        ];
    }
}
