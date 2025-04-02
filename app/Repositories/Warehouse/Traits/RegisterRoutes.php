<?php

namespace App\Repositories\Warehouse\Traits;

use Illuminate\Support\Facades\Route;

trait RegisterRoutes
{
    public static function registerRoutes()
    {
        // Customer Authentication Routes
        Route::prefix('warehouse')->name('warehouse.')->group(function () {
            // Redirect root customer path to dashboard if authenticated, otherwise to login
        });
    }
}