<?php

namespace App\Http\Controllers\Warehouse;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Inertia\Inertia;

class UsersController extends Controller
{
    /**
     * Display a listing of warehouse users.
     */
    public function index()
    {
        $warehouse = Auth::guard('warehouse_user')->user()->warehouse;

        $users = $warehouse->users()->get()->map(function ($user) {
            return [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'phone' => $user->phone,
                'role' => $user->role,
                'created_at' => $user->created_at->diffForHumans(),
            ];
        });

        return Inertia::render('Warehouse/Users', [
            'users' => $users,
        ]);
    }

    /**
     * Show the form for creating a new warehouse user.
     */
    public function create()
    {
        // Implementation for create form
    }

    /**
     * Store a newly created warehouse user in storage.
     */
    public function store(Request $request)
    {
        // Implementation for storing a user
    }

    /**
     * Display the specified warehouse user.
     */
    public function show($id)
    {
        // Implementation for showing a user
    }

    /**
     * Show the form for editing the specified warehouse user.
     */
    public function edit($id)
    {
        // Implementation for edit form
    }

    /**
     * Update the specified warehouse user in storage.
     */
    public function update(Request $request, $id)
    {
        // Implementation for updating a user
    }

    /**
     * Remove the specified warehouse user from storage.
     */
    public function destroy($id)
    {
        // Implementation for deleting a user
    }
}
