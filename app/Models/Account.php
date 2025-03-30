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
        'address',
        'status'
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

    public function outcomes()
    {
        return $this->hasMany(AccountOutcome::class);
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

    public function approvedOutcomes()
    {
        return $this->outcomes()->where('status', 'approved');
    }

    public function pendingOutcomes()
    {
        return $this->outcomes()->where('status', 'pending');
    }

    public function rejectedOutcomes()
    {
        return $this->outcomes()->where('status', 'rejected');
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
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');
    }

    public function getYearlyIncomeAttribute()
    {
        return $this->approvedIncomes()
            ->whereYear('date', now()->year)
            ->sum('amount');
    }

    public function getIncomeByMonthAttribute()
    {
        return $this->approvedIncomes()
            ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
            ->whereYear('date', now()->year)
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();
    }

    public function getTotalOutcomeAttribute()
    {
        return $this->approvedOutcomes()->sum('amount');
    }

    public function getPendingOutcomeAttribute()
    {
        return $this->pendingOutcomes()->sum('amount');
    }

    public function getMonthlyOutcomeAttribute()
    {
        return $this->approvedOutcomes()
            ->whereMonth('date', now()->month)
            ->whereYear('date', now()->year)
            ->sum('amount');
    }

    public function getYearlyOutcomeAttribute()
    {
        return $this->approvedOutcomes()
            ->whereYear('date', now()->year)
            ->sum('amount');
    }

    public function getOutcomeByMonthAttribute()
    {
        return $this->approvedOutcomes()
            ->select(DB::raw('MONTH(date) as month'), DB::raw('SUM(amount) as total'))
            ->whereYear('date', now()->year)
            ->groupBy('month')
            ->get()
            ->pluck('total', 'month')
            ->toArray();
    }
}
