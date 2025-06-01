<?php

namespace App\Http\Controllers;

use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class EmployeeController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', Employee::class);

        $query = Employee::with('fingerprints');

        // Search functionality
        if ($request->filled('search')) {
            $query->searchByName($request->search);
        }

        // Department filter
        if ($request->filled('department')) {
            $query->byDepartment($request->department);
        }

        $employees = $query->latest()->paginate(15);
        $departments = Employee::distinct()->pluck('department');

        return view('employees.index', compact('employees', 'departments'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', Employee::class);

        return view('employees.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', Employee::class);

        $validated = $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'taskra_id' => 'required|string|max:255|unique:employees',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255|unique:employees',
            'department' => 'required|string|max:255',
            'contact_info' => 'nullable|array',
            'contact_info.phone' => 'nullable|string|max:20',
            'contact_info.mobile' => 'nullable|string|max:20',
            'contact_info.address' => 'nullable|string|max:500',
            'contact_info.emergency_contact' => 'nullable|array',
            'contact_info.emergency_contact.name' => 'nullable|string|max:255',
            'contact_info.emergency_contact.phone' => 'nullable|string|max:20',
            'contact_info.emergency_contact.relationship' => 'nullable|string|max:100',
            'email' => 'required|email|unique:employees',
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            $validated['photo'] = $request->file('photo')->store('photos/employees', 'public');
        }

        $employee = Employee::create($validated);

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(Employee $employee)
    {
        $this->authorize('view', $employee);

        $employee->load('fingerprints');

        return view('employees.show', compact('employee'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Employee $employee)
    {
        $this->authorize('update', $employee);

        return view('employees.edit', compact('employee'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Employee $employee)
    {
        $this->authorize('update', $employee);

        $validated = $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'taskra_id' => ['required', 'string', 'max:255', Rule::unique('employees')->ignore($employee->id)],
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_id' => ['required', 'string', 'max:255', Rule::unique('employees')->ignore($employee->id)],
            'department' => 'required|string|max:255',
            'contact_info' => 'nullable|array',
            'contact_info.phone' => 'nullable|string|max:20',
            'contact_info.mobile' => 'nullable|string|max:20',
            'contact_info.address' => 'nullable|string|max:500',
            'contact_info.emergency_contact' => 'nullable|array',
            'contact_info.emergency_contact.name' => 'nullable|string|max:255',
            'contact_info.emergency_contact.phone' => 'nullable|string|max:20',
            'contact_info.emergency_contact.relationship' => 'nullable|string|max:100',
            'email' => ['required', 'email', Rule::unique('employees')->ignore($employee->id)],
        ]);

        // Handle photo upload
        if ($request->hasFile('photo')) {
            // Delete old photo if exists
            if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
                Storage::disk('public')->delete($employee->photo);
            }
            $validated['photo'] = $request->file('photo')->store('photos/employees', 'public');
        }

        $employee->update($validated);

        return redirect()->route('employees.show', $employee)
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Employee $employee)
    {
        $this->authorize('delete', $employee);

        // Delete photo if exists
        if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
            Storage::disk('public')->delete($employee->photo);
        }

        // Delete associated fingerprints
        $employee->fingerprints()->delete();

        $employee->delete();

        return redirect()->route('employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
}
