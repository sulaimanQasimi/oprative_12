<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Unit;
use App\Models\Supplier;
use App\Models\Warehouse;
use App\Models\Gate;
use App\Policies\UnitPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\WarehousePolicy;
use App\Policies\GatePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Unit::class => UnitPolicy::class,
        Supplier::class => SupplierPolicy::class,
        Warehouse::class => WarehousePolicy::class,
        Gate::class => GatePolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
