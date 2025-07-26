<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Currency;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

/**
 * @group Currency Management
 *
 * APIs for managing currencies
 */
class CurrencyController extends Controller
{
    public function select(Request $request)
    {
        Log::info($request->search);
        $currencies = Currency::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('code', 'like', '%' . $request->search . '%')
            ->orderBy('name')
            ->get();

        return $currencies->map(function ($currency) {
            return [
                'value' => $currency->id,
                'label' => $currency->name,
                'subtitle' => $currency->code ? "Code: {$currency->code}" . ($currency->symbol ? " • Symbol: {$currency->symbol}" : '') : "ID: {$currency->id}",
                'currency' => $currency->toArray()
            ];
        });
    }
} 