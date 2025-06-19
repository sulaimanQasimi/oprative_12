<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\AttendanceSetting;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\Auth;

class AttendanceSettingController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = AttendanceSetting::query();

        // Apply search filter
        if ($request->has('search')) {
            $search = $request->input('search');
            $query->where(function ($q) use ($search) {
                $q->where('enter_time', 'like', "%{$search}%")
                    ->orWhere('exit_time', 'like', "%{$search}%")
                    ->orWhere('date', 'like', "%{$search}%");
            });
        }

        // Apply sorting
        $sortField = $request->input('sort_field', 'created_at');
        $sortDirection = $request->input('sort_direction', 'desc');
        $query->orderBy($sortField, $sortDirection);

        // Get paginated results
        $attendanceSettings = $query->paginate(10)->withQueryString();

        return Inertia::render('Admin/AttendanceSetting/Index', [
            'attendanceSettings' => $attendanceSettings,
            'filters' => $request->only(['search', 'sort_field', 'sort_direction']),
            'permissions' => [
                'create_attendance_setting' => Auth::user()->can('create_attendance_setting'),
                'update_attendance_setting' => Auth::user()->can('update_attendance_setting'),
                'delete_attendance_setting' => Auth::user()->can('delete_attendance_setting'),
                'view_attendance_setting' => Auth::user()->can('view_attendance_setting'),
            ]
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return Inertia::render('Admin/AttendanceSetting/Create', [
            'permissions' => [
                'create_attendance_setting' => true, // Already authorized
            ]
        ]);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'enter_time' => 'required',
            'exit_time' => 'required',
            'date' => 'nullable|date',
        ]);

        AttendanceSetting::create($validated);

        return redirect()->route('admin.attendance-settings.index')
            ->with('success', 'Attendance setting created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceSetting $attendanceSetting)
    {
        return Inertia::render('Admin/AttendanceSetting/Show', [
            'attendanceSetting' => $attendanceSetting,
            'permissions' => [
                'view_attendance_setting' => true, // Already authorized
                'update_attendance_setting' => Auth::user()->can('update_attendance_setting'),
                'delete_attendance_setting' => Auth::user()->can('delete_attendance_setting'),
            ]
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceSetting $attendanceSetting)
    {
        return Inertia::render('Admin/AttendanceSetting/Edit', [
            'attendanceSetting' => $attendanceSetting,
            'permissions' => [
                'view_attendance_setting' => true, // Already authorized
                'update_attendance_setting' => true, // Already authorized
                'delete_attendance_setting' => Auth::user()->can('delete_attendance_setting'),
            ]
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceSetting $attendanceSetting)
    {
        $validated = $request->validate([
            'enter_time' => 'required',
            'exit_time' => 'required',
            'date' => 'nullable|date',
        ]);

        $attendanceSetting->update($validated);

        return redirect()->route('admin.attendance-settings.index')
            ->with('success', 'Attendance setting updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceSetting $attendanceSetting)
    {
        $attendanceSetting->delete();

        return redirect()->route('admin.attendance-settings.index')
            ->with('success', 'Attendance setting deleted successfully.');
    }
}
