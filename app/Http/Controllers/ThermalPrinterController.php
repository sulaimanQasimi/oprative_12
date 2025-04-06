<?php

namespace App\Http\Controllers;

use App\Models\AccountIncome;
use App\Models\AccountOutcome;
use App\Services\Printing\PrintService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Log;
use Illuminate\Auth\Access\AuthorizationException;
use Symfony\Component\HttpFoundation\Response;

class ThermalPrinterController extends Controller
{
    /**
     * The print service instance.
     */
    protected PrintService $printService;

    /**
     * Create a new controller instance.
     *
     * @param \App\Services\Printing\PrintService $printService
     */
    public function __construct(PrintService $printService)
    {
        $this->printService = $printService;
    }

    /**
     * Generate thermal receipt for income transaction.
     *
     * @param \App\Models\AccountIncome $income
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function printIncome(AccountIncome $income)
    {
        try {
            // Check if user has permission to print this income receipt
            if (!Gate::allows('print-income', $income)) {
                throw new AuthorizationException('You are not authorized to print this income receipt.');
            }

            // Record the print attempt
            Log::info('Income receipt printed', [
                'user_id' => optional(request()->user())->getKey(),
                'income_id' => $income->id,
                'account_id' => $income->account_id
            ]);

            // Add print counter to income
            $this->printService->recordPrintAttempt($income);

            return view('thermal.income', [
                'income' => $income,
                'account' => $income->account,
                'printDate' => now()->format('Y-m-d H:i:s'),
                'settings' => $this->printService->getPrinterSettings(),
            ]);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized income receipt print attempt', [
                'user_id' => optional(request()->user())->getKey(),
                'income_id' => $income->id
            ]);

            return redirect()->back()
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error printing income receipt', [
                'income_id' => $income->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()
                ->with('error', 'An error occurred while generating the receipt.');
        }
    }

    /**
     * Generate thermal receipt for outcome transaction.
     *
     * @param \App\Models\AccountOutcome $outcome
     * @return \Illuminate\View\View|\Illuminate\Http\RedirectResponse
     */
    public function printOutcome(AccountOutcome $outcome)
    {
        try {
            // Check if user has permission to print this outcome receipt
            if (!Gate::allows('print-outcome', $outcome)) {
                throw new AuthorizationException('You are not authorized to print this outcome receipt.');
            }

            // Record the print attempt
            Log::info('Outcome receipt printed', [
                'user_id' => optional(request()->user())->getKey(),
                'outcome_id' => $outcome->id,
                'account_id' => $outcome->account_id
            ]);

            // Add print counter to outcome
            $this->printService->recordPrintAttempt($outcome);

            return view('thermal.outcome', [
                'outcome' => $outcome,
                'account' => $outcome->account,
                'printDate' => now()->format('Y-m-d H:i:s'),
                'settings' => $this->printService->getPrinterSettings(),
            ]);
        } catch (AuthorizationException $e) {
            Log::warning('Unauthorized outcome receipt print attempt', [
                'user_id' => optional(request()->user())->getKey(),
                'outcome_id' => $outcome->id
            ]);

            return redirect()->back()
                ->with('error', $e->getMessage());
        } catch (\Exception $e) {
            Log::error('Error printing outcome receipt', [
                'outcome_id' => $outcome->id,
                'error' => $e->getMessage()
            ]);

            return redirect()->back()
                ->with('error', 'An error occurred while generating the receipt.');
        }
    }

    /**
     * Get printer settings API endpoint.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function getPrinterSettings(Request $request)
    {
        try {
            $settings = $this->printService->getPrinterSettings();

            return response()->json([
                'success' => true,
                'data' => $settings
            ]);
        } catch (\Exception $e) {
            Log::error('Error fetching printer settings', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve printer settings'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }

    /**
     * Update printer settings API endpoint.
     *
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function updatePrinterSettings(Request $request)
    {
        try {
            // Validate the incoming request
            $validated = $request->validate([
                'printer_name' => 'required|string|max:255',
                'paper_width' => 'required|integer|min:58|max:80',
                'paper_height' => 'nullable|integer|min:0',
                'margins' => 'nullable|array',
                'font_size' => 'nullable|integer|min:8|max:14',
                'logo_enabled' => 'nullable|boolean'
            ]);

            // Update settings via service
            $settings = $this->printService->updatePrinterSettings($validated);

            Log::info('Printer settings updated', [
                'user_id' => optional(request()->user())->getKey(),
                'settings' => $settings
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Printer settings updated successfully',
                'data' => $settings
            ]);
        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Validation failed',
                'errors' => $e->errors()
            ], Response::HTTP_UNPROCESSABLE_ENTITY);
        } catch (\Exception $e) {
            Log::error('Error updating printer settings', [
                'error' => $e->getMessage()
            ]);

            return response()->json([
                'success' => false,
                'message' => 'Failed to update printer settings'
            ], Response::HTTP_INTERNAL_SERVER_ERROR);
        }
    }
}
