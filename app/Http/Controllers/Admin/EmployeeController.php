<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;

class EmployeeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = Employee::with('fingerprints');

        // Search functionality
        if ($request->filled('search')) {
            $query->searchByName($request->search);
        }

        // Department filter
        if ($request->filled('department')) {
            $query->byDepartment($request->department);
        }

        $employees = $query->latest()->get();
        $departments = Employee::distinct()->pluck('department');

        return Inertia::render('Admin/Employee/Index', [
            'employees' => $employees,
            'departments' => $departments,
            'filters' => $request->only(['search', 'department'])
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $gates = \App\Models\Gate::with('user')->select('id', 'name', 'user_id')->get();

        return Inertia::render('Admin/Employee/Create', [
            'gates' => $gates
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'photo' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'taskra_id' => 'required|string|max:255|unique:employees',
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'employee_id' => 'required|string|max:255|unique:employees',
            'department' => 'required|string|max:255',
            'gate_id' => 'nullable|exists:gates,id',
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

        Employee::create($validated);

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $employee = Employee::with(['fingerprints', 'gate.user'])->findOrFail($id);

        return Inertia::render('Admin/Employee/Show', [
            'employee' => $employee
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit($id)
    {
        $employee = Employee::findOrFail($id);

        return Inertia::render('Admin/Employee/Edit', [
            'employee' => $employee
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $employee = Employee::findOrFail($id);

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

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $employee = Employee::findOrFail($id);

        // Delete photo if exists
        if ($employee->photo && Storage::disk('public')->exists($employee->photo)) {
            Storage::disk('public')->delete($employee->photo);
        }

        // Delete associated fingerprints
        $employee->fingerprints()->delete();

        $employee->delete();

        return redirect()->route('admin.employees.index')
            ->with('success', 'Employee deleted successfully.');
    }
} 