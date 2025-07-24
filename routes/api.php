<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use App\Models\User;
use App\Http\Controllers\Api\ProductController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

// Authentication Routes
Route::post('/login', function (Request $request) {
    $request->validate([
        'email' => 'required|email',
        'password' => 'required',
        'device_name' => 'required',
    ]);

    $user = User::where('email', $request->email)->first();

    if (!$user || !Hash::check($request->password, $user->password)) {
        throw ValidationException::withMessages([
            'email' => ['The provided credentials are incorrect.'],
        ]);
    }

    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
        'message' => 'Login successful'
    ], 200);
});

Route::post('/register', function (Request $request) {
    $request->validate([
        'name' => 'required|string|max:255',
        'email' => 'required|string|email|max:255|unique:users',
        'password' => 'required|string|min:8|confirmed',
        'device_name' => 'required',
    ]);

    $user = User::create([
        'name' => $request->name,
        'email' => $request->email,
        'password' => Hash::make($request->password),
    ]);

    $token = $user->createToken($request->device_name)->plainTextToken;

    return response()->json([
        'token' => $token,
        'user' => $user,
        'message' => 'Registration successful'
    ], 201);
});

// Protected Routes
Route::middleware('auth:sanctum')->group(function () {
    // User info
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // Logout
    Route::post('/logout', function (Request $request) {
        $request->user()->currentAccessToken()->delete();

        return response()->json([
            'message' => 'Logged out successfully'
        ], 200);
    });

    // Logout from all devices
    Route::post('/logout-all', function (Request $request) {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out from all devices successfully'
        ], 200);
    });

    // Product CRUD API Routes
    // Route::apiResource('products', ProductController::class);

    // Additional product routes
    Route::get('products/{product}/restore', [ProductController::class, 'restore']);
    Route::delete('products/{product}/force-delete', [ProductController::class, 'forceDelete']);
    Route::get('products/search/{query}', [ProductController::class, 'search']);

});

// Public Select Endpoints (no authentication required)
Route::get('products/select', [ProductController::class, 'select']);
Route::get('units/select', [App\Http\Controllers\Api\UnitController::class, 'select']);
Route::get('suppliers/select', [App\Http\Controllers\Api\SupplierController::class, 'select']);
Route::get('currencies/select', [App\Http\Controllers\Api\CurrencyController::class, 'select']);
Route::get('warehouses/select', [App\Http\Controllers\Api\WarehouseController::class, 'select']);

// Customer Inventory & Sales Data
Route::get('customer-inventory/purchase/{purchaseId}', [App\Http\Controllers\Api\CustomerInventoryController::class, 'getByPurchase']);
Route::get('customer-inventory/analytics/{purchaseId}', [App\Http\Controllers\Api\CustomerInventoryController::class, 'getSalesAnalytics']);

// Face Recognition Routes
Route::prefix('face')->group(function () {
    Route::post('/register', [App\Http\Controllers\FaceRecognitionController::class, 'register']);
    Route::post('/verify', [App\Http\Controllers\FaceRecognitionController::class, 'verify']);
    Route::post('/search', [App\Http\Controllers\FaceRecognitionController::class, 'search']);
    Route::get('/employee/{employeeId}', [App\Http\Controllers\FaceRecognitionController::class, 'getEmployeeFaceData']);
    Route::post('/deactivate/{faceDataId}', [App\Http\Controllers\FaceRecognitionController::class, 'deactivate']);
});