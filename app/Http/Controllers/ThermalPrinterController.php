<?php

namespace App\Http\Controllers;

use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use Illuminate\Http\Request;

class ThermalPrinterController extends Controller
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
}
