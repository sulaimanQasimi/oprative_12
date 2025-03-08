<?php
use \Illuminate\Support\Facades\Route;

Route::get('otp', \App\Pos\Account\Livewire\Otp::class)
    ->middleware('web', 'throttle:10')
    ->name('otp');

Route::get('/accounts/team-invitations/{invitation}/accept', [\App\Pos\Account\Http\Controllers\TeamsController::class, 'accept'])
    ->middleware(['web', 'auth:accounts'])
    ->name('team-invitations.accept');

Route::get('/accounts/team-invitations/{invitation}/cancel', [\App\Pos\Account\Http\Controllers\TeamsController::class, 'cancel'])
    ->middleware(['web', 'auth:accounts'])
    ->name('team-invitations.cancel');
