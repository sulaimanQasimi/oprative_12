# Supplier Permissions Implementation - Complete Guide

## Overview

This document outlines the complete implementation of the permissions system for the Supplier module in the Oprative application. The implementation follows the same pattern as the Unit module and provides comprehensive access control for all supplier-related operations.

## Permissions Structure

The following permissions have been implemented for the Supplier module:

1. **view_any_supplier** - View the supplier list/index page
2. **view_supplier** - View individual supplier details
3. **create_supplier** - Create new suppliers
4. **update_supplier** - Edit/update existing suppliers
5. **delete_supplier** - Soft delete suppliers
6. **restore_supplier** - Restore soft-deleted suppliers
7. **force_delete_supplier** - Permanently delete suppliers

## Implementation Details

### 1. Backend Implementation

#### SupplierController.php
- **Location**: `app/Http/Controllers/Admin/SupplierController.php`
- **Middleware Protection**: All methods are protected with appropriate permission middleware
- **Permission Passing**: All methods pass permission data to frontend via `$permissions` array
- **Model Binding**: All routes use Laravel model binding for consistency and security

Key features:
```php
// Middleware protection in constructor
$this->middleware('can:view_any_supplier')->only(['index']);
$this->middleware('can:view_supplier,supplier')->only(['show']);
$this->middleware('can:create_supplier')->only(['create', 'store']);
$this->middleware('can:update_supplier,supplier')->only(['edit', 'update']);
$this->middleware('can:delete_supplier,supplier')->only(['destroy']);
$this->middleware('can:restore_supplier,supplier')->only(['restore']);
$this->middleware('can:force_delete_supplier,supplier')->only(['forceDelete']);

// Permission data passed to frontend
$permissions = [
    'can_create' => Gate::allows('create_supplier'),
    'can_update' => Gate::allows('update_supplier', $supplier),
    'can_delete' => Gate::allows('delete_supplier', $supplier),
    'can_view' => Gate::allows('view_supplier', $supplier),
];
```

#### SupplierPolicy.php
- **Location**: `app/Policies/SupplierPolicy.php`
- **Registration**: Registered in `AuthServiceProvider.php`
- **Permission Check**: Uses Spatie Laravel Permission's `hasPermissionTo()` method

#### Routes
- **Location**: `routes/admin.php`
- **Model Binding**: All routes use `{supplier}` parameter with model binding
- **Soft Delete Support**: Restore and force-delete routes include `->withTrashed()`

### 2. Frontend Implementation

#### Index Page (List View)
- **Location**: `resources/js/Pages/Admin/Supplier/Index.jsx`
- **Permission Integration**: 
  - Create button visibility based on `permissions.can_create`
  - Action buttons (view, edit, delete) respect individual permissions
  - Empty state create button includes permission check
  - Bulk actions respect user permissions

Key features:
```jsx
// Create button with permission check
{permissions.can_create && (
    <Link href={route("admin.suppliers.create")}>
        <Button>
            <Plus className="h-4 w-4 mr-2" />
            {t("Add Supplier")}
        </Button>
    </Link>
)}

// Action buttons with permission checks
{permissions.can_view && (
    <Link href={route("admin.suppliers.show", supplier.id)}>
        <Button variant="outline" size="sm">
            <Eye className="h-4 w-4" />
        </Button>
    </Link>
)}
```

#### Create Page
- **Location**: `resources/js/Pages/Admin/Supplier/Create.jsx`
- **Permission Integration**: Accepts `permissions` parameter for future extensibility

#### Edit Page
- **Location**: `resources/js/Pages/Admin/Supplier/Edit.jsx`
- **Permission Integration**: Accepts `permissions` parameter and includes action buttons

#### Show Page
- **Location**: `resources/js/Pages/Admin/Supplier/Show.jsx`
- **Permission Integration**: 
  - Edit button visibility based on `permissions.can_update`
  - Delete button visibility based on `permissions.can_delete`
  - Payment/Purchase view buttons based on `permissions.can_view`

### 3. Navigation Integration

#### Navigation.jsx
- **Location**: `resources/js/Components/Admin/Navigation.jsx`
- **Permission Filtering**: Suppliers menu item includes `permission: "view_any_supplier"`
- **Dynamic Filtering**: Navigation automatically filters menu items based on user permissions

```jsx
// Navigation item with permission
{
    name: t("Suppliers"),
    icon: <Truck className="w-5 h-5" />,
    route: "admin.suppliers.index",
    active: currentRoute?.startsWith("admin.suppliers"),
    permission: "view_any_supplier",
}

// Permission filtering logic
.filter(item => {
    if (!item.permission) return true;
    
    const hasPermission = auth.user.permissions?.some(permission =>
        permission.name === item.permission
    );
    
    return hasPermission;
})
```

## Security Features

### 1. Middleware Protection
- All controller methods are protected with appropriate middleware
- Unauthorized access results in 403 Forbidden response
- Policy-based authorization for resource-specific operations

### 2. Frontend Permission Checks
- All UI elements respect user permissions
- No unauthorized buttons or links are displayed
- Graceful handling of permission-restricted actions

### 3. Model Binding Security
- All routes use Laravel model binding
- Automatic 404 responses for non-existent resources
- Consistent parameter handling across all routes

### 4. Soft Delete Support
- Proper handling of soft-deleted records
- Restore functionality with appropriate permissions
- Force delete for permanent removal

## Testing

### Available Tests
- **Location**: `tests/Feature/SupplierPermissionsTest.php`
- **Coverage**: All CRUD operations with permission scenarios
- **Factory**: `database/factories/SupplierFactory.php` for test data generation

### Test Scenarios
1. Admin user with all permissions can perform all operations
2. Limited user with view-only permissions cannot perform restricted actions
3. Users without permissions receive 403 responses
4. Validation errors are handled correctly
5. Model not found exceptions return 404 responses

### Running Tests
```bash
php artisan test tests/Feature/SupplierPermissionsTest.php
```

## Database Schema

### Suppliers Table
```sql
CREATE TABLE suppliers (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    contact_name VARCHAR(255) NULL,
    email VARCHAR(255) NULL,
    phone VARCHAR(255) NULL,
    address TEXT NULL,
    city VARCHAR(255) NULL,
    state VARCHAR(255) NULL,
    country VARCHAR(255) NULL,
    postal_code VARCHAR(50) NULL,
    id_number VARCHAR(255) NULL,
    created_at TIMESTAMP NULL,
    updated_at TIMESTAMP NULL,
    deleted_at TIMESTAMP NULL
);
```

## Usage Examples

### 1. Assigning Permissions to User
```php
$user = User::find(1);
$user->givePermissionTo([
    'view_any_supplier',
    'view_supplier',
    'create_supplier',
    'update_supplier'
]);
```

### 2. Creating Role with Supplier Permissions
```php
$supplierManagerRole = Role::create(['name' => 'supplier_manager']);
$supplierManagerRole->givePermissionTo([
    'view_any_supplier',
    'view_supplier',
    'create_supplier',
    'update_supplier',
    'delete_supplier'
]);
```

### 3. Checking Permissions in Blade/React
```php
// PHP/Blade
@can('create_supplier')
    <button>Create Supplier</button>
@endcan

// React (passed from controller)
{permissions.can_create && (
    <button>Create Supplier</button>
)}
```

## Error Handling

### Common Scenarios
1. **403 Forbidden**: User lacks required permission
2. **404 Not Found**: Supplier doesn't exist
3. **422 Validation Error**: Invalid form data
4. **500 Server Error**: Unexpected application error

### Error Responses
- Consistent error handling across all methods
- Proper HTTP status codes
- User-friendly error messages
- Logging for debugging purposes

## Performance Considerations

### 1. Permission Caching
- Spatie Laravel Permission includes caching by default
- Permissions are cached to avoid repeated database queries
- Cache is automatically invalidated when permissions change

### 2. Eager Loading
- Relationships are eagerly loaded where appropriate
- Reduces N+1 query problems
- Optimized database queries for list views

### 3. Pagination
- Large supplier lists are paginated
- Reduces memory usage and improves performance
- Configurable page sizes

## Maintenance

### 1. Adding New Permissions
1. Create permission: `Permission::create(['name' => 'new_permission'])`
2. Add to policy: Implement method in `SupplierPolicy`
3. Add middleware: Protect controller method
4. Update frontend: Add permission checks to UI
5. Update tests: Add test cases for new permission

### 2. Updating Existing Permissions
1. Update policy methods if needed
2. Modify controller middleware
3. Update frontend permission checks
4. Update tests accordingly

### 3. Debugging Permission Issues
1. Check user permissions: `$user->getAllPermissions()`
2. Test policy methods: `$user->can('permission', $model)`
3. Review middleware configuration
4. Check frontend permission data
5. Verify database permission records

## Best Practices

### 1. Consistent Naming
- Use descriptive permission names
- Follow the pattern: `action_resource` (e.g., `view_supplier`)
- Maintain consistency across all modules

### 2. Granular Permissions
- Separate permissions for different actions
- Avoid overly broad permissions
- Allow for flexible role configuration

### 3. Frontend Security
- Always check permissions on backend
- Use frontend checks for UX only
- Never rely solely on frontend permission checks

### 4. Testing
- Test all permission scenarios
- Include edge cases in tests
- Maintain good test coverage

## Troubleshooting

### Common Issues
1. **Permission not working**: Check policy registration in `AuthServiceProvider`
2. **Frontend not updating**: Verify permission data is passed from controller
3. **Navigation not filtering**: Check permission filtering logic
4. **Tests failing**: Ensure proper test setup and data

### Debug Steps
1. Verify permission exists in database
2. Check user has permission assigned
3. Confirm policy method exists and works
4. Validate middleware configuration
5. Test frontend permission data

## Conclusion

The Supplier permissions implementation provides a robust, secure, and user-friendly access control system. It follows Laravel best practices and maintains consistency with the existing codebase. The implementation includes comprehensive testing, proper error handling, and detailed documentation for future maintenance.

For questions or issues, refer to the test cases for examples and the Laravel documentation for underlying concepts. 
