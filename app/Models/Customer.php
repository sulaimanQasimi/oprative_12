<?php

namespace App\Models;

use Filament\Models\Contracts\FilamentUser;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Customer extends Authenticatable implements FilamentUser
{
    use HasFactory;
    public function canAccessPanel(\Filament\Panel $panel): bool
    {
        return true;
    }


    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'tax_number',
        'balance',
        'credit_limit',
        'status',
        'notes',
        'user_id'
    ];

    protected $casts = [
        'balance' => 'decimal:2',
        'credit_limit' => 'decimal:2',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function sales(): HasMany
    {
        return $this->hasMany(Sale::class);
    }

    public function saleReturns(): HasMany
    {
        return $this->hasMany(SaleReturn::class);
    }

    public function payments(): HasMany
    {
        return $this->hasMany(CustomerPayment::class);
    }
    public function customerStockIncome(): HasMany
    {
        return $this->hasMany(CustomerStockIncome::class);
    }
    public function customerStockOutcome(): HasMany
    {
        return $this->hasMany(CustomerStockOutcome::class);
    }

    public function accounts(): HasMany
    {
        return $this->hasMany(Account::class);
    }
}
