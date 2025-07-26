<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;

/**
 * @group Unit Management
 *
 * APIs for managing units
 */
class UnitController extends Controller
{
    public function select(Request $request)
    {
        $units = Unit::where('name', 'like', '%' . $request->search . '%')
            ->orWhere('code', 'like', '%' . $request->search . '%')
            ->orderBy('name')
            ->get();

        return $units->map(function ($unit) {
            return [
                'value' => $unit->id,
                'label' => $unit->name,
                'subtitle' => $unit->code ? "Code: {$unit->code}" . ($unit->symbol ? " • Symbol: {$unit->symbol}" : '') : "ID: {$unit->id}",
                'unit' => $unit->toArray()
            ];
        });
    }
}