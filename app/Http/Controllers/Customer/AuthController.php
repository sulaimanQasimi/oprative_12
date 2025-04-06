<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use App\Http\Requests\Customer\Auth\LoginRequest;
use App\Http\Requests\Customer\Auth\RegisterRequest;
use App\Models\CustomerUser;
use App\Services\Customer\AuthService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\RateLimiter;
use Illuminate\Validation\ValidationException;

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
    }

    /**
     * Show the customer login form.
     */
    public function showLoginForm()
    {
        return view('customer.auth.login');
    }

    /**
     * Handle customer authentication request.
     *
     * @throws \Illuminate\Validation\ValidationException
     */
    public function login(Request $request)
    {
        // Validate login credentials
        $request->validate([
            'email' => ['required', 'email'],
            'password' => ['required'],
        ]);

        // This throttle key combines IP and email to prevent brute force attacks
        $throttleKey = strtolower($request->input('email')) . '|' . $request->ip();

        if (RateLimiter::tooManyAttempts($throttleKey, 5)) {
            $seconds = RateLimiter::availableIn($throttleKey);
            throw ValidationException::withMessages([
                'email' => [__('auth.throttle', ['seconds' => $seconds])],
            ]);
        }

        try {
            if (!Auth::guard('customer_user')->attempt($request->only('email', 'password'), $request->boolean('remember'))) {
                RateLimiter::hit($throttleKey, 60); // Block for 1 minute after failed attempt

                throw ValidationException::withMessages([
                    'email' => [__('auth.failed')],
                ]);
            }

            RateLimiter::clear($throttleKey);
            $request->session()->regenerate();

            Log::info('Customer login successful', ['customer_id' => Auth::guard('customer_user')->id()]);

            return redirect()->intended(route('customer.dashboard'))
                ->with('success', 'Welcome back!');

        } catch (\Exception $e) {
            Log::error('Customer login error', [
                'email' => $request->email,
                'ip' => $request->ip(),
                'error' => $e->getMessage()
            ]);

            throw $e;
        }
    }

    /**
     * Show the customer registration form.
     */
    public function showRegistrationForm()
    {
        return view('customer.auth.register');
    }

    /**
     * Handle a registration request for a new customer.
     */
    public function register(Request $request)
    {
        // Validate registration data
        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customer_users'],
            'password' => ['required', 'string', 'min:8', 'confirmed'],
            'phone' => ['nullable', 'string', 'max:255'],
            'address' => ['nullable', 'string', 'max:255'],
        ]);

        try {
            $customerUser = $this->authService->registerCustomer($validated);

            Auth::guard('customer_user')->login($customerUser);

            Log::info('New customer registered', ['customer_id' => $customerUser->id]);

            return redirect()->route('customer.dashboard')
                ->with('success', 'Account created successfully! Welcome to our platform.');

        } catch (\Exception $e) {
            Log::error('Customer registration error', [
                'data' => $request->except('password', 'password_confirmation'),
                'error' => $e->getMessage()
            ]);

            return back()->withInput($request->except('password', 'password_confirmation'))
                ->withErrors(['general' => 'Registration failed. Please try again later.']);
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

        Log::info('Customer logout', ['customer_id' => $customerId]);

        return redirect()->route('customer.login')
            ->with('success', 'You have been logged out successfully.');
    }
}
