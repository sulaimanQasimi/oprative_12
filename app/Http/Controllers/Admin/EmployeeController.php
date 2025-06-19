<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Employee;
use App\Models\BioDataTable;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Inertia\Inertia;
use Carbon\Carbon;

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
        $biometric = BioDataTable::where('employee_id', $id)->first();

        return Inertia::render('Admin/Employee/Show', [
            'employee' => $employee,
            'biometric' => $biometric
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

    /**
     * Show the employee verification page.
     */
    public function verify()
    {
        return Inertia::render('Admin/Employee/Verify');
    }

    /**
     * Verify employee by employee_id.
     */
    public function verifyEmployee(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string'
        ]);

        $employee = Employee::with(['fingerprints', 'gate.user', 'biometric'])
            ->where('employee_id', $request->employee_id)
            ->first();

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        // Check today's attendance
        $today = Carbon::today();
        $currentAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        // Get attendance history for last 7 days
        $attendanceHistory = Attendance::where('employee_id', $employee->id)
            ->where('date', '>=', Carbon::now()->subDays(7))
            ->orderBy('date', 'desc')
            ->get()
            ->map(function ($attendance) {
                return [
                    'id' => $attendance->id,
                    'date' => $attendance->date,
                    'check_in' => $attendance->enter_time,
                    'check_out' => $attendance->exit_time,
                    'status' => $attendance->exit_time ? 'checked_out' : 'checked_in',
                ];
            });

        return response()->json([
            'success' => true,
            'employee' => [
                'id' => $employee->id,
                'first_name' => $employee->first_name,
                'last_name' => $employee->last_name,
                'employee_id' => $employee->employee_id,
                'taskra_id' => $employee->taskra_id,
                'department' => $employee->department,
                'email' => $employee->email,
                'photo' => $employee->photo,
                'contact_info' => $employee->contact_info,
                'biometric' => $employee->biometric ? true : false,
                'fingerprint_template' => $employee->biometric ? $employee->biometric->template : null,
                'gate' => $employee->gate,
                'created_at' => $employee->created_at,
            ],
            'current_attendance' => $currentAttendance ? [
                'id' => $currentAttendance->id,
                'check_in' => $currentAttendance->enter_time,
                'check_out' => $currentAttendance->exit_time,
                'date' => $currentAttendance->date,
            ] : null,
            'attendance_history' => $attendanceHistory
        ]);
    }

    /**
     * Record attendance after SecuGen fingerprint verification.
     */
    public function recordAttendance(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|integer',
            'action' => 'required|in:check_in,check_out',
            'verification_method' => 'required|string',
            'fingerprint_score' => 'required|numeric|min:0|max:100'
        ]);

        // Check if fingerprint score meets minimum requirement
        if ($request->fingerprint_score < 30) {
            return response()->json([
                'success' => false,
                'message' => "Fingerprint verification failed. Score: {$request->fingerprint_score}/100. Minimum required: 30"
            ], 400);
        }

        $employee = Employee::find($request->employee_id);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found'
            ], 404);
        }

        $today = Carbon::today();
        $now = Carbon::now();

        // Check if attendance already exists for today
        $existingAttendance = Attendance::where('employee_id', $employee->id)
            ->where('date', $today)
            ->first();

        if ($request->action === 'check_in') {
            if ($existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee already checked in today',
                    'attendance' => $existingAttendance
                ], 400);
            }

            // Create new attendance record
            $attendance = Attendance::create([
                'employee_id' => $employee->id,
                'enter_time' => $now,
                'date' => $today
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Check-in successful',
                'attendance' => [
                    'id' => $attendance->id,
                    'check_in' => $attendance->enter_time,
                    'check_out' => null,
                    'date' => $attendance->date,
                ],
                'fingerprint_score' => $request->fingerprint_score,
                'verification_method' => $request->verification_method
            ]);
        } else {
            // Check out
            if (!$existingAttendance) {
                return response()->json([
                    'success' => false,
                    'message' => 'No check-in record found for today'
                ], 400);
            }

            if ($existingAttendance->exit_time) {
                return response()->json([
                    'success' => false,
                    'message' => 'Employee already checked out today'
                ], 400);
            }

            $existingAttendance->update([
                'exit_time' => $now
            ]);

            return response()->json([
                'success' => true,
                'message' => 'Check-out successful',
                'attendance' => [
                    'id' => $existingAttendance->id,
                    'check_in' => $existingAttendance->enter_time,
                    'check_out' => $existingAttendance->exit_time,
                    'date' => $existingAttendance->date,
                ],
                'fingerprint_score' => $request->fingerprint_score,
                'verification_method' => $request->verification_method
            ]);
        }
    }

    /**
     * Get today's attendance statistics.
     */
    public function getTodayStats()
    {
        $today = Carbon::today();

        $totalEmployees = Employee::count();
        $checkedIn = Attendance::where('date', $today)
            ->whereNotNull('enter_time')
            ->whereNull('exit_time')
            ->count();
        $checkedOut = Attendance::where('date', $today)
            ->whereNotNull('exit_time')
            ->count();

        // Count late arrivals (assuming work starts at 9:00 AM)
        $workStartTime = Carbon::today()->setTime(9, 0, 0);
        $lateArrivals = Attendance::where('date', $today)
            ->where('enter_time', '>', $workStartTime)
            ->count();

        return response()->json([
            'total_employees' => $totalEmployees,
            'checked_in' => $checkedIn,
            'checked_out' => $checkedOut,
            'late_arrivals' => $lateArrivals
        ]);
    }
}
