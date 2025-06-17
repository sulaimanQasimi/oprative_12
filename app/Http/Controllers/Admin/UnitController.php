<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Unit;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Gate;
use Illuminate\Support\Facades\Redirect;
use Inertia\Inertia;

class UnitController extends Controller
{
    public function __construct()
    {
        $this->middleware('can:view_any_unit')->only(['index']);
        $this->middleware('can:view_unit,unit')->only(['show']);
        $this->middleware('can:create_unit')->only(['create', 'store']);
        $this->middleware('can:update_unit,unit')->only(['edit', 'update']);
        $this->middleware('can:delete_unit,unit')->only(['destroy']);
        $this->middleware('can:restore_unit,unit')->only(['restore']);
        $this->middleware('can:force_delete_unit,unit')->only(['forceDelete']);
    }

    public function index()
    {
        $units = Unit::all();

        // Pass permissions to the frontend
        $user = Auth::user();
        $permissions = [
            'can_create' => Gate::allows('create_unit'),
            'can_update' => Gate::allows('update_unit', Unit::class),
            'can_delete' => Gate::allows('delete_unit', Unit::class),
            'can_view' => Gate::allows('view_unit', Unit::class),
        ];

        return Inertia::render('Admin/Unit/Index', [
            'units' => $units,
            'permissions' => $permissions,
        ]);
    }

    public function create()
    {
        $permissions = [
            'can_create' => Gate::allows('create_unit'),
        ];

        return Inertia::render('Admin/Unit/Create', [
            'permissions' => $permissions,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:units',
            'symbol' => 'required|string|max:10',
        ]);

        Unit::create($validated);

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit created successfully.');
    }

    public function show(Unit $unit)
    {
        $permissions = [
            'can_view' => Gate::allows('view_unit', $unit),
            'can_update' => Gate::allows('update_unit', $unit),
            'can_delete' => Gate::allows('delete_unit', $unit),
        ];

        return Inertia::render('Admin/Unit/Show', [
            'unit' => $unit,
            'permissions' => $permissions,
        ]);
    }

    public function edit(Unit $unit)
    {
        $permissions = [
            'can_update' => Gate::allows('update_unit', $unit),
        ];

        return Inertia::render('Admin/Unit/Edit', [
            'unit' => $unit,
            'permissions' => $permissions,
        ]);
    }

    public function update(Request $request, Unit $unit)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'code' => 'required|string|max:255|unique:units,code,' . $unit->id,
            'symbol' => 'required|string|max:10',
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

    public function restore(Unit $unit)
    {
        $unit->restore();

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit restored successfully.');
    }

    public function forceDelete(Unit $unit)
    {
        $unit->forceDelete();

        return redirect()->route('admin.units.index')
            ->with('success', 'Unit permanently deleted.');
    }
}
