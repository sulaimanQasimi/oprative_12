<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountIncome extends Model
{
    use HasFactory;

    protected $fillable = [
        'account_id',
        'amount',
        'source',
        'description',
        'status',
        'approved_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($income) {
            $income->date = now();
            $income->source = static::generateSourceNumber();
        });
    }

    protected static function generateSourceNumber()
    {
        $prefix = 'INC';
        $year = now()->format('Y');
        $lastIncome = static::whereYear('created_at', $year)->latest()->first();
        $nextNumber = $lastIncome ? intval(substr($lastIncome->source, -4)) + 1 : 1;
        return $prefix . $year . str_pad($nextNumber, 4, '0', STR_PAD_LEFT);
    }

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function approvedBy()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function user()
    {
        return $this->belongsTo(User::class, 'approved_by');
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'approved' => 'success',
            'pending' => 'warning',
            'rejected' => 'danger',
            default => 'secondary'
        };
    }

    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'approved' => __('Approved'),
            'pending' => __('Pending'),
            'rejected' => __('Rejected'),
            default => __('Unknown')
        };
    }
}
