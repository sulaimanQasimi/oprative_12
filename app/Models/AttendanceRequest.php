<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceRequest extends Model
{
    use HasFactory;

    protected $fillable = [
        'track_number',
        'employee_id',
        'date',
        'type',
        'reason',
        'status',
        'reviewed_by',
        'reviewed_at',
    ];

    protected $casts = [
        'date' => 'date',
        'reviewed_at' => 'datetime',
    ];

    /**
     * Boot the model and set up event listeners
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            if (empty($model->track_number)) {
                $model->track_number = self::generateUniqueTrackNumber();
            }
        });
    }

    /**
     * Generate a unique 6-digit track number
     */
    private static function generateUniqueTrackNumber(): string
    {
        do {
            $trackNumber = str_pad(mt_rand(100000, 999999), 6, '0', STR_PAD_LEFT);
        } while (self::where('track_number', $trackNumber)->exists());

        return $trackNumber;
    }

    // Relationships
    public function employee(): BelongsTo
    {
        return $this->belongsTo(related: Employee::class);
    }

    public function reviewer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'reviewed_by');
    }

    // Scopes
    public function scopePending($query)
    {
        return $query->where('status', 'pending');
    }

    public function scopeAccepted($query)
    {
        return $query->where('status', 'accepted');
    }

    public function scopeRejected($query)
    {
        return $query->where('status', 'rejected');
    }

    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    public function scopeLate($query)
    {
        return $query->where('type', 'late');
    }

    public function scopeAbsent($query)
    {
        return $query->where('type', 'absent');
    }

    // Mutators and Accessors
    public function getStatusBadgeClassAttribute()
    {
        return match ($this->status) {
            'pending' => 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
            'accepted' => 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
            'rejected' => 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            default => 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        };
    }

    public function getTypeBadgeClassAttribute()
    {
        return match ($this->type) {
            'late' => 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300',
            'absent' => 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
            default => 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300',
        };
    }

    // Helper methods
    public function isPending(): bool
    {
        return $this->status === 'pending';
    }

    public function isAccepted(): bool
    {
        return $this->status === 'accepted';
    }

    public function isRejected(): bool
    {
        return $this->status === 'rejected';
    }

    public function canBeReviewed(): bool
    {
        return $this->isPending();
    }
}
