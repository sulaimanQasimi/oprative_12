<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\Auth\LoginRequest;
use App\Models\CustomerUser;
use App\Services\Customer\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;
use Inertia\Inertia;

class AuthController extends Controller
{
    /**
     * The authentication service instance.
     */
    protected AuthService $authService;

    /**
     * Create a new controller instance.
     */
    public function __construct(AuthService $authService)
    {
        $this->authService = $authService;
        // Middleware should be applied in routes file
    }

    /**
     * Show the customer login form.
     */
    public function showLoginForm()
    {
        return Inertia::render('Customer/Login');
    }

    /**
     * Handle customer authentication request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        // Validate login credentials
        $validated = $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        $email = $validated['email'];

        // This throttle key combines IP and email to prevent brute force attacks
        $throttleKey = strtolower($email) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);

            // Log the throttling event
            Log::warning('Login throttled', [
                'ip' => $request->ip(),
                'email' => $email,
                'seconds_remaining' => $seconds
            ]);

            throw ValidationException::withMessages([
                'email' => [__('auth.throttle', ['seconds' => $seconds])],
            ]);
        }

        try {
            // Check if user exists and is verified
            $user = CustomerUser::where('email', $email)->first();

            // if ($user && $user->email_verified_at === null) {
            //     RateLimiter::hit($throttleKey, 30);
            //     throw ValidationException::withMessages([
            //         'email' => ['Please verify your email address before logging in.'],
            //     ]);
            // }

            if (!Auth::guard('customer_user')->attempt([
                'email' => $email,
                'password' => $validated['password']
            ], $request->has('remember'))) {
                RateLimiter::hit($throttleKey, 60); // Block for 1 minute after failed attempt

                // Log failed login attempt
                Log::warning('Failed login attempt', [
                    'ip' => $request->ip(),
                    'email' => $email
                ]);

                throw ValidationException::withMessages([
                    'email' => [__('auth.failed')],
                ]);
            }

            // Get the authenticated user
            $user = Auth::guard('customer_user')->user();

            // Check if the customer account is active
            if ($user->customer && $user->customer->status !== 'active') {
                Auth::guard('customer_user')->logout();
                $request->session()->invalidate();
                $request->session()->regenerateToken();

                Log::warning('Inactive customer attempted login', [
                    'customer_id' => $user->customer_id,
                    'user_id' => $user->id,
                    'ip' => $request->ip()
                ]);

                throw ValidationException::withMessages([
                    'email' => ['Your account is not active. Please contact support.'],
                ]);
            }

            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            // Use a safe subset of data for logging
            Log::info('Customer login successful', [
                'customer_id' => $user->id,
                'ip' => $request->ip()
            ]);

            return redirect()->intended(route('customer.dashboard'))
                ->with('success', 'Welcome back!');

        } catch (ValidationException $e) {
            // Pass through validation exceptions
            throw $e;
        } catch (\Exception $e) {
            // Log detailed error information but keep the user message generic
            Log::error('Authentication error', [
                'ip' => $request->ip(),
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Don't expose internal error details to user
            throw ValidationException::withMessages([
                'email' => ['An error occurred during authentication. Please try again later.'],
            ]);
        }
    }

    /**
     * Log the customer out of the application.
     */
    public function logout(Request $request)
    {
        $customerId = Auth::guard('customer_user')->id();

        Auth::guard('customer_user')->logout();

        $request->session()->invalidate();
        $request->session()->regenerateToken();

        Log::info('Customer logout', [
            'customer_id' => $customerId,
            'ip' => $request->ip()
        ]);

        return redirect()->route('customer.login')
            ->with('success', 'You have been logged out successfully.');
    }
}
