<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Facades\DB;

class Account extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'id_number',
        'account_number',
        'customer_id',
        'approved_by',
        'address'
    ];

    protected $casts = [
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    public function customer()
    {
        return $this->belongsTo(Customer::class);
    }

    public function incomes()
    {
        return $this->hasMany(AccountIncome::class);
    }

    public function approvedIncomes()
    {
        return $this->incomes()->where('status', 'approved');
    }

    public function pendingIncomes()
    {
        return $this->incomes()->where('status', 'pending');
    }

    public function rejectedIncomes()
    {
        return $this->incomes()->where('status', 'rejected');
    }

    public function getTotalIncomeAttribute()
    {
        return $this->approvedIncomes()->sum('amount');
    }

    public function getPendingIncomeAttribute()
    {
        return $this->pendingIncomes()->sum('amount');
    }

    public function getMonthlyIncomeAttribute()
    {
        return $this->approvedIncomes()
            ->whereMonth('income_date', now()->month)
            ->whereYear('income_date', now()->year)
            ->sum('amount');
    }

    public function getYearlyIncomeAttribute()
    {
        return $this->approvedIncomes()
            ->whereYear('income_date', now()->year)
            ->sum('amount');
    }

    public function getIncomeByMonthAttribute()
    {
        return $this->approvedIncomes()
            ->select(DB::raw('MONTH(income_date) as month'), DB::raw('SUM(amount) as total'))
            ->whereYear('income_date', now()->year)
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();
    }
}
