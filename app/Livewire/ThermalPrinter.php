<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use Barryvdh\DomPDF\Facade\Pdf;

class ThermalPrinter extends Component
{
    public function printIncome(AccountIncome $income)
    {
        $pdf = PDF::loadView('thermal.income', [
            'income' => $income,
            'account' => $income->account,
        ]);

        $pdf->setPaper([0, 0, 226.772, 841.89], 'portrait');

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, "income-{$income->id}.pdf");
    }

    public function printOutcome(AccountOutcome $outcome)
    {
        $pdf = PDF::loadView('thermal.outcome', [
            'outcome' => $outcome,
            'account' => $outcome->account,
        ]);

        $pdf->setPaper([0, 0, 226.772, 841.89], 'portrait');

        return response()->streamDownload(function() use ($pdf) {
            echo $pdf->output();
        }, "rent-{$outcome->id}.pdf");
    }

    public function render()
    {
        return view('livewire.thermal-printer');
    }
}
