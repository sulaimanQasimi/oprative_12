<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class AccountOutcome extends Model
{

    protected $fillable = [
        'user_id',
        'account_id',
        'reference_number',
        'amount',
        'model_type',
        'model_id',
        'date',
        'status',
        'description'
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'date' => 'datetime'
    ];

    public function account()
    {
        return $this->belongsTo(Account::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function model()
    {
        return $this->morphTo();
    }

    public function getStatusBadgeAttribute()
    {
        return match($this->status) {
            'pending' => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">' . __('Pending') . '</span>',
            'approved' => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">' . __('Approved') . '</span>',
            'rejected' => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">' . __('Rejected') . '</span>',
            default => '<span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">' . __('Unknown') . '</span>'
        };
    }

    public function getStatusTextAttribute()
    {
        return match($this->status) {
            'pending' => __('Pending'),
            'approved' => __('Approved'),
            'rejected' => __('Rejected'),
            default => __('Unknown')
        };
    }
}
