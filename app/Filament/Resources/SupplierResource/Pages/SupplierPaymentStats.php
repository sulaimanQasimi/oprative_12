<?php

namespace App\Filament\Resources\SupplierResource\Pages;

use App\Models\SupplierPayment;
use Filament\Widgets\StatsOverviewWidget as BaseWidget;
use Filament\Widgets\StatsOverviewWidget\Stat;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class SupplierPaymentStats extends BaseWidget
{
    protected static ?string $pollingInterval = '10s';

    public ?Model $record = null;

    public function mount($record): void
    {
        $this->record = $record;
        // dd($record);
    }
    protected function getStats(): array
    {

        $payments = $this->record;

        return [
            Stat::make('Total Payments', $payments->total_payments)
                ->description('Number of payments made')
                ->descriptionIcon('heroicon-m-credit-card')
                ->chart([
                    $payments->total_payments,
                ])
                ->color('primary'),

            Stat::make('Total Amount', number_format($payments->total_amount, 2))
                ->description('Total amount paid')
                ->descriptionIcon('heroicon-m-banknotes')
                ->chart([
                    $payments->total_amount,
                ])
                ->color('success'),

            Stat::make('Average Payment', number_format($payments->average_amount, 2))
                ->description('Average payment amount')
                ->descriptionIcon('heroicon-m-calculator')
                ->chart([
                    $payments->average_amount,
                ])
                ->color('warning'),
        ];
    }
}
