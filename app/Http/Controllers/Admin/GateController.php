<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Gate;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class GateController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Gate::with(['user', 'employees']);

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                    ->orWhereHas('user', function ($userQuery) use ($search) {
                        $userQuery->where('name', 'like', "%{$search}%");
                    });
            });
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'name');
        $sortDirection = $request->input('sort_direction', 'asc');
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $gates = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/Gate/Index', [
            'gates' => $gates,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
            'permissions' => [
                'create_gate' => Auth::user()->can('create_gate'),
                'update_gate' => Auth::user()->can('update_gate'),
                'delete_gate' => Auth::user()->can('delete_gate'),
                'view_gate' => Auth::user()->can('view_gate'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $users = User::select('id', 'name', 'email')->get();

        return Inertia::render('Admin/Gate/Create', [
            'users' => $users,
            'permissions' => [
                'create_gate' => true, // Already authorized
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        Gate::create($validated);

        return redirect()->route('admin.gates.index')
            ->with('success', 'Gate created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Gate $gate)
    {
        $gate->load(['user', 'employees']);

        return Inertia::render('Admin/Gate/Show', [
            'gate' => $gate,
            'permissions' => [
                'view_gate' => true, // Already authorized
                'update_gate' => Auth::user()->can('update_gate'),
                'delete_gate' => Auth::user()->can('delete_gate'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Gate $gate)
    {
        $users = User::select('id', 'name', 'email')->get();
        $gate->load(['user']);

        return Inertia::render('Admin/Gate/Edit', [
            'gate' => $gate,
            'users' => $users,
            'permissions' => [
                'view_gate' => true, // Already authorized
                'update_gate' => true, // Already authorized
                'delete_gate' => Auth::user()->can('delete_gate'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gate $gate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'user_id' => 'required|exists:users,id',
        ]);

        $gate->update($validated);

        return redirect()->route('admin.gates.index')
            ->with('success', 'Gate updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Gate $gate)
    {
        $gate->delete();

        return redirect()->route('admin.gates.index')
            ->with('success', 'Gate deleted successfully.');
    }
}
