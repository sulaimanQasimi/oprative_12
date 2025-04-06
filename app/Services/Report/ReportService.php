<?php

namespace App\Services\Report;

use App\Models\Account;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Barryvdh\DomPDF\Facade\Pdf;

class ReportService
{
    /**
     * Generate account statement data
     *
     * @param \App\Models\Account $account
     * @param string|null $startDate
     * @param string|null $endDate
     * @return array
     */
    public function generateAccountStatement(Account $account, ?string $startDate = null, ?string $endDate = null): array
    {
        // Parse date ranges or use defaults
        $startDate = $startDate ? Carbon::parse($startDate)->startOfDay() : Carbon::now()->subMonths(1)->startOfDay();
        $endDate = $endDate ? Carbon::parse($endDate)->endOfDay() : Carbon::now()->endOfDay();

        // Get income transactions
        $incomes = $account->incomes()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at')
            ->get();

        // Get outcome transactions
        $outcomes = $account->outcomes()
            ->whereBetween('created_at', [$startDate, $endDate])
            ->orderBy('created_at')
            ->get();

        // Calculate totals
        $totalIncome = $incomes->sum('amount');
        $totalOutcome = $outcomes->sum('amount');
        $netChange = $totalIncome - $totalOutcome;

        // Get balance at start date
        $openingBalance = $this->getBalanceAsOf($account, $startDate);
        $closingBalance = $openingBalance + $netChange;

        // Return structured data
        return [
            'dateRange' => [
                'start' => $startDate->format('Y-m-d'),
                'end' => $endDate->format('Y-m-d'),
            ],
            'transactions' => [
                'incomes' => $incomes,
                'outcomes' => $outcomes,
            ],
            'summary' => [
                'openingBalance' => $openingBalance,
                'closingBalance' => $closingBalance,
                'totalIncome' => $totalIncome,
                'totalOutcome' => $totalOutcome,
                'netChange' => $netChange,
            ],
        ];
    }

    /**
     * Generate a PDF for account statement
     *
     * @param \App\Models\Account $account
     * @param string|null $startDate
     * @param string|null $endDate
     * @return \Barryvdh\DomPDF\PDF
     */
    public function generateAccountStatementPdf(Account $account, ?string $startDate = null, ?string $endDate = null)
    {
        // Get statement data
        $statementData = $this->generateAccountStatement($account, $startDate, $endDate);

        // Generate PDF using Laravel-DomPDF
        $pdf = PDF::loadView('reports.pdf.account-statement', [
            'account' => $account,
            'statementData' => $statementData,
            'generatedAt' => Carbon::now()->format('Y-m-d H:i:s'),
        ]);

        // Set paper size and orientation
        $pdf->setPaper('a4', 'portrait');

        return $pdf;
    }

    /**
     * Calculate account balance as of a specific date
     *
     * @param \App\Models\Account $account
     * @param \Carbon\Carbon $date
     * @return float
     */
    protected function getBalanceAsOf(Account $account, Carbon $date): float
    {
        // Get income sum before the date
        $incomeSum = $account->incomes()
            ->where('created_at', '<', $date)
            ->sum('amount');

        // Get outcome sum before the date
        $outcomeSum = $account->outcomes()
            ->where('created_at', '<', $date)
            ->sum('amount');

        // Return balance (initial balance + income - outcome)
        return ($account->initial_balance ?? 0) + $incomeSum - $outcomeSum;
    }
}
