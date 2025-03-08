<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

/*
    |--------------------------------------------------------------------------
    | API Routes
    |--------------------------------------------------------------------------
    |
    | Here is where you can register API routes for your application. These
    | routes are loaded by the RouteServiceProvider within a group which
    | is assigned the "api" middleware group. Enjoy building your API!
    |
*/

if(config('filament-accounts.features.apis')){
    Route::name('api.')->prefix('api')->middleware(['throttle:500'])->group(function (){
        Route::post('login',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'login'])->name('login');
        Route::post('register',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'register'])->name('register');
        Route::post('reset',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'reset'])->name('reset');
        Route::post('resend',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'resend'])->name('resend');
        Route::post('otp',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'otp'])->name('otp');
        Route::post('otp-check',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'otpCheck'])->name('otp.check');
        Route::post('password',[\App\Pos\Account\Http\Controllers\APIs\AuthController::class,'password'])->name('password');

        Route::middleware(['auth:sanctum'])->group(function (){
            //Auth
            Route::get('profile',[\App\Pos\Account\Http\Controllers\APIs\ProfileController::class,'profile'])->name('profile.user');
            Route::post('profile',[\App\Pos\Account\Http\Controllers\APIs\ProfileController::class,'update'])->name('profile.update');
            Route::post('profile/password',[\App\Pos\Account\Http\Controllers\APIs\ProfileController::class,'password'])->name('profile.password');
            Route::delete('profile/destroy',[\App\Pos\Account\Http\Controllers\APIs\ProfileController::class,'destroy'])->name('profile.destroy');
            Route::post('profile/logout',[\App\Pos\Account\Http\Controllers\APIs\ProfileController::class,'logout'])->name('profile.logout');
        });
    });


    if(config('filament-accounts.features.contacts')){
        Route::name('api.')->prefix('api/profile')->group(function (){
            Route::post('contact',[\App\Pos\Account\Http\Controllers\APIs\ContactsController::class,'send'])->name('contact.send');
        });
    }

    if(config('filament-accounts.features.locations')){
        Route::middleware(['auth:sanctum'])->name('api.')->prefix('api/profile/locations')->group(function (){
            Route::get('/',[\App\Pos\Account\Http\Controllers\APIs\AccountLocationsController::class,'index'])->name('locations.index');
            Route::post('/',[\App\Pos\Account\Http\Controllers\APIs\AccountLocationsController::class,'store'])->name('locations.store');
            Route::get('/{location}',[\App\Pos\Account\Http\Controllers\APIs\AccountLocationsController::class,'show'])->name('locations.show');
            Route::post('/{location}',[\App\Pos\Account\Http\Controllers\APIs\AccountLocationsController::class,'update'])->name('locations.update');
            Route::delete('/{location}',[\App\Pos\Account\Http\Controllers\APIs\AccountLocationsController::class,'destroy'])->name('locations.destroy');
        });
    }

    if(config('filament-accounts.features.requests')){
        Route::middleware(['auth:sanctum'])->name('api.')->prefix('api/profile/requests')->group(function (){
            Route::get('/',[\App\Pos\Account\Http\Controllers\APIs\AccountRequestsController::class,'index'])->name('requests.index');
            Route::post('/',[\App\Pos\Account\Http\Controllers\APIs\AccountRequestsController::class,'store'])->name('requests.store');
            Route::get('/{accountRequest}',[\App\Pos\Account\Http\Controllers\APIs\AccountRequestsController::class,'show'])->name('requests.show');
            Route::post('/{accountRequest}',[\App\Pos\Account\Http\Controllers\APIs\AccountRequestsController::class,'update'])->name('requests.update');
            Route::delete('/{accountRequest}',[\App\Pos\Account\Http\Controllers\APIs\AccountRequestsController::class,'destroy'])->name('requests.destroy');
        });
    }
}
