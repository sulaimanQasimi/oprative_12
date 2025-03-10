<?php

namespace App\Filament\Resources\PurchaseResource\Pages;

use App\Models\Purchase;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;

class PurchasePaymentStats extends BaseWidget
{

    public Purchase $record;

    protected function getOwnerRecord()
    {
        return $this->record;
    }

    protected function getStats(): array
    {
        $purchase = $this->getOwnerRecord();

        $totalAmount = $purchase->total_amount;
        $paidAmount = $purchase->purchasePayments->sum('amount');
        $remainingAmount = $totalAmount - $paidAmount;
        $currencyCode = $purchase->currency->code;

        $paymentStatus = 'Pending';
        $paymentColor = 'danger';

        if ($paidAmount >= $totalAmount) {
            $paymentStatus = 'Paid';
            $paymentColor = 'success';
        } elseif ($paidAmount > 0) {
            $paymentStatus = 'Partial';
            $paymentColor = 'warning';
        }

        return [
            Stat::make(trans('Total Amount'), number_format($totalAmount, 2) . ' ' . $currencyCode)
                ->description(trans('Purchase Total'))
                ->color('info')
                ->icon('heroicon-o-shopping-cart'),

            Stat::make(trans('Paid Amount'), number_format($paidAmount, 2) . ' ' . $currencyCode)
                ->description(trans('Total Paid'))
                ->color('success')
                ->icon('heroicon-o-banknotes'),

            Stat::make(trans('Remaining Amount'), number_format($remainingAmount, 2) . ' ' . $currencyCode)
                ->description(trans('Payment Status') . ': ' . trans($paymentStatus))
                ->color($paymentColor)
                ->icon('heroicon-o-clock'),
        ];
    }
}
