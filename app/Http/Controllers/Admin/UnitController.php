<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function index()
    {
        $units = Unit::all();
        return Inertia::render('Admin/Unit/Index', [
            'units' => $units,
        ]);
    }

    public function create()
    {
        return Inertia::render('Admin/Unit/Create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:units',
        ]);

        Unit::create($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function edit(Unit $unit)
    {
        return Inertia::render('Admin/Unit/Edit', [
            'unit' => $unit,
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:units,code,' . $unit->id,
        ]);

        $unit->update($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit updated successfully.');
    }

    public function destroy(Unit $unit)
    {
        $unit->delete();

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit deleted successfully.');
    }
}
