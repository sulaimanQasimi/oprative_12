<?php

namespace App\Http\Controllers;

use App\Models\AttendanceSetting;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

class AttendanceSettingController extends Controller
{
    use AuthorizesRequests;

    /**
     * Display the attendance settings.
     */
    public function index()
    {
        $this->authorize('viewAny', AttendanceSetting::class);

        $settings = AttendanceSetting::getSettings();

        return view('attendance-settings.index', compact('settings'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        $this->authorize('create', AttendanceSetting::class);

        return view('attendance-settings.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create', AttendanceSetting::class);

        $validated = $request->validate([
            'enter_time' => 'required|date_format:H:i',
            'exit_time' => 'required|date_format:H:i|after:enter_time',
        ], [
            'exit_time.after' => 'Exit time must be after enter time.',
        ]);

        // Convert to full time format
        $validated['enter_time'] = $validated['enter_time'] . ':00';
        $validated['exit_time'] = $validated['exit_time'] . ':00';

        $settings = AttendanceSetting::create($validated);

        return redirect()->route('attendance-settings.index')
            ->with('success', 'Attendance settings created successfully.');
    }

    /**
     * Display the specified resource.
     */
    public function show(AttendanceSetting $attendanceSetting)
    {
        $this->authorize('view', $attendanceSetting);

        return view('attendance-settings.show', compact('attendanceSetting'));
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(AttendanceSetting $attendanceSetting)
    {
        $this->authorize('update', $attendanceSetting);

        return view('attendance-settings.edit', compact('attendanceSetting'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, AttendanceSetting $attendanceSetting = null)
    {
        // Get the global settings if no specific setting is provided
        if (!$attendanceSetting) {
            $attendanceSetting = AttendanceSetting::getSettings();
        }

        $this->authorize('update', $attendanceSetting);

        $validated = $request->validate([
            'enter_time' => 'required|date_format:H:i',
            'exit_time' => 'required|date_format:H:i|after:enter_time',
        ], [
            'exit_time.after' => 'Exit time must be after enter time.',
        ]);

        // Convert to full time format
        $validated['enter_time'] = $validated['enter_time'] . ':00';
        $validated['exit_time'] = $validated['exit_time'] . ':00';

        $attendanceSetting->update($validated);

        return redirect()->route('attendance-settings.index')
            ->with('success', 'Attendance settings updated successfully.');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(AttendanceSetting $attendanceSetting)
    {
        $this->authorize('delete', $attendanceSetting);

        $attendanceSetting->delete();

        return redirect()->route('attendance-settings.index')
            ->with('success', 'Attendance settings deleted successfully.');
    }

    /**
     * Reset settings to default values.
     */
    public function reset()
    {
        $this->authorize('update', AttendanceSetting::class);

        $settings = AttendanceSetting::getSettings();
        $settings->update([
            'enter_time' => '08:00:00',
            'exit_time' => '17:00:00',
        ]);

        return redirect()->route('attendance-settings.index')
            ->with('success', 'Attendance settings reset to default values.');
    }
} 