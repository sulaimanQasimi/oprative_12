<?php

namespace App\Http\Controllers;

use App\Models\AttendanceRequest;
use App\Models\Employee;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Validation\Rule;

class PublicAttendanceRequestController extends Controller
{
    /**
     * Show the public attendance request form
     */
    public function create()
    {
        return Inertia::render('Public/AttendanceRequest/Create');
    }

    /**
     * Store a newly created attendance request from public form
     */
    public function store(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string|exists:employees,employee_id',
            'date' => 'required|date|after_or_equal:today',
            'type' => ['required', Rule::in(['late', 'absent'])],
            'reason' => 'required|string|min:10|max:1000',
        ], [
            'employee_id.required' => 'Employee ID is required.',
            'employee_id.exists' => 'Employee ID not found in our records.',
            'date.after_or_equal' => 'You can only submit requests for today or future dates.',
            'reason.min' => 'Please provide a detailed reason (at least 10 characters).',
            'reason.max' => 'Reason is too long (maximum 1000 characters).',
        ]);

        // Get employee by employee_id
        $employee = Employee::where('employee_id', $request->employee_id)->first();

        if (!$employee) {
            return back()->withErrors([
                'employee_id' => 'Employee not found.'
            ]);
        }

        // Check if request already exists for this date and employee
        $existingRequest = AttendanceRequest::where('employee_id', $employee->id)
            ->where('date', $request->date)
            ->first();

        if ($existingRequest) {
            return back()->withErrors([
                'date' => 'A request has already been submitted for this employee on this date. Track Number: ' . $existingRequest->track_number
            ]);
        }

        $attendanceRequest = AttendanceRequest::create([
            'employee_id' => $employee->id,
            'date' => $request->date,
            'type' => $request->type,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('public.attendance-request.success', [
            'track_number' => $attendanceRequest->track_number
        ]);
    }

    /**
     * Show success page with track number
     */
    public function success($trackNumber)
    {
        $attendanceRequest = AttendanceRequest::with('employee')
            ->where('track_number', $trackNumber)
            ->firstOrFail();

        return Inertia::render('Public/AttendanceRequest/Success', [
            'attendanceRequest' => $attendanceRequest
        ]);
    }

    /**
     * Show the tracking page
     */
    public function track()
    {
        return Inertia::render('Public/AttendanceRequest/Track');
    }

    /**
     * Get tracking information by track number
     */
    public function getTrackingInfo(Request $request)
    {
        $request->validate([
            'track_number' => 'required|string|size:6'
        ]);

        $attendanceRequest = AttendanceRequest::with(['employee', 'reviewer'])
            ->where('track_number', $request->track_number)
            ->first();

        if (!$attendanceRequest) {
            return response()->json([
                'error' => 'Track number not found. Please check your track number and try again.'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'request' => [
                'track_number' => $attendanceRequest->track_number,
                'employee' => [
                    'employee_id' => $attendanceRequest->employee->employee_id,
                    'name' => $attendanceRequest->employee->full_name,
                    'department' => $attendanceRequest->employee->department,
                ],
                'date' => $attendanceRequest->date->format('Y-m-d'),
                'type' => $attendanceRequest->type,
                'reason' => $attendanceRequest->reason,
                'status' => $attendanceRequest->status,
                'submitted_at' => $attendanceRequest->created_at->format('Y-m-d H:i:s'),
                'reviewed_at' => $attendanceRequest->reviewed_at?->format('Y-m-d H:i:s'),
                'reviewer' => $attendanceRequest->reviewer?->name,
            ]
        ]);
    }

    /**
     * Get employee info by employee ID for the form
     */
    public function getEmployeeInfo(Request $request)
    {
        $request->validate([
            'employee_id' => 'required|string'
        ]);

        $employee = Employee::where('employee_id', $request->employee_id)->first();

        if (!$employee) {
            return response()->json([
                'error' => 'Employee not found with this ID.'.$request->employee_id
            ], 404);
        }

        return response()->json([
            'success' => true,
            'employee' => [
                'id' => $employee->id,
                'employee_id' => $employee->employee_id,
                'name' => $employee->full_name,
                'department' => $employee->department,
                'email' => $employee->email,
            ]
        ]);
    }
} 