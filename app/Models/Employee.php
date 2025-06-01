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
