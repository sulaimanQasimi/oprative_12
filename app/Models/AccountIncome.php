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
        'income_date',
        'status',
        'approved_by'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'income_date' => 'date',
        'created_at' => 'datetime',
        'updated_at' => 'datetime',
        'deleted_at' => 'datetime'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function approvedBy()
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
