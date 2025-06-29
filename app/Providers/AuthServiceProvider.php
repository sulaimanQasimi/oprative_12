<?php

namespace App\Providers;

use Illuminate\Foundation\Support\Providers\AuthServiceProvider as ServiceProvider;
use App\Models\Unit;
use App\Models\Supplier;
use App\Models\Customer;
use App\Models\Warehouse;
use App\Models\Gate;
use App\Models\AttendanceRequest;
use App\Models\Purchase;
use App\Policies\UnitPolicy;
use App\Policies\SupplierPolicy;
use App\Policies\CustomerPolicy;
use App\Policies\WarehousePolicy;
use App\Policies\GatePolicy;
use App\Policies\AttendanceRequestPolicy;
use App\Policies\PurchasePolicy;

class AuthServiceProvider extends ServiceProvider
{
    protected $policies = [
        Unit::class => UnitPolicy::class,
        Supplier::class => SupplierPolicy::class,
        Customer::class => CustomerPolicy::class,
        Warehouse::class => WarehousePolicy::class,
        Gate::class => GatePolicy::class,
        AttendanceRequest::class => AttendanceRequestPolicy::class,
        Purchase::class => PurchasePolicy::class,
    ];

    public function boot(): void
    {
        //
    }
}
