<?php

namespace App\Http\Controllers\Customer;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Show the profile page.
     */
    public function show()
    {
        return Inertia::render('Customer/Profile/Index', [
            'auth' => [
                'user' => auth('customer_user')->user() ? [
                    'id' => auth('customer_user')->user()->id,
                    'name' => auth('customer_user')->user()->name,
                    'email' => auth('customer_user')->user()->email,
                    'email_verified_at' => auth('customer_user')->user()->email_verified_at,
                    'created_at' => auth('customer_user')->user()->created_at,
                    'updated_at' => auth('customer_user')->user()->updated_at,
                    'permissions' => auth('customer_user')->user()->getAllPermissions()->pluck('name')->toArray(),
                ] : null,
            ],
        ]);
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::guard('customer_user')->user();

        $validated = $request->validateWithBag('updateProfile', [
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'lowercase', 'email', 'max:255', 'unique:customer_users,email,' . $user->id],
            'phone' => ['nullable', 'string', 'max:20'],
            'address' => ['nullable', 'string', 'max:500'],
        ]);

        $user->fill($validated);
        $user->save();

        return back()->with('status', 'profile-updated');
    }

    /**
     * Update the user's password.
     */
    public function updatePassword(Request $request)
    {
        $validated = $request->validateWithBag('updatePassword', [
            'current_password' => ['required', 'current_password:customer_user'],
            'password' => ['required', Rules\Password::defaults(), 'confirmed'],
        ]);

        $user = Auth::guard('customer_user')->user();

        $user->password = Hash::make($validated['password']);
        $user->save();

        return back()->with('status', 'password-updated');
    }

    /**
     * Search for profile information.
     */
    public function search(Request $request)
    {
        $search = $request->input('search');
        $user = Auth::guard('customer_user')->user();
        $customer = $user->customer;

        // Default response with user/customer data
        $data = [
            'user' => $user,
            'customer' => $customer
        ];

        // If search query is provided, filter additional data based on search term
        if (!empty($search)) {
            // Example: Add related orders or activities that match the search term
            $data['related_orders'] = $customer->orders()
                ->where('reference_number', 'like', "%{$search}%")
                ->orWhere('notes', 'like', "%{$search}%")
                ->limit(10)
                ->get();

            // You can add more searchable related data here as needed
        }

        return response()->json($data);
    }
}
