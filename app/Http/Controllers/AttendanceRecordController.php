<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRecord;
use App\Models\Employee;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Validation\Rule;
use Carbon\Carbon;

class AttendanceRecordController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $this->authorize('viewAny', AttendanceRecord::class);

        $query = AttendanceRecord::with('employee');

        // Filter by employee
        if ($request->filled('employee_id')) {
            $query->where('employee_id', $request->employee_id);
        }

        // Filter by date range
        if ($request->filled('start_date')) {
            $query->where('date', '>=', $request->start_date);
        }

        if ($request->filled('end_date')) {
            $query->where('date', '<=', $request->end_date);
        }

        // Filter by status
        if ($request->filled('status')) {
            switch ($request->status) {
                case 'completed':
                    $query->completed();
                    break;
                case 'incomplete':
                    $query->incomplete();
                    break;
            }
        }

        $attendanceRecords = $query->latest('date')->paginate(15);
        $employees = Employee::orderBy('first_name')->get();

        return view('attendance-records.index', compact('attendanceRecords', 'employees'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', AttendanceRecord::class);

        $employees = Employee::orderBy('first_name')->get();
        return view('attendance-records.create', compact('employees'));
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', AttendanceRecord::class);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => [
                'required',
                'date',
                Rule::unique('attendance_records')->where(function ($query) use ($request) {
                    return $query->where('employee_id', $request->employee_id);
                }),
            ],
            'entered_at' => 'nullable|date',
            'exited_at' => 'nullable|date|after:entered_at',
        ], [
            'date.unique' => 'An attendance record for this employee on this date already exists.',
            'exited_at.after' => 'Exit time must be after entry time.',
        ]);

        $attendanceRecord = AttendanceRecord::create($validated);

        return redirect()->route('attendance-records.show', $attendanceRecord)
            ->with('success', 'Attendance record created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceRecord $attendanceRecord)
    {
        $this->authorize('view', $attendanceRecord);

        $attendanceRecord->load('employee');

        return view('attendance-records.show', compact('attendanceRecord'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceRecord $attendanceRecord)
    {
        $this->authorize('update', $attendanceRecord);

        $employees = Employee::orderBy('first_name')->get();
        return view('attendance-records.edit', compact('attendanceRecord', 'employees'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceRecord $attendanceRecord)
    {
        $this->authorize('update', $attendanceRecord);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => [
                'required',
                'date',
                Rule::unique('attendance_records')->where(function ($query) use ($request) {
                    return $query->where('employee_id', $request->employee_id);
                })->ignore($attendanceRecord->id),
            ],
            'entered_at' => 'nullable|date',
            'exited_at' => 'nullable|date|after:entered_at',
        ], [
            'date.unique' => 'An attendance record for this employee on this date already exists.',
            'exited_at.after' => 'Exit time must be after entry time.',
        ]);

        $attendanceRecord->update($validated);

        return redirect()->route('attendance-records.show', $attendanceRecord)
            ->with('success', 'Attendance record updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceRecord $attendanceRecord)
    {
        $this->authorize('delete', $attendanceRecord);

        $attendanceRecord->delete();

        return redirect()->route('attendance-records.index')
            ->with('success', 'Attendance record deleted successfully.');
    }

    /**
     * Check in an employee.
     */
    public function checkIn(Request $request)
    {
        $this->authorize('create', AttendanceRecord::class);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
        ]);

        $date = $validated['date'] ?? now()->format('Y-m-d');

        // Check if record already exists for today
        $existingRecord = AttendanceRecord::where('employee_id', $validated['employee_id'])
            ->where('date', $date)
            ->first();

        if ($existingRecord) {
            if ($existingRecord->entered_at) {
                return back()->withErrors(['employee_id' => 'Employee has already checked in today.']);
            }
        }

        // Create or update record
        $attendanceRecord = AttendanceRecord::updateOrCreate(
            [
                'employee_id' => $validated['employee_id'],
                'date' => $date,
            ],
            [
                'entered_at' => now(),
            ]
        );

        return back()->with('success', 'Employee checked in successfully.');
    }

    /**
     * Check out an employee.
     */
    public function checkOut(Request $request)
    {
        $this->authorize('update', AttendanceRecord::class);

        $validated = $request->validate([
            'employee_id' => 'required|exists:employees,id',
            'date' => 'nullable|date',
        ]);

        $date = $validated['date'] ?? now()->format('Y-m-d');

        $attendanceRecord = AttendanceRecord::where('employee_id', $validated['employee_id'])
            ->where('date', $date)
            ->first();

        if (!$attendanceRecord || !$attendanceRecord->entered_at) {
            return back()->withErrors(['employee_id' => 'Employee has not checked in today.']);
        }

        if ($attendanceRecord->exited_at) {
            return back()->withErrors(['employee_id' => 'Employee has already checked out today.']);
        }

        $attendanceRecord->update([
            'exited_at' => now(),
        ]);

        return back()->with('success', 'Employee checked out successfully.');
    }

    /**
     * Get attendance summary for an employee.
     */
    public function summary(Request $request, Employee $employee)
    {
        $this->authorize('view', AttendanceRecord::class);

        $startDate = $request->get('start_date', now()->startOfMonth()->format('Y-m-d'));
        $endDate = $request->get('end_date', now()->endOfMonth()->format('Y-m-d'));

        $records = $employee->attendanceRecords()
            ->dateRange($startDate, $endDate)
            ->orderBy('date')
            ->get();

        $summary = [
            'total_days' => $records->count(),
            'completed_days' => $records->where('exited_at', '!=', null)->count(),
            'incomplete_days' => $records->where('entered_at', '!=', null)->where('exited_at', null)->count(),
            'total_hours' => $records->sum('total_hours'),
            'average_hours' => $records->where('exited_at', '!=', null)->avg('total_hours'),
        ];

        return view('attendance-records.summary', compact('employee', 'records', 'summary', 'startDate', 'endDate'));
    }
} 