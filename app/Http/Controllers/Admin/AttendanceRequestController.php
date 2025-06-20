<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceRequest;
use App\Models\Employee;
use App\Models\Attendance;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\Rule;

class AttendanceRequestController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Display a listing of attendance requests (Manager view)
     */
    public function index(Request $request)
    {
        // Check permissions
        if (!Auth::user()->can('view_any_attendance_request')) {
            abort(403, 'You do not have permission to view attendance requests.');
        }

        $query = AttendanceRequest::with(['employee', 'reviewer'])
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        if ($request->filled('date_from')) {
            $query->where('date', '>=', $request->date_from);
        }

        if ($request->filled('date_to')) {
            $query->where('date', '<=', $request->date_to);
        }

        if ($request->filled('employee_search')) {
            $search = $request->employee_search;
            $query->whereHas('employee', function ($q) use ($search) {
                $q->where('first_name', 'like', "%{$search}%")
                  ->orWhere('last_name', 'like', "%{$search}%")
                  ->orWhere('employee_id', 'like', "%{$search}%");
            });
        }

        $attendanceRequests = $query->paginate(15)->appends($request->query());

        return Inertia::render('Admin/AttendanceRequest/Index', [
            'attendanceRequests' => $attendanceRequests,
            'filters' => $request->only(['status', 'type', 'date_from', 'date_to', 'employee_search']),
            'permissions' => [
                'view_any_attendance_request' => Auth::user()->can('view_any_attendance_request'),
                'view_attendance_request' => Auth::user()->can('view_attendance_request'),
                'approve_attendance_request' => Auth::user()->can('approve_attendance_request'),
                'reject_attendance_request' => Auth::user()->can('reject_attendance_request'),
            ],
        ]);
    }

    /**
     * Display employee's own attendance requests
     */
    public function myRequests(Request $request)
    {
        // Get the employee record for the current user
        $employee = Employee::where('email', Auth::user()->email)->first();
        
        if (!$employee) {
            return redirect()->back()->with('error', 'Employee record not found.');
        }

        $query = AttendanceRequest::with(['reviewer'])
            ->where('employee_id', $employee->id)
            ->orderBy('created_at', 'desc');

        // Apply filters
        if ($request->filled('status')) {
            $query->where('status', $request->status);
        }

        if ($request->filled('type')) {
            $query->where('type', $request->type);
        }

        $attendanceRequests = $query->paginate(10)->appends($request->query());

        return Inertia::render('Admin/AttendanceRequest/MyRequests', [
            'attendanceRequests' => $attendanceRequests,
            'employee' => $employee,
            'filters' => $request->only(['status', 'type']),
        ]);
    }

    /**
     * Show the form for creating a new attendance request (Employee view)
     */
    public function create(Request $request)
    {
        $employee = Employee::where('email', Auth::user()->email)->first();
        
        if (!$employee) {
            return redirect()->back()->with('error', 'Employee record not found.');
        }

        // Get attendance records that might need justification
        $attendanceDate = $request->get('date', now()->format('Y-m-d'));
        
        return Inertia::render('Admin/AttendanceRequest/Create', [
            'employee' => $employee,
            'suggestedDate' => $attendanceDate,
            'suggestedType' => $request->get('type', 'absent'),
        ]);
    }

    /**
     * Store a newly created attendance request
     */
    public function store(Request $request)
    {
        $employee = Employee::where('email', Auth::user()->email)->first();
        
        if (!$employee) {
            return redirect()->back()->with('error', 'Employee record not found.');
        }

        $request->validate([
            'date' => 'required|date|before_or_equal:today',
            'type' => ['required', Rule::in(['late', 'absent'])],
            'reason' => 'required|string|min:10|max:1000',
        ], [
            'date.before_or_equal' => 'You cannot submit a request for future dates.',
            'reason.min' => 'Please provide a detailed reason (at least 10 characters).',
            'reason.max' => 'Reason is too long (maximum 1000 characters).',
        ]);

        // Check if request already exists for this date and employee
        $existingRequest = AttendanceRequest::where('employee_id', $employee->id)
            ->where('date', $request->date)
            ->first();

        if ($existingRequest) {
            return redirect()->back()->withErrors([
                'date' => 'You have already submitted a request for this date.'
            ]);
        }

        AttendanceRequest::create([
            'employee_id' => $employee->id,
            'date' => $request->date,
            'type' => $request->type,
            'reason' => $request->reason,
            'status' => 'pending',
        ]);

        return redirect()->route('admin.attendance-requests.my-requests')
            ->with('success', 'Your justification request has been submitted successfully.');
    }

    /**
     * Display the specified attendance request
     */
    public function show(AttendanceRequest $attendanceRequest)
    {
        if (!Auth::user()->can('view_attendance_request')) {
            abort(403, 'You do not have permission to view this attendance request.');
        }

        $attendanceRequest->load(['employee', 'reviewer']);

        return Inertia::render('Admin/AttendanceRequest/Show', [
            'attendanceRequest' => $attendanceRequest,
            'permissions' => [
                'approve_attendance_request' => Auth::user()->can('approve_attendance_request'),
                'reject_attendance_request' => Auth::user()->can('reject_attendance_request'),
            ],
        ]);
    }

    /**
     * Approve an attendance request
     */
    public function approve(Request $request, AttendanceRequest $attendanceRequest)
    {
        if (!Auth::user()->can('approve_attendance_request')) {
            abort(403, 'You do not have permission to approve attendance requests.');
        }

        if (!$attendanceRequest->canBeReviewed()) {
            return redirect()->back()->with('error', 'This request has already been reviewed.');
        }

        $request->validate([
            'comments' => 'nullable|string|max:500',
        ]);

        // Update the attendance request
        $attendanceRequest->update([
            'status' => 'accepted',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        // Update attendance record if exists
        $this->updateAttendanceRecord($attendanceRequest, 'excused');

        return redirect()->back()->with('success', 'Attendance request has been approved successfully.');
    }

    /**
     * Reject an attendance request
     */
    public function reject(Request $request, AttendanceRequest $attendanceRequest)
    {
        if (!Auth::user()->can('reject_attendance_request')) {
            abort(403, 'You do not have permission to reject attendance requests.');
        }

        if (!$attendanceRequest->canBeReviewed()) {
            return redirect()->back()->with('error', 'This request has already been reviewed.');
        }

        $request->validate([
            'comments' => 'required|string|min:5|max:500',
        ], [
            'comments.required' => 'Please provide a reason for rejection.',
            'comments.min' => 'Please provide a more detailed reason (at least 5 characters).',
        ]);

        $attendanceRequest->update([
            'status' => 'rejected',
            'reviewed_by' => Auth::id(),
            'reviewed_at' => now(),
        ]);

        return redirect()->back()->with('success', 'Attendance request has been rejected.');
    }

    /**
     * Update attendance record based on approval
     */
    private function updateAttendanceRecord(AttendanceRequest $attendanceRequest, string $status)
    {
        // Find attendance record for this employee and date
        $attendance = Attendance::where('employee_id', $attendanceRequest->employee_id)
            ->whereDate('date', $attendanceRequest->date)
            ->first();

        if ($attendance) {
            $attendance->update([
                'status' => 'P',
                'updated_at' => now(),
            ]);
        } else {
            // Create new attendance record if doesn't exist
            Attendance::create([
                'employee_id' => $attendanceRequest->employee_id,
                'date' => $attendanceRequest->date,
                'status' => $status,
                'check_in_time' => null,
                'check_out_time' => null,
            ]);
        }
    }

    /**
     * Get pending requests count for dashboard
     */
    public function getPendingCount()
    {
        if (!Auth::user()->can('view_any_attendance_request')) {
            return response()->json(['count' => 0]);
        }

        $count = AttendanceRequest::pending()->count();
        
        return response()->json(['count' => $count]);
    }

    /**
     * Bulk approve requests
     */
    public function bulkApprove(Request $request)
    {
        if (!Auth::user()->can('approve_attendance_request')) {
            abort(403, 'You do not have permission to approve attendance requests.');
        }

        $request->validate([
            'request_ids' => 'required|array',
            'request_ids.*' => 'exists:attendance_requests,id',
        ]);

        $updated = AttendanceRequest::whereIn('id', $request->request_ids)
            ->where('status', 'pending')
            ->update([
                'status' => 'accepted',
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

        // Update corresponding attendance records
        $approvedRequests = AttendanceRequest::whereIn('id', $request->request_ids)
            ->where('status', 'accepted')
            ->get();

        foreach ($approvedRequests as $attendanceRequest) {
            $this->updateAttendanceRecord($attendanceRequest, 'excused');
        }

        return redirect()->back()->with('success', "{$updated} attendance requests have been approved successfully.");
    }

    /**
     * Bulk reject requests
     */
    public function bulkReject(Request $request)
    {
        if (!Auth::user()->can('reject_attendance_request')) {
            abort(403, 'You do not have permission to reject attendance requests.');
        }

        $request->validate([
            'request_ids' => 'required|array',
            'request_ids.*' => 'exists:attendance_requests,id',
            'comments' => 'required|string|min:5|max:500',
        ]);

        $updated = AttendanceRequest::whereIn('id', $request->request_ids)
            ->where('status', 'pending')
            ->update([
                'status' => 'rejected',
                'reviewed_by' => Auth::id(),
                'reviewed_at' => now(),
            ]);

        return redirect()->back()->with('success', "{$updated} attendance requests have been rejected.");
    }
}
