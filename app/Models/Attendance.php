<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Attendance extends Model
{
    protected $fillable = [
        'employee_id',
        'enter_time',
        'exit_time',
        'date',
        'state', // P = Present, A = Absent, O = Other/Excused
    ];

    protected $casts = [
        'enter_time' => 'datetime',
        'exit_time' => 'datetime',
        'date' => 'date',
    ];

    /**
     * Get the employee that owns the attendance record
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
