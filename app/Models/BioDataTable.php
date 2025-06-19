<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class BioDataTable extends Model
{
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

    protected $casts = [
        'personal_info_id' => 'integer',
    ];

    /**
     * Get the employee that owns the bio data
     */
    public function employee(): BelongsTo
    {
        return $this->belongsTo(Employee::class);
    }
}
