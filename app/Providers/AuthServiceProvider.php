<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Unit;
use App\Policies\UnitPolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Unit::class => UnitPolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
