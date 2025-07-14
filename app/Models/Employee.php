<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Employee extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'photo',
        'taskra_id',
        'first_name',
        'last_name',
        'employee_id',
        'department',
        'contact_info',
        'email',
        'gate_id',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'contact_info' => 'array',
    ];

    /**
     * Get the employee's full name.
     */
    public function getFullNameAttribute(): string
    {
        return $this->first_name . ' ' . $this->last_name;
    }

    /**
     * Get all fingerprints for this employee.
     */
    public function fingerprints(): HasMany
    {
        return $this->hasMany(SecuGenFingerprint::class);
    }

    /**
     * Get all attendance records for this employee.
     */
    public function attendanceRecords(): HasMany
    {
        return $this->hasMany(AttendanceRecord::class);
    }

    /**
     * Get the gate assigned to this employee
     */
    public function gate()
    {
        return $this->belongsTo(Gate::class);
    }

    /**
     * Get the attendance records for this employee
     */
    public function attendances()
    {
        return $this->hasMany(Attendance::class);
    }

    /**
     * Get the bio data records for this employee
     */
    public function bioDataTables()
    {
        return $this->hasMany(BioDataTable::class);
    }

    /**
     * Get the biometric record for this employee (should only be one)
     */
    public function biometric()
    {
        return $this->hasOne(BioDataTable::class);
    }

    /**
     * Get all attendance requests for this employee
     */
    public function attendanceRequests(): HasMany
    {
        return $this->hasMany(AttendanceRequest::class);
    }

    /**
     * Get all face data for this employee
     */
    public function faceData(): HasMany
    {
        return $this->hasMany(FaceData::class);
    }

    /**
     * Get active face data for this employee
     */
    public function activeFaceData(): HasMany
    {
        return $this->hasMany(FaceData::class)->where('is_active', true);
    }

    /**
     * Check if employee has face data registered
     */
    public function hasFaceData(): bool
    {
        return $this->faceData()->where('is_active', true)->exists();
    }

    /**
     * Get the primary face data for this employee
     */
    public function primaryFaceData()
    {
        return $this->faceData()->where('is_active', true)->first();
    }

    /**
     * Verify employee using face descriptor
     */
    public function verifyFace(array $inputDescriptor, float $threshold = 0.6): bool
    {
        $activeFaceData = $this->activeFaceData()->get();
        
        foreach ($activeFaceData as $faceData) {
            if ($faceData->verify($inputDescriptor, $threshold)) {
                return true;
            }
        }
        
        return false;
    }

    /**
     * Scope a query to only include employees from a specific department.
     */
    public function scopeByDepartment($query, string $department)
    {
        return $query->where('department', $department);
    }

    /**
     * Scope a query to search employees by name.
     */
    public function scopeSearchByName($query, string $search)
    {
        return $query->where(function ($q) use ($search) {
            $q->where('first_name', 'like', "%{$search}%")
              ->orWhere('last_name', 'like', "%{$search}%")
              ->orWhereRaw("CONCAT(first_name, ' ', last_name) like ?", ["%{$search}%"]);
        });
    }
}
