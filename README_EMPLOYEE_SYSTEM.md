# Employee and SecuGenFingerprint Management System

This document outlines the complete Employee and SecuGenFingerprint management system that has been implemented in the Laravel application.

## Overview

The system consists of two main models:
1. **Employee** - Manages employee information
2. **SecuGenFingerprint** - Manages fingerprint data associated with employees

## Database Structure

### Employees Table
- `id` - Primary key
- `photo` - Path to employee photo (nullable)
- `taskra_id` - Unique Taskra ID
- `first_name` - Employee first name
- `last_name` - Employee last name
- `employee_id` - Unique employee ID
- `department` - Employee department
- `contact_info` - JSON field containing contact information
- `email` - Unique email address
- `created_at`, `updated_at` - Timestamps

### SecuGenFingerprints Table
- `id` - Primary key
- `employee_id` - Foreign key to employees table
- `personal_info_id` - Personal info ID or UUID (nullable)
- `Manufacturer` - Fingerprint device manufacturer
- `Model` - Fingerprint device model
- `SerialNumber` - Device serial number
- `ImageWidth` - Fingerprint image width
- `ImageHeight` - Fingerprint image height
- `ImageDPI` - Fingerprint image DPI
- `ImageQuality` - Fingerprint image quality (1-100)
- `NFIQ` - NIST Fingerprint Image Quality (1-8)
- `ImageDataBase64` - Base64 encoded fingerprint image data
- `BMPBase64` - Base64 encoded BMP image
- `ISOTemplateBase64` - Base64 encoded ISO template
- `TemplateBase64` - Base64 encoded template
- `created_at`, `updated_at` - Timestamps

## Models

### Employee Model (`app/Models/Employee.php`)
**Features:**
- Mass assignable fields for all employee data
- JSON casting for `contact_info` field
- `full_name` accessor combining first and last name
- Relationship to SecuGenFingerprint (hasMany)
- Scopes for department filtering and name searching

**Relationships:**
- `fingerprints()` - HasMany relationship to SecuGenFingerprint

### SecuGenFingerprint Model (`app/Models/SecuGenFingerprint.php`)
**Features:**
- Mass assignable fields for all fingerprint data
- Integer casting for numeric fields
- Relationship to Employee (belongsTo)
- Scopes for manufacturer and model filtering
- Quality description accessor based on NFIQ value

**Relationships:**
- `employee()` - BelongsTo relationship to Employee

## Controllers

### EmployeeController (`app/Http/Controllers/EmployeeController.php`)
**Features:**
- Full CRUD operations
- Authorization using policies
- File upload handling for photos
- Search and filtering capabilities
- Validation for all fields including nested contact_info

**Methods:**
- `index()` - List employees with search and department filtering
- `create()` - Show create form
- `store()` - Create new employee with validation
- `show()` - Display employee details with fingerprints
- `edit()` - Show edit form
- `update()` - Update employee with validation
- `destroy()` - Delete employee and associated data

### SecuGenFingerprintController (`app/Http/Controllers/SecuGenFingerprintController.php`)
**Features:**
- Full CRUD operations
- Authorization using policies
- Employee association
- Filtering by employee, manufacturer, and model

**Methods:**
- `index()` - List fingerprints with filtering
- `create()` - Show create form with employee selection
- `store()` - Create new fingerprint record
- `show()` - Display fingerprint details
- `edit()` - Show edit form
- `update()` - Update fingerprint record
- `destroy()` - Delete fingerprint record
- `byEmployee()` - Show fingerprints for specific employee

## Policies

### EmployeePolicy (`app/Policies/EmployeePolicy.php`)
**Permissions:**
- `view_any_employee` - View all employees
- `view_employee` - View individual employee
- `create_employee` - Create new employee
- `update_employee` - Update employee
- `delete_employee` - Delete employee
- `delete_any_employee` - Delete any employee
- `restore_employee` - Restore deleted employee
- `force_delete_employee` - Permanently delete employee

### SecuGenFingerprintPolicy (`app/Policies/SecuGenFingerprintPolicy.php`)
**Permissions:**
- `view_any_fingerprint` - View all fingerprints
- `view_fingerprint` - View individual fingerprint
- `create_fingerprint` - Create new fingerprint
- `update_fingerprint` - Update fingerprint
- `delete_fingerprint` - Delete fingerprint
- `delete_any_fingerprint` - Delete any fingerprint
- `restore_fingerprint` - Restore deleted fingerprint
- `force_delete_fingerprint` - Permanently delete fingerprint

## Factories and Seeders

### EmployeeFactory (`database/factories/EmployeeFactory.php`)
**Features:**
- Generates realistic employee data
- Random departments from predefined list
- Complex contact_info JSON structure
- Unique IDs and email addresses

### SecuGenFingerprintFactory (`database/factories/SecuGenFingerprintFactory.php`)
**Features:**
- Generates realistic fingerprint device data
- Random manufacturers and models
- Proper image dimensions and quality metrics
- Base64 encoded sample data

### EmployeeSeeder (`database/seeders/EmployeeSeeder.php`)
**Features:**
- Creates 10 dummy employees
- No fingerprints created (as requested)

### EmployeePermissionSeeder (`database/seeders/EmployeePermissionSeeder.php`)
**Features:**
- Creates all CRUD permissions for both models
- Dari language labels for permissions
- Permission grouping (employee_management, fingerprint_management)
- Role creation and assignment (admin, hr_manager, employee)

## Routes

### Web Routes (`routes/web.php`)
```php
// Employee Management Routes
Route::resource('employees', EmployeeController::class);

// Fingerprint Management Routes
Route::resource('fingerprints', SecuGenFingerprintController::class);
Route::get('employees/{employee}/fingerprints', [SecuGenFingerprintController::class, 'byEmployee'])
    ->name('employees.fingerprints');
```

## Permissions System

The system uses Spatie Laravel Permission package with:

### Permission Groups:
- `employee_management` - All employee-related permissions
- `fingerprint_management` - All fingerprint-related permissions

### Roles:
- `admin` - Full access to all operations
- `hr_manager` - All operations except force delete
- `employee` - View-only access to own data

### Dari Labels:
All permissions include Dari language labels for localization support.

## Usage Examples

### Creating an Employee:
```php
$employee = Employee::create([
    'taskra_id' => 'TKR-123456',
    'first_name' => 'John',
    'last_name' => 'Doe',
    'employee_id' => 'EMP-001',
    'department' => 'IT',
    'email' => 'john.doe@company.com',
    'contact_info' => [
        'phone' => '+1234567890',
        'address' => '123 Main St',
        'emergency_contact' => [
            'name' => 'Jane Doe',
            'phone' => '+0987654321',
            'relationship' => 'Spouse'
        ]
    ]
]);
```

### Adding a Fingerprint:
```php
$fingerprint = SecuGenFingerprint::create([
    'employee_id' => $employee->id,
    'Manufacturer' => 'SecuGen',
    'Model' => 'Hamster Pro 20',
    'SerialNumber' => 'SN-1234-5678-9012',
    'ImageWidth' => 320,
    'ImageHeight' => 240,
    'ImageDPI' => 500,
    'ImageQuality' => 85,
    'NFIQ' => 2,
    'ImageDataBase64' => base64_encode($imageData),
    // ... other base64 fields
]);
```

### Querying with Relationships:
```php
// Get employee with fingerprints
$employee = Employee::with('fingerprints')->find(1);

// Get fingerprints for an employee
$fingerprints = $employee->fingerprints;

// Search employees by name
$employees = Employee::searchByName('John')->get();

// Filter by department
$itEmployees = Employee::byDepartment('IT')->get();
```

## File Structure

```
app/
├── Http/Controllers/
│   ├── EmployeeController.php
│   └── SecuGenFingerprintController.php
├── Models/
│   ├── Employee.php
│   └── SecuGenFingerprint.php
└── Policies/
    ├── EmployeePolicy.php
    └── SecuGenFingerprintPolicy.php

database/
├── factories/
│   ├── EmployeeFactory.php
│   └── SecuGenFingerprintFactory.php
├── migrations/
│   ├── 2025_06_01_061040_create_employees_table.php
│   ├── 2025_06_01_061001_create_secu_gen_fingerprints_table.php
│   └── 2025_06_01_062556_add_label_and_group_to_permissions_table.php
└── seeders/
    ├── EmployeeSeeder.php
    └── EmployeePermissionSeeder.php
```

## Installation and Setup

1. **Run Migrations:**
   ```bash
   php artisan migrate
   ```

2. **Seed Data:**
   ```bash
   php artisan db:seed --class=EmployeeSeeder
   php artisan db:seed --class=EmployeePermissionSeeder
   ```

3. **Assign Permissions to Users:**
   ```php
   $user = User::find(1);
   $user->assignRole('admin');
   ```

## Security Features

- All operations require authentication
- Policy-based authorization for all actions
- File upload validation for employee photos
- Input validation for all fields
- Unique constraints on critical fields
- Cascade deletion for data integrity

## Performance Optimizations

- Database indexes on frequently queried fields
- Eager loading of relationships
- Pagination for large datasets
- Scoped queries for efficient filtering

This system provides a complete, secure, and scalable solution for managing employees and their fingerprint data with proper authorization, validation, and data integrity. 