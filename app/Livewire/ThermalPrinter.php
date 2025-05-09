<?php

namespace App\Livewire;

use Livewire\Component;
use App\Models\AccountIncome;
use App\Models\AccountOutcome;

class ThermalPrinter extends Component
{
    public function printIncome(AccountIncome $income)
    {
        return view('thermal.income', [
            'income' => $income,
            'account' => $income->account,
        ]);
    }

    public function printOutcome(AccountOutcome $outcome)
    {
        return view('thermal.outcome', [
            'outcome' => $outcome,
            'account' => $outcome->account,
        ]);
    }

    public function render()
    {
        return view('livewire.thermal-printer');
    }
}
