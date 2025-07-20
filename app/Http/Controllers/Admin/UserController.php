<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;
use Illuminate\Support\Facades\Response;
use Spatie\Activitylog\Models\Activity;

class UserController extends Controller
{
    /**
     * Display a listing of users.
     */
    public function index(Request $request)
    {
        $this->authorize('view_any_user');

        $query = User::with(['roles', 'permissions']);

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'like', "%{$searchTerm}%")
                  ->orWhere('email', 'like', "%{$searchTerm}%");
            });
        }

        // Role filter
        if ($request->filled('role')) {
            $query->whereHas('roles', function ($q) use ($request) {
                $q->where('name', $request->role);
            });
        }

        // Include trashed users if user has permission
        if ($request->boolean('include_trashed') && auth()->user()->can('restore_user')) {
            $query->withTrashed();
        }

        // Only trashed users if requested
        if ($request->boolean('only_trashed') && auth()->user()->can('restore_user')) {
            $query->onlyTrashed();
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        $users = $query->paginate(
            $request->get('per_page', 15)
        )->appends($request->query());

        $roles = Role::with('permissions')->where('guard_name', 'web')->get();
        $permissions = Permission::where('guard_name', 'web')->get();

        return Inertia::render('Admin/Users/Index', [
            'users' => $users,
            'roles' => $roles,
            'permissions' => $permissions,
            'filters' => $request->only(['search', 'role', 'sort_by', 'sort_order', 'per_page', 'include_trashed', 'only_trashed']),
            'can' => [
                'create_user' => auth()->user()->can('create_user'),
                'view_user' => auth()->user()->can('view_user'),
                'update_user' => auth()->user()->can('update_user'),
                'delete_user' => auth()->user()->can('delete_user'),
                'restore_user' => auth()->user()->can('restore_user'),
                'force_delete_user' => auth()->user()->can('force_delete_user'),
                'export_user' => auth()->user()->can('export_user'),
                'import_user' => auth()->user()->can('import_user'),
                'assign_roles_user' => auth()->user()->can('assign_roles_user'),
                'manage_permissions_user' => auth()->user()->can('manage_permissions_user'),
                'impersonate_user' => auth()->user()->can('impersonate_user'),
                'view_activity_log_user' => auth()->user()->can('view_activity_log_user'),
            ],
        ]);
    }

    /**
     * Show the form for creating a new user.
     */
    public function create()
    {
        $this->authorize('create_user');

        $roles = Role::with('permissions')->where('guard_name', 'web')->get();
        $permissions = Permission::where('guard_name', 'web')->get();

        return Inertia::render('Admin/Users/Create', [
            'roles' => $roles,
            'permissions' => $permissions,
            'can' => [
                'assign_roles_user' => auth()->user()->can('assign_roles_user'),
                'manage_permissions_user' => auth()->user()->can('manage_permissions_user'),
            ],
        ]);
    }

    /**
     * Store a newly created user in storage.
     */
    public function store(Request $request)
    {
        $this->authorize('create_user');

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => ['required', 'confirmed', Rules\Password::defaults()],
            'chat_id' => 'nullable|string|max:255',
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'chat_id' => $request->chat_id,
            'email_verified_at' => now(),
        ]);

        // Assign roles if provided and user has permission
        if ($request->filled('roles') && auth()->user()->can('assign_roles_user')) {
            $roleNames = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->assignRole($roleNames);
        }

        // Assign permissions if provided and user has permission
        if ($request->filled('permissions') && auth()->user()->can('manage_permissions_user')) {
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name')->toArray();
            $user->givePermissionTo($permissionNames);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User created successfully.');
    }

    /**
     * Display the specified user.
     */
    public function show(User $user)
    {
        $this->authorize('view_user');

        $user->load(['roles.permissions', 'permissions']);

        return Inertia::render('Admin/Users/Show', [
            'user' => $user,
            'can' => [
                'update_user' => auth()->user()->can('update_user'),
                'delete_user' => auth()->user()->can('delete_user'),
                'assign_roles_user' => auth()->user()->can('assign_roles_user'),
                'manage_permissions_user' => auth()->user()->can('manage_permissions_user'),
                'impersonate_user' => auth()->user()->can('impersonate_user'),
                'view_activity_log_user' => auth()->user()->can('view_activity_log_user'),
            ],
        ]);
    }

    /**
     * Show the form for editing the specified user.
     */
    public function edit(User $user)
    {
        $this->authorize('update_user');

        $user->load(['roles.permissions', 'permissions']);
        $roles = Role::with('permissions')->where('guard_name', 'web')->get();
        $permissions = Permission::where('guard_name', 'web')->get();

        return Inertia::render('Admin/Users/Edit', [
            'user' => $user,
            'roles' => $roles,
            'permissions' => $permissions,
            'can' => [
                'assign_roles_user' => auth()->user()->can('assign_roles_user'),
                'manage_permissions_user' => auth()->user()->can('manage_permissions_user'),
            ],
        ]);
    }

    /**
     * Update the specified user in storage.
     */
    public function update(Request $request, User $user)
    {
        $this->authorize('update_user');

        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email,' . $user->id,
            'password' => ['nullable', 'confirmed', Rules\Password::defaults()],
            'chat_id' => 'nullable|string|max:255',
            'roles' => 'array',
            'permissions' => 'array',
        ]);

        $user->update([
            'name' => $request->name,
            'email' => $request->email,
            'chat_id' => $request->chat_id,
        ]);

        // Update password if provided
        if ($request->filled('password')) {
            $user->update([
                'password' => Hash::make($request->password),
            ]);
        }

        // Sync roles if user has permission
        if ($request->has('roles') && auth()->user()->can('assign_roles_user')) {
            $roleNames = Role::whereIn('id', $request->roles)->pluck('name')->toArray();
            $user->syncRoles($roleNames);
        }

        // Sync permissions if user has permission
        if ($request->has('permissions') && auth()->user()->can('manage_permissions_user')) {
            $permissionNames = Permission::whereIn('id', $request->permissions)->pluck('name')->toArray();
            $user->syncPermissions($permissionNames);
        }

        return redirect()->route('admin.users.index')
            ->with('success', 'User updated successfully.');
    }

    /**
     * Remove the specified user from storage.
     */
    public function destroy(User $user)
    {
        $this->authorize('delete_user');

        // Prevent self-deletion
        if (Auth::check() && Auth::user()->id === $user->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot delete your own account.');
        }

        $user->delete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User deleted successfully.');
    }

    /**
     * Restore the specified user from trash.
     */
    public function restore(User $user)
    {
        $this->authorize('restore_user');

        $user->restore();

        return redirect()->route('admin.users.index')
            ->with('success', 'User restored successfully.');
    }

    /**
     * Permanently delete the specified user.
     */
    public function forceDelete(User $user)
    {
        $this->authorize('force_delete_user');

        // Prevent self-deletion
        if (Auth::check() && Auth::user()->id === $user->id) {
            return redirect()->route('admin.users.index')
                ->with('error', 'You cannot permanently delete your own account.');
        }

        $user->forceDelete();

        return redirect()->route('admin.users.index')
            ->with('success', 'User permanently deleted.');
    }

    /**
     * Export users data.
     */
    public function export(Request $request)
    {
        $this->authorize('export_user');

        $users = User::with(['roles', 'permissions'])
            ->when($request->filled('search'), function ($query) use ($request) {
                $searchTerm = $request->search;
                $query->where(function ($q) use ($searchTerm) {
                    $q->where('name', 'like', "%{$searchTerm}%")
                      ->orWhere('email', 'like', "%{$searchTerm}%");
                });
            })
            ->get();

        $csvData = [];
        $csvData[] = ['ID', 'Name', 'Email', 'Chat ID', 'Roles', 'Permissions', 'Created At'];

        foreach ($users as $user) {
            $csvData[] = [
                $user->id,
                $user->name,
                $user->email,
                $user->chat_id,
                $user->roles->pluck('name')->implode(', '),
                $user->permissions->pluck('name')->implode(', '),
                $user->created_at->format('Y-m-d H:i:s'),
            ];
        }

        $filename = 'users_export_' . date('Y-m-d_H-i-s') . '.csv';

        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function () use ($csvData) {
            $file = fopen('php://output', 'w');
            foreach ($csvData as $row) {
                fputcsv($file, $row);
            }
            fclose($file);
        };

        return Response::stream($callback, 200, $headers);
    }

    /**
     * Show import form.
     */
    public function importForm()
    {
        $this->authorize('import_user');

        return Inertia::render('Admin/Users/Import');
    }

    /**
     * Import users from CSV file.
     */
    public function import(Request $request)
    {
        $this->authorize('import_user');

        $request->validate([
            'file' => 'required|file|mimes:csv,txt|max:2048',
        ]);

        $file = $request->file('file');
        $path = $file->getRealPath();
        $data = array_map('str_getcsv', file($path));
        $header = array_shift($data);

        $imported = 0;
        $errors = [];

        foreach ($data as $row) {
            try {
                $userData = array_combine($header, $row);
                
                // Basic validation
                if (empty($userData['name']) || empty($userData['email'])) {
                    $errors[] = "Row skipped: Name and email are required";
                    continue;
                }

                if (User::where('email', $userData['email'])->exists()) {
                    $errors[] = "User with email {$userData['email']} already exists";
                    continue;
                }

                $user = User::create([
                    'name' => $userData['name'],
                    'email' => $userData['email'],
                    'password' => Hash::make($userData['password'] ?? 'password123'),
                    'chat_id' => $userData['chat_id'] ?? null,
                    'email_verified_at' => now(),
                ]);

                // Assign roles if specified and user has permission
                if (!empty($userData['roles']) && auth()->user()->can('assign_roles_user')) {
                    $roleNames = array_map('trim', explode(',', $userData['roles']));
                    $validRoles = Role::whereIn('name', $roleNames)->pluck('name')->toArray();
                    if (!empty($validRoles)) {
                        $user->assignRole($validRoles);
                    }
                }

                $imported++;
            } catch (\Exception $e) {
                $errors[] = "Error importing row: " . $e->getMessage();
            }
        }

        $message = "Imported {$imported} users successfully.";
        if (!empty($errors)) {
            $message .= " Errors: " . implode(', ', array_slice($errors, 0, 5));
            if (count($errors) > 5) {
                $message .= " and " . (count($errors) - 5) . " more.";
            }
        }

        return redirect()->route('admin.users.index')->with('success', $message);
    }

    /**
     * Assign a role to user.
     */
    public function assignRole(Request $request, User $user)
    {
        $this->authorize('assign_roles_user');

        $request->validate([
            'role' => 'required|exists:roles,name',
        ]);

        $user->assignRole($request->role);

        return redirect()->back()
            ->with('success', 'Role assigned successfully.');
    }

    /**
     * Remove a role from user.
     */
    public function removeRole(User $user, Role $role)
    {
        $this->authorize('assign_roles_user');

        $user->removeRole($role);

        return redirect()->back()
            ->with('success', 'Role removed successfully.');
    }

    /**
     * Assign permissions to user.
     */
    public function assignPermissions(Request $request, User $user)
    {
        $this->authorize('manage_permissions_user');

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user->givePermissionTo($request->permissions);

        return redirect()->back()
            ->with('success', 'Permissions assigned successfully.');
    }

    /**
     * Remove permissions from user.
     */
    public function removePermissions(Request $request, User $user)
    {
        $this->authorize('manage_permissions_user');

        $request->validate([
            'permissions' => 'required|array',
            'permissions.*' => 'exists:permissions,name',
        ]);

        $user->revokePermissionTo($request->permissions);

        return redirect()->back()
            ->with('success', 'Permissions removed successfully.');
    }

    /**
     * Impersonate a user.
     */
    public function impersonate(User $user)
    {
        $this->authorize('impersonate_user');

        // Prevent self-impersonation
        if (Auth::check() && Auth::user()->id === $user->id) {
            return redirect()->back()
                ->with('error', 'You cannot impersonate yourself.');
        }

        // Store original user ID in session
        session(['impersonating_user_id' => Auth::id()]);
        
        // Login as the target user
        Auth::login($user);

        return redirect()->route('admin.dashboard')
            ->with('success', "You are now impersonating {$user->name}.");
    }

    /**
     * Stop impersonating and return to original user.
     */
    public function stopImpersonating()
    {
        if (!session()->has('impersonating_user_id')) {
            return redirect()->route('admin.dashboard');
        }

        $originalUserId = session('impersonating_user_id');
        $originalUser = User::find($originalUserId);

        if ($originalUser) {
            session()->forget('impersonating_user_id');
            Auth::login($originalUser);
            
            return redirect()->route('admin.users.index')
                ->with('success', 'Stopped impersonating user.');
        }

        return redirect()->route('admin.dashboard');
    }

    /**
     * View activity log for a user.
     */
    public function activityLog(User $user)
    {
        $this->authorize('view_activity_log_user');

        $activities = Activity::where('causer_id', $user->id)
            ->orWhere('subject_id', $user->id)
            ->orWhere('subject_type', User::class)
            ->with(['causer', 'subject'])
            ->orderBy('created_at', 'desc')
            ->paginate(20);

        return Inertia::render('Admin/Users/ActivityLog', [
            'user' => $user,
            'activities' => $activities,
        ]);
    }
} 