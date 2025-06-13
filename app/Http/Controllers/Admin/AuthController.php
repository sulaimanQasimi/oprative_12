<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * Show the admin login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('Admin/Login');
    }

    /**
     * Handle admin authentication request.
     */
    public function login(Request $request)
    {
        // Validate login credentials
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $email = $validated['email'];

        // Rate limiting to prevent brute force attacks
        $throttleKey = strtolower($email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            Log::warning('Admin login throttled', [
                'ip' => $request->ip(),
                'email' => $email,
                'seconds_remaining' => $seconds
            ]);

            throw ValidationException::withMessages([
                'email' => [__('auth.throttle', ['seconds' => $seconds])],
            ]);
        }

        try {
            if (!Auth::attempt([
                'email' => $email,
                'password' => $validated['password']
            ], $request->boolean('remember'))) {
                RateLimiter::hit($throttleKey, 60);

                Log::warning('Failed admin login attempt', [
                    'ip' => $request->ip(),
                    'email' => $email
                ]);

                throw ValidationException::withMessages([
                    'email' => [__('auth.failed')],
                ]);
            }

            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            Log::info('Admin login successful', [
                'user_id' => Auth::id(),
                'ip' => $request->ip()
            ]);

            return redirect()->intended(route('admin.dashboard'))
                ->with('success', 'Welcome back!');

        } catch (ValidationException $e) {
            throw $e;
        } catch (\Exception $e) {
            Log::error('Admin authentication error', [
                'ip' => $request->ip(),
                'error' => $e->getMessage(),
            ]);

            throw ValidationException::withMessages([
                'email' => ['An error occurred during authentication. Please try again later.'],
            ]);
        }
    }

    /**
     * Log the admin out of the application.
     */
    public function logout(Request $request)
    {
        $userId = Auth::id();

        Auth::logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Admin logout', [
            'user_id' => $userId,
            'ip' => $request->ip()
        ]);

        return redirect()->route('admin.login')
            ->with('success', 'You have been logged out successfully.');
    }
} 