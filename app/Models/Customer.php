<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Bavix\Wallet\Traits\HasWallet;
use Bavix\Wallet\Interfaces\Wallet;
class Customer extends Authenticatable implements Wallet
{
    use HasFactory;
    use HasWallet;

    protected $fillable = [
        'name',
        'email',
        'password',
        'phone',
        'address',
        'status',
        'notes',
        'user_id'
    ];

    protected $casts = [
        // Remove balance and credit_limit casts since columns don't exist
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

    public function users(): HasMany
    {
        return $this->hasMany(CustomerUser::class);
    }

    public function marketOrders(): HasMany
    {
        return $this->hasMany(MarketOrder::class);
    }

    public function transfersFrom(): HasMany
    {
        return $this->hasMany(CustomerTransfer::class, 'from_customer_id');
    }

    public function transfersTo(): HasMany
    {
        return $this->hasMany(CustomerTransfer::class, 'to_customer_id');
    }
}
