<?php

namespace App\Services\Customer;

use App\Models\CustomerUser;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class AuthService
{
    /**
     * Register a new customer user
     *
     * @param array $data Customer registration data
     * @return CustomerUser
     */
    public function registerCustomer(array $data): CustomerUser
    {
        // Create new customer with hashed password and email verification token
        return CustomerUser::create([
            'name' => $data['name'],
            'email' => $data['email'],
            'password' => Hash::make($data['password']),
            'phone' => $data['phone'] ?? null,
            'address' => $data['address'] ?? null,
            'chat_id' => $data['chat_id'] ?? null,
            'email_verification_token' => $this->generateVerificationToken(),
        ]);
    }

    /**
     * Generate a secure verification token
     *
     * @return string
     */
    protected function generateVerificationToken(): string
    {
        return Str::random(64);
    }

    /**
     * Verify a customer's email address
     *
     * @param string $token
     * @return bool
     */
    public function verifyEmail(string $token): bool
    {
        $customer = CustomerUser::where('email_verification_token', $token)->first();

        if (!$customer) {
            return false;
        }

        $customer->email_verified_at = now();
        $customer->email_verification_token = null;
        $customer->save();

        return true;
    }

    /**
     * Reset a customer's password
     *
     * @param string $email
     * @param string $token
     * @param string $password
     * @return bool
     */
    public function resetPassword(string $email, string $token, string $password): bool
    {
        // This would integrate with Laravel's password broker
        // Implementation depends on your password reset flow
        // This is a placeholder for the actual implementation

        return true;
    }
}
