<?php

namespace App\Policies;

use App\Models\AttendanceRequest;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class AttendanceRequestPolicy
{
    /**
     * Create a new policy instance.
     */
    public function __construct()
    {
        //
    }

    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->hasPermissionTo('view_any_attendance_request');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('view_attendance_request');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->hasPermissionTo('create_attendance_request');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('update_attendance_request');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('delete_attendance_request');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('restore_attendance_request');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('force_delete_attendance_request');
    }

    /**
     * Determine whether the user can approve attendance requests.
     */
    public function approve(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('approve_attendance_request') && 
               $attendanceRequest->isPending();
    }

    /**
     * Determine whether the user can reject attendance requests.
     */
    public function reject(User $user, AttendanceRequest $attendanceRequest): bool
    {
        return $user->hasPermissionTo('reject_attendance_request') && 
               $attendanceRequest->isPending();
    }

    /**
     * Determine whether the user can view their own requests.
     */
    public function viewOwn(User $user): bool
    {
        return $user->hasPermissionTo('view_own_attendance_request');
    }

    /**
     * Determine whether the user can create their own requests.
     */
    public function createOwn(User $user): bool
    {
        return $user->hasPermissionTo('create_own_attendance_request');
    }
}
