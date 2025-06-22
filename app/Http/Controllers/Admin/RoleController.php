<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;

class RoleController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth');
        $this->middleware('permission:view_any_role')->only(['index']);
        $this->middleware('permission:view_role')->only(['show']);
        $this->middleware('permission:create_role')->only(['create', 'store']);
        $this->middleware('permission:update_role')->only(['edit', 'update', 'assignPermission', 'removePermission']);
        $this->middleware('permission:delete_role')->only(['destroy']);
        $this->middleware('permission:restore_role')->only(['restore']);
        $this->middleware('permission:force_delete_role')->only(['forceDelete']);
    }

    public function index(Request $request)
    {
        // Only show web guard roles
        $query = Role::where('guard_name', 'web')->with('permissions');

        // Search functionality
        if ($request->filled('search')) {
            $searchTerm = $request->search;
            $query->where(function ($q) use ($searchTerm) {
                $q->where('name', 'LIKE', "%{$searchTerm}%")
                  ->orWhereHas('permissions', function ($permQuery) use ($searchTerm) {
                      $permQuery->where('name', 'LIKE', "%{$searchTerm}%");
                  });
            });
        }

        // Sorting
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        
        if (in_array($sortBy, ['name', 'created_at', 'updated_at'])) {
            $query->orderBy($sortBy, $sortOrder);
        }

        // Filter by permission count
        if ($request->filled('min_permissions')) {
            $query->has('permissions', '>=', (int) $request->min_permissions);
        }

        if ($request->filled('max_permissions')) {
            $query->has('permissions', '<=', (int) $request->max_permissions);
        }

        // Handle export
        if ($request->filled('export') && $request->export === 'true') {
            $roles = $query->get();
            return $this->exportRoles($roles, $request);
        }

        // Pagination
        $perPage = $request->get('per_page', 15);
        $roles = $query->paginate($perPage)->withQueryString();

        // Get statistics
        $totalRoles = Role::where('guard_name', 'web')->count();
        $totalPermissions = Permission::where('guard_name', 'web')->count();
        $rolesWithPermissions = Role::where('guard_name', 'web')->has('permissions')->count();

        return Inertia::render('Admin/Role/Index', [
            'roles' => $roles,
            'filters' => $request->only(['search', 'sort_by', 'sort_order', 'min_permissions', 'max_permissions', 'per_page']),
            'statistics' => [
                'total_roles' => $totalRoles,
                'total_permissions' => $totalPermissions,
                'roles_with_permissions' => $rolesWithPermissions,
                'average_permissions' => $totalRoles > 0 ? round(
                    Role::where('guard_name', 'web')->withCount('permissions')->get()->avg('permissions_count')
                ) : 0
            ]
        ]);
    }

    /**
     * Export roles to CSV
     */
    private function exportRoles($roles, $request)
    {
        $filename = 'roles_export_' . date('Y-m-d_H-i-s') . '.csv';
        
        $headers = [
            'Content-Type' => 'text/csv',
            'Content-Disposition' => 'attachment; filename="' . $filename . '"',
        ];

        $callback = function() use ($roles) {
            $file = fopen('php://output', 'w');
            
            // Add BOM for proper UTF-8 encoding in Excel
            fwrite($file, "\xEF\xBB\xBF");
            
            // Add CSV headers
            fputcsv($file, [
                'ID',
                'Role Name',
                'Guard Name',
                'Permissions Count',
                'Permissions',
                'Created At',
                'Updated At'
            ]);

            // Add data rows
            foreach ($roles as $role) {
                $permissions = $role->permissions->pluck('name')->join(', ');
                
                fputcsv($file, [
                    $role->id,
                    $role->name,
                    $role->guard_name,
                    $role->permissions->count(),
                    $permissions,
                    $role->created_at->format('Y-m-d H:i:s'),
                    $role->updated_at->format('Y-m-d H:i:s')
                ]);
            }

            fclose($file);
        };

        return response()->stream($callback, 200, $headers);
    }

    public function create()
    {
        // Only show web guard permissions
        $permissions = Permission::where('guard_name', 'web')->orderBy('name')->get();
        
        return Inertia::render('Admin/Role/Create', [
            'permissions' => $permissions
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name',
            'guard_name' => 'nullable|string|in:web',
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        // Ensure web guard
        $validated['guard_name'] = 'web';

        $role = Role::create([
            'name' => $validated['name'],
            'guard_name' => $validated['guard_name']
        ]);

        if (!empty($validated['permissions'])) {
            // Only sync web guard permissions
            $webPermissions = Permission::where('guard_name', 'web')
                ->whereIn('name', $validated['permissions'])
                ->pluck('name')
                ->toArray();
            $role->syncPermissions($webPermissions);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role created successfully.');
    }

    public function show(Role $role)
    {
        // Ensure role is web guard
        if ($role->guard_name !== 'web') {
            abort(404);
        }

        $role->load('permissions');
        
        return Inertia::render('Admin/Role/Show', [
            'role' => $role
        ]);
    }

    public function edit(Role $role)
    {
        // Ensure role is web guard
        if ($role->guard_name !== 'web') {
            abort(404);
        }

        $permissions = Permission::where('guard_name', 'web')->orderBy('name')->get();
        $role->load('permissions');
        
        return Inertia::render('Admin/Role/Edit', [
            'role' => $role,
            'permissions' => $permissions
        ]);
    }

    public function update(Request $request, Role $role)
    {
        // Ensure role is web guard
        if ($role->guard_name !== 'web') {
            abort(404);
        }

        $validated = $request->validate([
            'name' => 'required|string|max:255|unique:roles,name,' . $role->id,
            'permissions' => 'nullable|array',
            'permissions.*' => 'string|exists:permissions,name'
        ]);

        $role->update(['name' => $validated['name']]);

        if (isset($validated['permissions'])) {
            // Only sync web guard permissions
            $webPermissions = Permission::where('guard_name', 'web')
                ->whereIn('name', $validated['permissions'])
                ->pluck('name')
                ->toArray();
            $role->syncPermissions($webPermissions);
        } else {
            $role->syncPermissions([]);
        }

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role updated successfully.');
    }

    public function destroy(Role $role)
    {
        // Ensure role is web guard
        if ($role->guard_name !== 'web') {
            abort(404);
        }

        // Prevent deletion of super important roles
        $protectedRoles = ['super-admin', 'admin'];
        if (in_array($role->name, $protectedRoles)) {
            return back()->with('error', 'This role cannot be deleted.');
        }

        $role->delete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role deleted successfully.');
    }

    public function restore($id)
    {
        $role = Role::withTrashed()->where('guard_name', 'web')->findOrFail($id);
        $role->restore();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role restored successfully.');
    }

    public function forceDelete($id)
    {
        $role = Role::withTrashed()->where('guard_name', 'web')->findOrFail($id);
        
        // Prevent force deletion of super important roles
        $protectedRoles = ['super-admin', 'admin'];
        if (in_array($role->name, $protectedRoles)) {
            return back()->with('error', 'This role cannot be permanently deleted.');
        }

        $role->forceDelete();

        return redirect()->route('admin.roles.index')
            ->with('success', 'Role permanently deleted.');
    }

    public function assignPermission(Request $request, Role $role)
    {
        // Ensure role is web guard
        if ($role->guard_name !== 'web') {
            abort(404);
        }

        $validated = $request->validate([
            'permission' => 'required|string|exists:permissions,name'
        ]);

        // Ensure permission is web guard
        $permission = Permission::where('guard_name', 'web')
            ->where('name', $validated['permission'])
            ->first();

        if (!$permission) {
            return back()->with('error', 'Permission not found.');
        }

        $role->givePermissionTo($permission);

        return back()->with('success', 'Permission assigned successfully.');
    }

    public function removePermission(Role $role, Permission $permission)
    {
        // Ensure both role and permission are web guard
        if ($role->guard_name !== 'web' || $permission->guard_name !== 'web') {
            abort(404);
        }

        $role->revokePermissionTo($permission);

        return back()->with('success', 'Permission removed successfully.');
    }
} 