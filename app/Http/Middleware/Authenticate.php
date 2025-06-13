<?php

namespace App\Http\Middleware;

use Illuminate\Auth\Middleware\Authenticate as Middleware;
use Illuminate\Http\Request;

class Authenticate extends Middleware
{
    public function __construct($auth)
    {
        parent::__construct($auth);

        static::redirectUsing(function (Request $request) {
            if ($request->expectsJson()) {
                return null;
            }

            if (str_starts_with($request->path(), 'customer/')) {
                return route('customer.login');
            }

            if (str_starts_with($request->path(), 'warehouse/')) {
                return route('warehouse.login');
            }

            if (str_starts_with($request->path(), 'adminpanel/')) {
                return route('admin.login');
            }

            return route('landing');
        });
    }
}
