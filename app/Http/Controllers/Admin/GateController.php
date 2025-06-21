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
    public function __construct()
    {
        $this->middleware('can:view_any_gate')->only('index');
        $this->middleware('can:view_gate')->only('show');
        $this->middleware('can:create_gate')->only(['create', 'store']);
        $this->middleware('can:update_gate')->only(['edit', 'update']);
        $this->middleware('can:delete_gate')->only('destroy');
        $this->middleware('can:restore_gate')->only('restore');
        $this->middleware('can:force_delete_gate')->only('forceDelete');
    }

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Gate::with(['user', 'employees']);

        // Include trashed if user has restore permission and requested
        if ($request->get('with_trashed') && Auth::user()->can('restore_gate')) {
            $query->withTrashed();
        } elseif ($request->get('only_trashed') && Auth::user()->can('restore_gate')) {
            $query->onlyTrashed();
        }

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
        $gates = $query->paginate(10)->appends($request->query());

        return Inertia::render('Admin/Gate/Index', [
            'gates' => $gates,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction', 'with_trashed', 'only_trashed']),
            'permissions' => [
                'view_any_gate' => Auth::user()->can('view_any_gate'),
                'create_gate' => Auth::user()->can('create_gate'),
                'update_gate' => Auth::user()->can('update_gate'),
                'delete_gate' => Auth::user()->can('delete_gate'),
                'view_gate' => Auth::user()->can('view_gate'),
                'restore_gate' => Auth::user()->can('restore_gate'),
                'force_delete_gate' => Auth::user()->can('force_delete_gate'),
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
                'create_gate' => Auth::user()->can('create_gate'),
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:gates,name',
            'user_id' => 'required|exists:users,id|unique:gates,user_id',
        ], [
            'name.unique' => 'A gate with this name already exists. Please choose a different name.',
            'user_id.unique' => 'This user is already assigned to another gate. Each user can only be assigned to one gate.',
            'user_id.exists' => 'The selected user does not exist.',
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
                'view_gate' => Auth::user()->can('view_gate'),
                'update_gate' => Auth::user()->can('update_gate'),
                'delete_gate' => Auth::user()->can('delete_gate'),
                'restore_gate' => Auth::user()->can('restore_gate'),
                'force_delete_gate' => Auth::user()->can('force_delete_gate'),
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
                'view_gate' => Auth::user()->can('view_gate'),
                'update_gate' => Auth::user()->can('update_gate'),
                'delete_gate' => Auth::user()->can('delete_gate'),
                'restore_gate' => Auth::user()->can('restore_gate'),
                'force_delete_gate' => Auth::user()->can('force_delete_gate'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Gate $gate)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:gates,name,' . $gate->id,
            'user_id' => 'required|exists:users,id|unique:gates,user_id,' . $gate->id,
        ], [
            'name.unique' => 'A gate with this name already exists. Please choose a different name.',
            'user_id.unique' => 'This user is already assigned to another gate. Each user can only be assigned to one gate.',
            'user_id.exists' => 'The selected user does not exist.',
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

    /**
     * Restore the specified resource from storage.
     */
    public function restore($id)
    {
        $gate = Gate::withTrashed()->findOrFail($id);
        $gate->restore();

        return redirect()->route('admin.gates.index')
            ->with('success', 'Gate restored successfully.');
    }

    /**
     * Force delete the specified resource from storage.
     */
    public function forceDelete($id)
    {
        $gate = Gate::withTrashed()->findOrFail($id);
        $gate->forceDelete();

        return redirect()->route('admin.gates.index')
            ->with('success', 'Gate permanently deleted.');
    }
}
