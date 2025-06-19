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
                'fingerprint_template' => $employee->biometric ? $employee->biometric->TemplateBase64 : null,
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
            'fingerprint_score' => 'required|numeric|min:30'
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

    /**
     * Show the manual attendance management page.
     */
    public function manualAttendance(Request $request)
    {
        $search = $request->get('search');
        $department = $request->get('department');
        $date = $request->get('date', Carbon::today()->format('Y-m-d'));
        $status = $request->get('status');
        $perPage = $request->get('per_page', 15);

        // Get all employees with pagination
        $employeesQuery = Employee::with(['attendances' => function($query) use ($date) {
            $query->where('date', $date);
        }]);

        // Apply search filter
        if ($search) {
            $employeesQuery->where(function($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%")
                      ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$search}%"]);
            });
        }

        // Apply department filter
        if ($department) {
            $employeesQuery->where('department', $department);
        }

        $employees = $employeesQuery->paginate($perPage);

                // Transform employees data to include attendance for the selected date
        $attendanceData = [];
        foreach ($employees as $employee) {
            $attendance = $employee->attendances->first();

            $attendanceRecord = (object) [
                'employee' => $employee,
                'date' => $date,
                'enter_time' => $attendance ? $attendance->enter_time : null,
                'exit_time' => $attendance ? $attendance->exit_time : null,
                'id' => $attendance ? $attendance->id : null,
            ];

            // Apply status filter
            $includeRecord = true;
            if ($status) {
                switch ($status) {
                    case 'present':
                        $includeRecord = $attendanceRecord->enter_time !== null;
                        break;
                    case 'absent':
                        $includeRecord = $attendanceRecord->enter_time === null;
                        break;
                    case 'incomplete':
                        $includeRecord = $attendanceRecord->enter_time !== null && $attendanceRecord->exit_time === null;
                        break;
                }
            }

            if ($includeRecord) {
                $attendanceData[] = $attendanceRecord;
            }
        }

        // Get all departments for filter dropdown
        $departments = Employee::distinct()->pluck('department')->filter()->sort()->values();
        return Inertia::render('Admin/Employee/ManualAttendance', [
            'attendances' => $attendanceData,
            'employees' => $employees->items(),
            'departments' => $departments,
            'filters' => [
                'search' => $search,
                'department' => $department,
                'date' => $date,
                'status' => $status,
            ],
            'pagination' => [
                'current_page' => $employees->currentPage(),
                'last_page' => $employees->lastPage(),
                'per_page' => $employees->perPage(),
                'total' => $employees->total(),
                'from' => $employees->firstItem(),
                'to' => $employees->lastItem(),
            ]
        ]);
    }

    /**
     * Record manual attendance.
     */
    public function recordManualAttendance(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|integer|exists:employees,id',
            'action' => 'required|in:check_in,check_out',
            'verification_method' => 'required|string',
        ]);

        $employee = Employee::find($request->employee_id);
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
                    'message' => 'Employee already checked in today'
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
                'message' => 'Manual check-in successful',
                'attendance' => [
                    'id' => $attendance->id,
                    'check_in' => $attendance->enter_time,
                    'check_out' => null,
                    'date' => $attendance->date,
                ],
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
                'message' => 'Manual check-out successful',
                'attendance' => [
                    'id' => $existingAttendance->id,
                    'check_in' => $existingAttendance->enter_time,
                    'check_out' => $existingAttendance->exit_time,
                    'date' => $existingAttendance->date,
                ],
                'verification_method' => $request->verification_method
            ]);
        }
    }

    /**
     * Show the monthly attendance report page.
     */
    public function attendanceReport(Request $request)
    {
        $year = $request->get('year', now()->year);
        $month = $request->get('month', now()->month);
        $department = $request->get('department');
        $search = $request->get('search');
        $export = $request->get('export');

        // Create start and end dates for the month
        $startOfMonth = Carbon::createFromDate($year, $month, 1)->startOfMonth();
        $endOfMonth = Carbon::createFromDate($year, $month, 1)->endOfMonth();
        $daysInMonth = $endOfMonth->day;

        // Get employees with filters
        $employeesQuery = Employee::query();

        if ($search) {
            $employeesQuery->where(function($query) use ($search) {
                $query->where('first_name', 'like', "%{$search}%")
                      ->orWhere('last_name', 'like', "%{$search}%")
                      ->orWhere('employee_id', 'like', "%{$search}%")
                      ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$search}%"]);
            });
        }

        if ($department) {
            $employeesQuery->where('department', $department);
        }

        $employees = $employeesQuery->orderBy('first_name')->get();

        // Get attendance data for the month
        $attendanceData = [];
        $totalPresent = 0;
        $totalAbsent = 0;

        foreach ($employees as $employee) {
            $employeeAttendances = Attendance::where('employee_id', $employee->id)
                ->whereBetween('date', [$startOfMonth->format('Y-m-d'), $endOfMonth->format('Y-m-d')])
                ->get()
                ->keyBy(function($item) {
                    return Carbon::parse($item->date)->day;
                });

            // Create attendance records for each day of the month
            for ($day = 1; $day <= 31; $day++) {
                if ($day <= $daysInMonth) {
                    $currentDate = Carbon::createFromDate($year, $month, $day);
                    $attendance = $employeeAttendances->get($day);

                    $attendanceRecord = [
                        'employee_id' => $employee->id,
                        'day' => $day,
                        'date' => $currentDate->format('Y-m-d'),
                        'enter_time' => $attendance ? $attendance->enter_time?->format('H:i') : null,
                        'exit_time' => $attendance ? $attendance->exit_time?->format('H:i') : null,
                    ];

                    $attendanceData[] = $attendanceRecord;

                    // Count stats
                    if ($attendance && $attendance->enter_time) {
                        $totalPresent++;
                    } else {
                        // Don't count Fridays as absent (dayOfWeek: 0=Sunday, 5=Friday)
                        $dayOfWeek = $currentDate->dayOfWeek;
                        if ($dayOfWeek !== 5) { // Not Friday
                            $totalAbsent++;
                        }
                    }
                }
            }
        }

        // Calculate month info with day of week information
        $dayOfWeeks = [];
        $workingDays = 0;

        for ($day = 1; $day <= $daysInMonth; $day++) {
            $currentDate = Carbon::createFromDate($year, $month, $day);
            $dayOfWeek = $currentDate->dayOfWeek; // 0=Sunday, 5=Friday, 6=Saturday

            // Convert to Persian week (0=Saturday, 6=Friday)
            $persianDayOfWeek = ($dayOfWeek + 1) % 7;
            $dayOfWeeks[] = $persianDayOfWeek;

            if ($persianDayOfWeek !== 6) { // Not Friday
                $workingDays++;
            }
        }

        $monthInfo = [
            'daysInMonth' => $daysInMonth,
            'dayOfWeeks' => $dayOfWeeks,
            'workingDays' => $workingDays,
            'persianMonthName' => $this->getPersianMonthName($month),
            'year' => $year,
            'month' => $month,
        ];

        $stats = [
            'totalPresent' => $totalPresent,
            'totalAbsent' => $totalAbsent,
            'workingDays' => $workingDays * $employees->count(),
        ];

        // Get departments for filter
        $departments = Employee::distinct()->pluck('department')->filter()->sort()->values();

        // Handle Excel export
        if ($export === 'excel') {
            return $this->exportAttendanceExcel($employees, $attendanceData, $monthInfo);
        }

        return Inertia::render('Admin/Employee/AttendanceReport', [
            'attendanceData' => $attendanceData,
            'employees' => $employees,
            'departments' => $departments,
            'filters' => [
                'year' => $year,
                'month' => $month,
                'department' => $department,
                'search' => $search,
            ],
            'monthInfo' => $monthInfo,
            'stats' => $stats,
        ]);
    }

    /**
     * Get Persian month name.
     */
    private function getPersianMonthName($month)
    {
        $persianMonths = [
            1 => 'فروردین', 2 => 'اردیبهشت', 3 => 'خرداد', 4 => 'تیر',
            5 => 'مرداد', 6 => 'شهریور', 7 => 'مهر', 8 => 'آبان',
            9 => 'آذر', 10 => 'دی', 11 => 'بهمن', 12 => 'اسفند'
        ];

        return $persianMonths[$month] ?? 'نامشخص';
    }

    /**
     * Export attendance report to Excel.
     */
    private function exportAttendanceExcel($employees, $attendanceData, $monthInfo)
    {
        // Create a simple CSV export
        $filename = "attendance_report_{$monthInfo['year']}_{$monthInfo['month']}.csv";

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => "attachment; filename=\"$filename\"",
        ];

        $callback = function() use ($employees, $attendanceData, $monthInfo) {
            $file = fopen('php://output', 'w');

            // CSV Header
            $header = ['نام کارمند', 'شماره پرسنلی', 'بخش'];
            for ($day = 1; $day <= 31; $day++) {
                $header[] = $day;
            }
            $header[] = 'مجموع حضور';
            fputcsv($file, $header);

            // Employee rows
            foreach ($employees as $employee) {
                $row = [
                    $employee->first_name . ' ' . $employee->last_name,
                    $employee->employee_id,
                    $employee->department
                ];

                $presentCount = 0;
                for ($day = 1; $day <= 31; $day++) {
                    $attendance = collect($attendanceData)->first(function($a) use ($employee, $day) {
                        return $a['employee_id'] === $employee->id && $a['day'] === $day;
                    });

                    if ($attendance && $attendance['enter_time']) {
                        $row[] = '✓';
                        $presentCount++;
                    } elseif ($day <= $monthInfo['daysInMonth']) {
                        $dayOfWeek = $monthInfo['dayOfWeeks'][$day - 1] ?? 0;
                        $row[] = $dayOfWeek === 6 ? 'ج' : '✗'; // Friday or Absent
                    } else {
                        $row[] = ''; // Day doesn't exist in month
                    }
                }

                $row[] = $presentCount;
                fputcsv($file, $row);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }
}
