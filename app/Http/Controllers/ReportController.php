<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\Report\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;

class ReportController extends Controller
{
    /**
     * The report service instance.
     */
    protected ReportService $reportService;

    /**
     * Create a new controller instance.
     */
    public function __construct(ReportService $reportService)
    {
        $this->reportService = $reportService;
    }

    /**
     * Get the appropriate dashboard route based on user context.
     *
     * @return string
     */
    protected function getDashboardRoute()
    {
        // Check for customer_user guard first
        if (auth('customer_user')->check()) {
            return route('customer.dashboard');
        }

        $user = Auth::user();
        
        if (!$user) {
            return route('admin.login');
        }

        // Check if user is a warehouse user
        if ($user->getTable() === 'ware_house_users') {
            // For warehouse users, redirect to inventory dashboard
            // We need to get the warehouse ID from the user
            $warehouse = $user->warehouse;
            if ($warehouse) {
                return route('inventory.dashboard', $warehouse);
            }
        }

        // Default to admin dashboard for web guard users
        return route('admin.dashboard');
    }

    /**
     * Display account statement report.
     *
     * @param \App\Models\Account $account
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function accountStatement(Account $account)
    {
        try {
            // Authorize access to this account
            if (!auth()->user()->hasPermissionTo('customer.manage_accounts')) {
                throw new AuthorizationException('You are not authorized to view this account statement.');
            }
            if($account->customer_id != auth()->guard('customer_user')->user()->id){
                throw new AuthorizationException('You are not authorized to view this account statement.');
            
            }

            // Get statement data from the service
            $statementData = $this->reportService->generateAccountStatement($account);

            Log::info('Account statement viewed', [
                'user_id' => optional(request()->user())->getKey(),
                'account_id' => $account->id
            ]);

            return view('reports.account-statement', [
                'account' => $account,
                'statementData' => $statementData,
            ]);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized account statement access attempt', [
                'user_id' => optional(request()->user())->getKey(),
                'account_id' => $account->id
            ]);

            return redirect($this->getDashboardRoute())
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error generating account statement', [
                'account_id' => $account->id,
                'error' => $e->getMessage()
            ]);

            return redirect($this->getDashboardRoute())
                ->with('error', 'An error occurred while generating the account statement.');
        }
    }

    /**
     * Generate and download account statement as PDF.
     *
     * @param \App\Models\Account $account
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function downloadAccountStatement(Account $account, Request $request)
    {
        try {
            // Authorize access to this account
            if (!Gate::allows('view-account', $account)) {
                throw new AuthorizationException('You are not authorized to download this account statement.');
            }

            // Validate date range if provided
            $validated = $request->validate([
                'start_date' => ['nullable', 'date'],
                'end_date' => ['nullable', 'date', 'after_or_equal:start_date'],
            ]);

            // Generate PDF using the service
            $pdf = $this->reportService->generateAccountStatementPdf(
                $account,
                $validated['start_date'] ?? null,
                $validated['end_date'] ?? null
            );

            Log::info('Account statement downloaded', [
                'user_id' => optional(request()->user())->getKey(),
                'account_id' => $account->id
            ]);

            return $pdf->download("account-statement-{$account->id}.pdf");
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized account statement download attempt', [
                'user_id' => optional(request()->user())->getKey(),
                'account_id' => $account->id
            ]);

            return redirect($this->getDashboardRoute())
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error downloading account statement', [
                'account_id' => $account->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('reports.account-statement', $account)
                ->with('error', 'An error occurred while generating the PDF.');
        }
    }
}
