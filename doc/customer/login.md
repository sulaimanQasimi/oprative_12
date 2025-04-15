# Customer Authentication System Documentation

## Overview

The customer authentication system provides secure login functionality for customer users in the application. This document provides a detailed explanation of the authentication flow, security features, and implementation details.

## Table of Contents

1. [Architecture](#architecture)
2. [Authentication Flow](#authentication-flow)
3. [Security Features](#security-features)
4. [Route Configuration](#route-configuration)
5. [Form Implementation](#form-implementation)
6. [Authentication Guards](#authentication-guards)
7. [Error Handling](#error-handling)
8. [Logging](#logging)
9. [Session Management](#session-management)
10. [API Reference](#api-reference)
11. [Troubleshooting](#troubleshooting)

## Architecture

The customer authentication system follows Laravel's authentication pattern with custom guards. It consists of:

- **AuthController**: Handles login and logout functionality
- **LoginRequest**: Validates and sanitizes customer login requests
- **CustomerUser Model**: Represents the user entity for customers
- **Guard Configuration**: Custom authentication guard for customer users

The system is built on top of Laravel's authentication system with role-based access control via Spatie's Permission package.

## Authentication Flow

### Login Process

1. User visits the customer login page (`/customer/login`)
2. User enters email and password credentials
3. System validates the credentials
4. System checks if the email is verified
5. System checks if the customer account is active
6. If all checks pass, the user is authenticated and redirected to the dashboard
7. If any check fails, appropriate error messages are shown

### Logout Process

1. User initiates logout (via form submission or link)
2. System logs the user out
3. System invalidates the session
4. System regenerates the CSRF token
5. User is redirected to the login page with a success message

## Security Features

The authentication system implements several security features:

### Rate Limiting

Rate limiting prevents brute force attacks by limiting the number of login attempts:

- 5 login attempts within a time window before temporary lockout
- Rate limiting implemented using Laravel's `RateLimiter` facade
- Throttle key combines email and IP address for more precise limiting
- Different rate limit durations for different types of failures:
  - 60 seconds for failed login attempts
  - 30 seconds for unverified email attempts

### Email Verification

- Users must verify their email before they can log in
- Unverified emails result in a user-friendly error message

### Account Status Validation

- Only customers with an "active" status can log in
- Inactive accounts are prevented from accessing the system

### Input Validation

- All inputs are validated and sanitized
- Email is normalized (lowercase, trimmed)
- Password is required and validated

### Secure Session Management

- Session regeneration after successful login
- Session invalidation on logout
- CSRF token regeneration on logout

### Error Handling

- Generic error messages to prevent information disclosure
- Detailed server-side logging for debugging and auditing
- Different error types generate appropriate user-facing messages

## Route Configuration

The customer authentication routes are defined in the `RegisterRoutes` trait used by the `CustomerRepository` class:

```php
// Customer Authentication Routes
Route::prefix('customer')->name('customer.')->group(function () {
    // Guest routes
    Route::middleware('guest:customer_user')
        ->group(function () {
            Route::get('login', [AuthController::class, 'showLoginForm'])->name('login');
            Route::post('login', [AuthController::class, 'login']);
        });

    // Authenticated routes
    Route::middleware('auth:customer_user')
        ->group(function () {
            Route::post('logout', [AuthController::class, 'logout'])->name('logout');
            // Other protected routes...
        });

    // Fallback route
    Route::fallback(function () {
        return auth('customer_user')->check() 
            ? redirect()->route('customer.dashboard') 
            : redirect()->route('customer.login');
    });
});
```

## Form Implementation

The login form is implemented using Inertia.js with React, which provides a seamless SPA experience:

- Form is rendered in `resources/js/Pages/Customer/Login.jsx`
- Form submission is handled via Inertia.js AJAX
- Validation errors are displayed inline
- Animated feedback during authentication process
- Remember me functionality for persistent sessions

## Authentication Guards

The system uses a custom authentication guard for customer users:

```php
// config/auth.php
'guards' => [
    'customer_user' => [
        'driver' => 'session',
        'provider' => 'customer_users',
    ],
    // Other guards...
],

'providers' => [
    'customer_users' => [
        'driver' => 'eloquent',
        'model' => App\Models\CustomerUser::class,
    ],
    // Other providers...
],
```

This separation ensures customer users have different authentication from admin users or other user types.

## Error Handling

The authentication system handles various error scenarios:

1. **Invalid Credentials**: Generic "auth.failed" message
2. **Rate Limiting Triggered**: "auth.throttle" message with time remaining
3. **Unverified Email**: Message prompting the user to verify their email
4. **Inactive Account**: Message instructing the user to contact support
5. **System Errors**: Generic message preventing information disclosure

All errors are also logged for monitoring and debugging.

## Logging

Comprehensive logging is implemented throughout the authentication process:

```php
// Login success
Log::info('Customer login successful', [
    'customer_id' => $user->id,
    'ip' => $request->ip()
]);

// Login failure
Log::warning('Failed login attempt', [
    'ip' => $request->ip(),
    'email' => $email
]);

// Rate limiting
Log::warning('Login throttled', [
    'ip' => $request->ip(),
    'email' => $email,
    'seconds_remaining' => $seconds
]);

// Logout
Log::info('Customer logout', [
    'customer_id' => $customerId,
    'ip' => $request->ip()
]);
```

## Session Management

Session management follows security best practices:

1. **Session Regeneration**: After successful login, the session ID is regenerated to prevent session fixation attacks
2. **Session Invalidation**: During logout, the session is completely invalidated
3. **Token Regeneration**: The CSRF token is regenerated during logout

## API Reference

### AuthController Methods

#### `showLoginForm()`

Displays the customer login form.

- **Route**: `GET /customer/login`
- **Returns**: Inertia view `Customer/Login`

#### `login(Request $request)`

Handles the authentication request.

- **Route**: `POST /customer/login`
- **Parameters**:
  - `email` (required): Customer email address
  - `password` (required): Customer password
  - `remember` (optional): Remember login flag
- **Returns**: Redirect to intended route or dashboard
- **Throws**: ValidationException for validation or authentication failures

#### `logout(Request $request)`

Logs the customer out.

- **Route**: `POST /customer/logout`
- **Returns**: Redirect to login page with success message

## Troubleshooting

### Common Issues

1. **Users Cannot Log In**
   - Check email verification status
   - Verify customer account status is "active"
   - Ensure password is correct
   - Check rate limiting status

2. **Rate Limiting Issues**
   - Check logs for "Login throttled" events
   - Wait for the throttle period to expire
   - If persistent, check for unusual activity patterns

3. **Session Problems**
   - Clear browser cookies and try again
   - Check for session configuration issues
   - Verify session driver is configured properly

### Debugging Tips

1. Check log files for detailed error messages
2. Use browser developer tools to inspect network requests
3. Verify middleware is applied correctly
4. Test with known good credentials

## Conclusion

The customer authentication system provides a secure, robust login experience with multiple layers of protection against common attacks while maintaining a user-friendly experience. The system's architecture follows Laravel best practices and integrates seamlessly with the application's frontend. 
