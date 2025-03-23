<?php

namespace App\Http\Controllers;

use App\Models\Account;
use Illuminate\Http\Request;

class ReportController extends Controller
{
    public function accountStatement(Account $account)
    {
        return view('reports.account-statement', [
            'account' => $account
        ]);
    }
}
