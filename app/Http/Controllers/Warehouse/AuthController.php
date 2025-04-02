<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use App\Models\WareHouseUser;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Display the login view.
     */
    public function showLoginForm()
    {
        return Inertia::render('Warehouse/Login');
    }

    /**
     * Handle an incoming authentication request.
     */
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        if (Auth::guard('warehouse_user')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
            $request->session()->regenerate();
            return redirect()->intended(route('warehouse.dashboard'));
        }

        return back()->withErrors([
            'email' => 'The provided credentials do not match our records.',
        ]);
    }

    /**
     * Destroy an authenticated session.
     */
    public function logout(Request $request)
    {
        Auth::guard('warehouse_user')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        return redirect()->route('warehouse.login');
    }
}
