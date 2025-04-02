<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rules\Password;
use Inertia\Inertia;

class ProfileController extends Controller
{
    /**
     * Display the user's profile form.
     */
    public function edit()
    {
        return Inertia::render('Warehouse/Profile');
    }

    /**
     * Update the user's profile information.
     */
    public function update(Request $request)
    {
        $user = Auth::guard('warehouse_user')->user();

        $validated = $request->validate([
            'name' => ['required', 'string', 'max:255'],
            'email' => ['required', 'string', 'email', 'max:255', "unique:ware_house_users,email,{$user->id}"],
        ]);

        $user->name = $validated['name'];
        $user->email = $validated['email'];

        // Check if password fields are provided
        if ($request->filled('current_password')) {
            $request->validate([
                'current_password' => ['required', 'string', 'current_password:warehouse_user'],
                'password' => ['required', 'string', Password::defaults(), 'confirmed'],
            ]);

            $user->password = Hash::make($request->password);
        }

        $user->save();

        return back();
    }
}
