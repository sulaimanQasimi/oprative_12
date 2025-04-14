<?php

namespace App\Http\Requests\Customer\Auth;

use App\Models\Customer;
use App\Models\CustomerUser;
use Illuminate\Auth\Events\Registered;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Log;
use Illuminate\Validation\Rules\Password;

class RegisterRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     *
     * @return bool
     */
    public function authorize(): bool
    {
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, mixed>
     */
    public function rules(): array
    {
        return [
            // Customer Information
            'company_name' => ['required', 'string', 'max:255'],
            'company_phone' => ['required', 'string', 'max:20'],
            'company_email' => ['required', 'string', 'email', 'max:255', 'unique:customers,email'],
            'company_address' => ['required', 'string', 'max:255'],
            'company_city' => ['required', 'string', 'max:100'],
            'company_country' => ['required', 'string', 'max:100'],

            // User Information
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', 'unique:customer_users,email'],
            'phone' => ['required', 'string', 'max:20'],
            'password' => ['required', 'confirmed', Password::defaults()],
        ];
    }

    /**
     * Configure the validator instance.
     *
     * @param \Illuminate\Validation\Validator $validator
     * @return void
     */
    public function withValidator($validator): void
    {
        if ($validator->fails()) {
            Log::warning('Failed registration validation', [
                'ip' => request()->ip(),
                'email' => request()->input('email'),
                'user_agent' => request()->header('User-Agent')
            ]);
        }
    }

    /**
     * Get custom messages for validator errors.
     *
     * @return array
     */
    public function messages(): array
    {
        return [
            'name.required' => 'Please enter your full name.',
            'email.required' => 'Please enter your email address.',
            'email.email' => 'Please enter a valid email address.',
            'email.unique' => 'This email is already registered. Please login or use a different email.',
            'password.required' => 'Please create a password.',
            'password.confirmed' => 'The password confirmation does not match.',
        ];
    }

    /**
     * Process the registration.
     */
    public function register()
    {
        return DB::transaction(function () {
            try {
                // Create customer record
                $customer = Customer::create([
                    'name' => $this->company_name,
                    'phone' => $this->company_phone,
                    'email' => $this->company_email,
                    'address' => $this->company_address,
                    'city' => $this->company_city,
                    'country' => $this->company_country,
                    'status' => 'pending', // Set initial status to pending for admin approval
                ]);

                // Create customer user
                $user = CustomerUser::create([
                    'customer_id' => $customer->id,
                    'name' => $this->name,
                    'email' => $this->email,
                    'phone' => $this->phone,
                    'password' => Hash::make($this->password),
                ]);

                // Assign default role and permissions
                $user->assignRole('customer');

                // Fire registered event
                event(new Registered($user));

                Log::info('New customer registered', [
                    'customer_id' => $customer->id,
                    'company_name' => $customer->name,
                    'user_id' => $user->id,
                    'user_name' => $user->name,
                ]);

                return $user;
            } catch (\Exception $e) {
                Log::error('Customer registration failed', [
                    'error' => $e->getMessage(),
                    'trace' => $e->getTraceAsString(),
                ]);
                throw $e;
            }
        });
    }
}
