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
    $telegramService = app(\App\Services\TelegramService::class);

    // Test single message
    $telegramService->queueMessage(
        "Hello! This is a *queued* message from Laravel.\nSent at: " . now()->format('Y-m-d H:i:s'),
        7360745986, // Replace with actual chat ID
        'Markdown'
    );
    $telegramService->queueMessage(
        "Hello! This is a *queued* message from Laravel.\nSent at: " . now()->format('Y-m-d H:i:s'),
        7360745986, // Replace with actual chat ID
        'Markdown'
    );
    $telegramService->queueMessage(
        "Hello! This is a *queued* message from Laravel.\nSent at: " . now()->format('Y-m-d H:i:s'),
        7360745986, // Replace with actual chat ID
        'Markdown'
    );
});

// Test Purchase Observer
Route::get('/test-purchase-observer', function () {
    try {
        // Create a test purchase to trigger the observer
        $purchase = \App\Models\Purchase::create([
            'user_id' => 1, // Make sure this user exists and has chat_id
            'supplier_id' => 1, // Make sure this supplier exists
            'currency_id' => 1, // Make sure this currency exists
            'warehouse_id' => 1, // Make sure this warehouse exists
            'invoice_number' => 'TEST-' . time(),
            'invoice_date' => now(),
            'currency_rate' => '1.00',
            'status' => 'purchase',
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Test purchase created successfully',
            'purchase' => [
                'id' => $purchase->id,
                'invoice_number' => $purchase->invoice_number,
                'status' => $purchase->status
            ],
            'note' => 'Check your Telegram for the notification (if user has chat_id configured)'
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});

// Test Unit Observer
Route::get('/test-unit-observer', function () {
    try {
        // Create a test unit to trigger the observer
        $unit = \App\Models\Unit::create([
            'name' => 'Test Unit ' . time(),
            'code' => 'TU' . time(),
        ]);
        
        return response()->json([
            'success' => true,
            'message' => 'Test unit created successfully',
            'unit' => [
                'id' => $unit->id,
                'name' => $unit->name,
                'code' => $unit->code,
            ],
            'note' => 'Check your Telegram for the notification (if user has chat_id configured)'
        ]);
        
    } catch (\Exception $e) {
        return response()->json(['success' => false, 'error' => $e->getMessage()], 500);
    }
});
