<?php

namespace App\Policies;

use App\Models\SecuGenFingerprint;
use App\Models\User;
use Illuminate\Auth\Access\Response;

class SecuGenFingerprintPolicy
{
    /**
     * Determine whether the user can view any models.
     */
    public function viewAny(User $user): bool
    {
        return $user->can('view_any_fingerprint');
    }

    /**
     * Determine whether the user can view the model.
     */
    public function view(User $user, SecuGenFingerprint $secuGenFingerprint): bool
    {
        return $user->can('view_fingerprint');
    }

    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return $user->can('create_fingerprint');
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, SecuGenFingerprint $secuGenFingerprint): bool
    {
        return $user->can('update_fingerprint');
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, SecuGenFingerprint $secuGenFingerprint): bool
    {
        return $user->can('delete_fingerprint') || $user->can('delete_any_fingerprint');
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, SecuGenFingerprint $secuGenFingerprint): bool
    {
        return $user->can('restore_fingerprint');
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, SecuGenFingerprint $secuGenFingerprint): bool
    {
        return $user->can('force_delete_fingerprint');
    }
}
