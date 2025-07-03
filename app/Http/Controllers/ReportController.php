<?php

namespace App\Http\Controllers;

use App\Models\Account;
use App\Services\Report\ReportService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Auth;
use Illuminate\Auth\Access\AuthorizationException;
use Inertia\Inertia;

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
     * Display account statement report for customers.
     *
     * @param \App\Models\Account $account
     * @return \Inertia\Response|\Illuminate\Http\RedirectResponse
     * @throws \Illuminate\Auth\Access\AuthorizationException
     */
    public function customerAccountStatement(Account $account)
    {
        abort(404);
        // try {
        //     // Check if user is authenticated as customer
        //     if (!auth('customer_user')->check()) {
        //         throw new AuthorizationException('You must be logged in as a customer to view this account statement.');
        //     }

        //     $customerUser = auth('customer_user')->user();
            
        //     // Check if user has permission to manage accounts
        //     if (!$customerUser->hasPermissionTo('customer.manage_accounts')) {
        //         throw new AuthorizationException('You are not authorized to view account statements.');
        //     }

        //     // Check if the account belongs to the customer
        //     if ($account->customer_id != $customerUser->customer_id) {
        //         throw new AuthorizationException('You are not authorized to view this account statement.');
        //     }

        //     // Get statement data from the service
        //     $statementData = $this->reportService->generateAccountStatement($account);

        //     Log::info('Customer account statement viewed', [
        //         'customer_user_id' => $customerUser->id,
        //         'account_id' => $account->id
        //     ]);

        //     return Inertia::render('Customer/AccountStatement', [
        //         'account' => $account,
        //         'statementData' => $statementData,
        //     ]);
        // } catch (AuthorizationException $e) {
        //     Log::warning('Unauthorized customer account statement access attempt', [
        //         'customer_user_id' => auth('customer_user')->id(),
        //         'account_id' => $account->id
        //     ]);

        //     return redirect()->route('customer.dashboard')
        //         ->with('error', $e->getMessage());
        // } catch (\Exception $e) {
        //     Log::error('Error generating customer account statement', [
        //         'account_id' => $account->id,
        //         'error' => $e->getMessage()
        //     ]);

        //     return redirect()->route('customer.dashboard')
        //         ->with('error', 'An error occurred while generating the account statement.');
        // }
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
            if (!Gate::allows('view-account', $account)) {
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

    /**
     * Generate and download customer account statement as PDF.
     *
     * @param \App\Models\Account $account
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\Response|\Illuminate\Http\RedirectResponse
     */
    public function downloadCustomerAccountStatement(Account $account, Request $request)
    {
        try {
            // Check if user is authenticated as customer
            if (!auth('customer_user')->check()) {
                throw new AuthorizationException('You must be logged in as a customer to download this account statement.');
            }

            $customerUser = auth('customer_user')->user();
            
            // Check if user has permission to manage accounts
            if (!$customerUser->hasPermissionTo('customer.manage_accounts')) {
                throw new AuthorizationException('You are not authorized to download account statements.');
            }

            // Check if the account belongs to the customer
            if ($account->customer_id != $customerUser->customer_id) {
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

            Log::info('Customer account statement downloaded', [
                'customer_user_id' => $customerUser->id,
                'account_id' => $account->id
            ]);

            return $pdf->download("customer-account-statement-{$account->id}.pdf");
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized customer account statement download attempt', [
                'customer_user_id' => auth('customer_user')->id(),
                'account_id' => $account->id
            ]);

            return redirect()->route('customer.dashboard')
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error downloading customer account statement', [
                'account_id' => $account->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->route('customer.accounts.show', $account)
                ->with('error', 'An error occurred while generating the PDF.');
        }
    }
}
