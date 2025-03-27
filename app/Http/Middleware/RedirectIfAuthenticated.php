<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): mixed
    {
        $guards = empty($guards) ? [null] : $guards;

        foreach ($guards as $guard) {
            if (Auth::guard($guard)->check()) {
                if ($guard === 'customer_user') {
                    return redirect()->route('customer.dashboard');
                }
                return redirect('/');
            }
        }

        // If the request is for a customer route and user is not authenticated with customer_user
        if (str_starts_with($request->path(), 'customer/') && !Auth::guard('customer_user')->check()) {
            // Don't redirect if already trying to login or register
            if (!in_array($request->path(), ['customer/login', 'customer/register'])) {
                return redirect()->route('customer.login');
            }
        }

        return $next($request);
    }
}