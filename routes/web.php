<?php

use App\Models\Warehouse;
use App\Models\User;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\HomeController;
use App\Http\Controllers\EmployeeController;
use App\Http\Controllers\SecuGenFingerprintController;
use App\Http\Controllers\PublicAttendanceRequestController;
use App\Repositories\Customer\CustomerRepository;
use App\Repositories\Warehouse\WarehouseRepository;
use App\Http\Controllers\Warehouse\ReportController;
use NotificationChannels\Telegram\TelegramContact;
use NotificationChannels\Telegram\TelegramMessage;
use NotificationChannels\Telegram\TelegramUpdates;
use Inertia\Inertia;

// Landing page route
Route::get('/', HomeController::class);

// Public Attendance Request Routes (No Authentication Required)
Route::prefix('attendance-request')->group(function () {
    Route::get('/', [PublicAttendanceRequestController::class, 'create'])->name('public.attendance-request.create');
    Route::post('/', [PublicAttendanceRequestController::class, 'store'])->name('public.attendance-request.store');
    Route::get('/success/{track_number}', [PublicAttendanceRequestController::class, 'success'])->name('public.attendance-request.success');
    Route::get('/track', [PublicAttendanceRequestController::class, 'track'])->name('public.attendance-request.track');
    Route::post('/track', [PublicAttendanceRequestController::class, 'getTrackingInfo'])->name('public.attendance-request.tracking-info');
    Route::post('/employee-info', [PublicAttendanceRequestController::class, 'getEmployeeInfo'])->name('public.attendance-request.employee-info');
});

// Inventory Routes
Route::middleware(['auth'])->group(function () {
    Route::get('/inventory/dashboard/{warehouse}', \App\Livewire\Inventory\Dashboard::class)->name('inventory.dashboard');

    // Employee Management Routes
    Route::resource('employees', EmployeeController::class);

    // Fingerprint Management Routes
    Route::resource('fingerprints', SecuGenFingerprintController::class);
    Route::get('employees/{employee}/fingerprints', [SecuGenFingerprintController::class, 'byEmployee'])
        ->name('employees.fingerprints');
});

// Register repository routes
CustomerRepository::registerRoutes();
WarehouseRepository::registerRoutes();
require __DIR__ . '/purchase.php';
Route::redirect('/login', '/')->name('login');

// Include admin routes
Route::prefix('adminpanel')
    ->group(function () {
        require __DIR__ . '/admin.php';
    });

Route::get('/test', function () {
    return Inertia::render('Test');
})->middleware('auth');

