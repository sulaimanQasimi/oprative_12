<?php

namespace App\Http\Middleware;

use Illuminate\Foundation\Support\Providers\RouteServiceProvider;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class RedirectIfAuthenticated
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    public function handle(Request $request, Closure $next, string ...$guards): Response
    {
        $guards = empty($guards) ? [null] : $guards;

        // If the request is for a customer route
        if (str_starts_with($request->path(), 'customer/')) {
            // If authenticated with customer_user, redirect to dashboard if trying to access login/register
            if (Auth::guard('customer_user')->check() && in_array($request->path(), ['customer/login', 'customer/register'])) {
                return redirect()->route('customer.dashboard');
            }

            // If not authenticated with customer_user and trying to access protected routes
            if (!Auth::guard('customer_user')->check() && !in_array($request->path(), ['customer/login', 'customer/register'])) {
                return redirect()->route('customer.login');
            }
        } else {
            // For non-customer routes, check each guard
            foreach ($guards as $guard) {
                if (Auth::guard($guard)->check()) {
                    if ($guard === 'customer_user') {
                        return redirect(RouteServiceProvider::CUSTOMER_HOME);
                    }

                    if ($guard === 'warehouse_user') {
                        return redirect(RouteServiceProvider::WAREHOUSE_HOME);
                    }

                    return redirect(RouteServiceProvider::HOME);
                }
            }
        }

        return $next($request);
    }
}
