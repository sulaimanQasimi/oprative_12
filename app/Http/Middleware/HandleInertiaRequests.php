<?php

namespace App\Http\Middleware;

use Illuminate\Http\Request;
use Inertia\Middleware;
use Tighten\Ziggy\Ziggy;

class HandleInertiaRequests extends Middleware
{
    /**
     * The root template that is loaded on the first page visit.
     *
     * @var string
     */
    protected $rootView = 'app';

    /**
     * Determine the current asset version.
     */
    public function version(Request $request): ?string
    {
        return parent::version($request);
    }

    /**
     * Define the props that are shared by default.
     *
     * @return array<string, mixed>
     */
    public function share(Request $request): array
    {
        $user = $request->user();
        $customerUser = $request->user('customer_user');
        
        return [
            ...parent::share($request),
            'auth' => [
                'user' => $user ? [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'email_verified_at' => $user->email_verified_at,
                    'created_at' => $user->created_at,
                    'updated_at' => $user->updated_at,
                    'permissions' => $user->getAllPermissions()->pluck('name')->toArray(),
                ] : ($customerUser ? [
                    'id' => $customerUser->id,
                    'name' => $customerUser->name,
                    'email' => $customerUser->email,
                    'email_verified_at' => $customerUser->email_verified_at,
                    'created_at' => $customerUser->created_at,
                    'updated_at' => $customerUser->updated_at,
                    'permissions' => $customerUser->getAllPermissions()->pluck('name')->toArray(),
                ] : null),
            ],
            'ziggy' => fn () => [
                ...(new Ziggy)->toArray(),
                'location' => $request->url(),
            ],
        ];
    }
}
