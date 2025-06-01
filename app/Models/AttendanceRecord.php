<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Carbon\Carbon;

class AttendanceRecord extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'date',
        'entered_at',
        'exited_at',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'date' => 'date',
        'entered_at' => 'datetime',
        'exited_at' => 'datetime',
    ];

    /**
     * Get the employee that owns the attendance record.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Get the total hours worked for this record.
     */
    public function getTotalHoursAttribute(): ?float
    {
        if (!$this->entered_at || !$this->exited_at) {
            return null;
        }

        return $this->entered_at->diffInHours($this->exited_at, true);
    }

    /**
     * Get the total minutes worked for this record.
     */
    public function getTotalMinutesAttribute(): ?int
    {
        if (!$this->entered_at || !$this->exited_at) {
            return null;
        }

        return $this->entered_at->diffInMinutes($this->exited_at, true);
    }

    /**
     * Check if the employee is currently checked in.
     */
    public function getIsCheckedInAttribute(): bool
    {
        return $this->entered_at && !$this->exited_at;
    }

    /**
     * Check if the employee has completed their day.
     */
    public function getIsCompletedAttribute(): bool
    {
        return $this->entered_at && $this->exited_at;
    }

    /**
     * Get formatted duration string.
     */
    public function getFormattedDurationAttribute(): string
    {
        if (!$this->entered_at || !$this->exited_at) {
            return 'N/A';
        }

        $hours = floor($this->total_minutes / 60);
        $minutes = $this->total_minutes % 60;

        return sprintf('%02d:%02d', $hours, $minutes);
    }

    /**
     * Scope a query to only include records for a specific date.
     */
    public function scopeForDate($query, $date)
    {
        return $query->where('date', $date);
    }

    /**
     * Scope a query to only include records for a specific employee.
     */
    public function scopeForEmployee($query, $employeeId)
    {
        return $query->where('employee_id', $employeeId);
    }

    /**
     * Scope a query to only include records within a date range.
     */
    public function scopeDateRange($query, $startDate, $endDate)
    {
        return $query->whereBetween('date', [$startDate, $endDate]);
    }

    /**
     * Scope a query to only include completed records.
     */
    public function scopeCompleted($query)
    {
        return $query->whereNotNull('entered_at')->whereNotNull('exited_at');
    }

    /**
     * Scope a query to only include incomplete records (checked in but not out).
     */
    public function scopeIncomplete($query)
    {
        return $query->whereNotNull('entered_at')->whereNull('exited_at');
    }
} 