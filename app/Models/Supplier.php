<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Database\Eloquent\SoftDeletes;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Supplier extends Model
{
    use SoftDeletes;
    use HasFactory;
    use LogsActivity;
    protected $fillable = [
        'name',
        'contact_name',
        'phone',
        'email',
        'address',
        'city',
        'state',
        'country',
        'postal_code',
        'image',
        'id_number',
        // Bank information
        'bank_name',
        'bank_account_number',
        'bank_account_name',
        'bank_account_branch',
        'bank_account_swift_code',
        'bank_account_iban',
        // License information
        'license_number',
        'license_expiration_date',
        'license_type',
        'license_file',
        // Other information
        'notes',
        'status',
        'type',
        'website',
        'facebook',
        'instagram',
        'twitter',
        'linkedin',
        'youtube',
        'tiktok',
        'pinterest',
        'snapchat',
        'telegram',
        'whatsapp',
        // Personal information
        'personal_id_number',
        'personal_id_file',
        'personal_id_type',
        'personal_id_expiration_date',
    ];

    protected $appends = ['invoice_total'];
    public function getActivitylogOptions(): LogOptions
    {
        return LogOptions::defaults()
            ->logAll()
            ->logOnlyDirty()
            ->dontSubmitEmptyLogs()
            ->useLogName('supplier')
            ->setDescriptionForEvent(fn(string $eventName) => "This supplier has been {$eventName}")
            ->dontLogIfAttributesChangedOnly(['updated_at']);
    }

    public function purchases(): HasMany
    {
        return $this->hasMany(Purchase::class);
    }

    public function purchasePayment(): HasManyThrough
    {
        return $this->hasManyThrough(PurchasePayment::class, Purchase::class);
    }

    public function getInvoiceTotalAttribute()
    {
        return $this->purchases()
            ->join('purchase_items', 'purchases.id', '=', 'purchase_items.purchase_id')
            ->sum('purchase_items.total_price');
    }

    /**
     * Get the direct payments for the supplier.
     *
     * @return \Illuminate\Database\Eloquent\Relations\HasMany
     */
    public function payments(): HasMany
    {
        return $this->hasMany(PurchasePayment::class);
    }
}
