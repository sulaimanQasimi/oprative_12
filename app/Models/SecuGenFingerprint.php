<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SecuGenFingerprint extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'personal_info_id',
        'Manufacturer',
        'Model',
        'SerialNumber',
        'ImageWidth',
        'ImageHeight',
        'ImageDPI',
        'ImageQuality',
        'NFIQ',
        'ImageDataBase64',
        'BMPBase64',
        'ISOTemplateBase64',
        'TemplateBase64',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'ImageWidth' => 'integer',
        'ImageHeight' => 'integer',
        'ImageDPI' => 'integer',
        'ImageQuality' => 'integer',
        'NFIQ' => 'integer',
    ];

    /**
     * Get the employee that owns this fingerprint.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Scope a query to only include fingerprints from a specific manufacturer.
     */
    public function scopeByManufacturer($query, string $manufacturer)
    {
        return $query->where('Manufacturer', $manufacturer);
    }

    /**
     * Scope a query to only include fingerprints from a specific model.
     */
    public function scopeByModel($query, string $model)
    {
        return $query->where('Model', $model);
    }

    /**
     * Get the fingerprint quality description.
     */
    public function getQualityDescriptionAttribute(): string
    {
        return match (true) {
            $this->NFIQ >= 1 && $this->NFIQ <= 2 => 'Excellent',
            $this->NFIQ >= 3 && $this->NFIQ <= 4 => 'Good',
            $this->NFIQ >= 5 && $this->NFIQ <= 6 => 'Fair',
            $this->NFIQ >= 7 && $this->NFIQ <= 8 => 'Poor',
            default => 'Unknown',
        };
    }
}
