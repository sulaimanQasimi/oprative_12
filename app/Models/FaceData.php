<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Builder;

class FaceData extends Model
{
    use HasFactory;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'employee_id',
        'face_descriptor',
        'encoding_model',
        'image_path',
        'confidence_score',
        'is_active',
        'notes',
    ];

    /**
     * The attributes that should be cast.
     *
     * @var array<string, string>
     */
    protected $casts = [
        'face_descriptor' => 'array',
        'confidence_score' => 'decimal:4',
        'is_active' => 'boolean',
    ];

    /**
     * Get the employee that owns this face data.
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }

    /**
     * Scope a query to only include active face data.
     */
    public function scopeActive(Builder $query): Builder
    {
        return $query->where('is_active', true);
    }

    /**
     * Scope a query to filter by encoding model.
     */
    public function scopeByModel(Builder $query, string $model): Builder
    {
        return $query->where('encoding_model', $model);
    }

    /**
     * Check if the face descriptor is valid.
     */
    public function isValidDescriptor(): bool
    {
        return is_array($this->face_descriptor) && count($this->face_descriptor) > 0;
    }

    /**
     * Get the face descriptor as a flat array.
     */
    public function getDescriptorArray(): array
    {
        return $this->face_descriptor ?? [];
    }

    /**
     * Calculate euclidean distance between two face descriptors.
     */
    public static function calculateDistance(array $descriptor1, array $descriptor2): float
    {
        if (count($descriptor1) !== count($descriptor2)) {
            throw new \InvalidArgumentException('Descriptors must have the same length');
        }

        $sum = 0;
        for ($i = 0; $i < count($descriptor1); $i++) {
            $sum += pow($descriptor1[$i] - $descriptor2[$i], 2);
        }

        return sqrt($sum);
    }

    /**
     * Find the best matching face data for a given descriptor.
     */
    public static function findBestMatch(array $inputDescriptor, float $threshold = 0.6): ?self
    {
        $activeFaceData = self::active()->get();
        $bestMatch = null;
        $bestDistance = PHP_FLOAT_MAX;

        foreach ($activeFaceData as $faceData) {
            if (!$faceData->isValidDescriptor()) {
                continue;
            }

            $distance = self::calculateDistance($inputDescriptor, $faceData->getDescriptorArray());
            
            if ($distance < $threshold && $distance < $bestDistance) {
                $bestDistance = $distance;
                $bestMatch = $faceData;
            }
        }

        return $bestMatch;
    }

    /**
     * Verify if a face descriptor matches this face data.
     */
    public function verify(array $inputDescriptor, float $threshold = 0.6): bool
    {
        if (!$this->isValidDescriptor()) {
            return false;
        }

        $distance = self::calculateDistance($inputDescriptor, $this->getDescriptorArray());
        return $distance < $threshold;
    }
}
