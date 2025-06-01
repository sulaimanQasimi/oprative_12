<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class AttendanceSetting extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'enter_time',
        'exit_time',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'enter_time' => 'datetime:H:i:s',
        'exit_time' => 'datetime:H:i:s',
    ];

    /**
     * Get the global attendance settings.
     * Creates default settings if none exist.
     */
    public static function getSettings(): self
    {
        $settings = self::first();
        
        if (!$settings) {
            $settings = self::create([
                'enter_time' => '08:00:00',
                'exit_time' => '17:00:00',
            ]);
        }
        
        return $settings;
    }

    /**
     * Update the global attendance settings.
     */
    public static function updateSettings(array $data): self
    {
        $settings = self::getSettings();
        $settings->update($data);
        
        return $settings;
    }

    /**
     * Get formatted enter time.
     */
    public function getFormattedEnterTimeAttribute(): string
    {
        return Carbon::parse($this->enter_time)->format('H:i');
    }

    /**
     * Get formatted exit time.
     */
    public function getFormattedExitTimeAttribute(): string
    {
        return Carbon::parse($this->exit_time)->format('H:i');
    }

    /**
     * Get the expected work hours per day.
     */
    public function getExpectedWorkHoursAttribute(): float
    {
        $enter = Carbon::parse($this->enter_time);
        $exit = Carbon::parse($this->exit_time);
        
        return $enter->diffInHours($exit, true);
    }

    /**
     * Get the expected work minutes per day.
     */
    public function getExpectedWorkMinutesAttribute(): int
    {
        $enter = Carbon::parse($this->enter_time);
        $exit = Carbon::parse($this->exit_time);
        
        return $enter->diffInMinutes($exit, true);
    }

    /**
     * Check if a given time is late for entry.
     */
    public function isLateEntry(string $time): bool
    {
        $entryTime = Carbon::parse($time);
        $expectedTime = Carbon::parse($this->enter_time);
        
        return $entryTime->gt($expectedTime);
    }

    /**
     * Check if a given time is early exit.
     */
    public function isEarlyExit(string $time): bool
    {
        $exitTime = Carbon::parse($time);
        $expectedTime = Carbon::parse($this->exit_time);
        
        return $exitTime->lt($expectedTime);
    }

    /**
     * Boot method to ensure only one record exists.
     */
    protected static function boot()
    {
        parent::boot();

        static::creating(function ($model) {
            // Delete any existing records before creating a new one
            static::query()->delete();
        });
    }
} 