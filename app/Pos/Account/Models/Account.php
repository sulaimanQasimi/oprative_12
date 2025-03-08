<?php

namespace App\Pos\Account\Models;

use Filament\Models\Contracts\HasAvatar;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Notifications\Notifiable;
use Laravel\Sanctum\HasApiTokens;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
class Account extends Model implements HasMedia, HasAvatar
{
    use InteractsWithMedia;
    use HasApiTokens, HasFactory, Notifiable;
    use SoftDeletes;

    /**
     * @var array
     */
    protected $fillable = [
        'email',
        'phone',
        'parent_id',
        'type',
        'name',
        'username',
        'loginBy',
        'address',
        'password',
        'otp_code',
        'otp_activated_at',
        'last_login',
        'agent',
        'host',
        'is_login',
        'is_active',
        'deleted_at',
        'created_at',
        'updated_at'
    ];

    protected $casts = [
        'is_login' => 'boolean',
        'is_active' => 'boolean'
    ];

    protected $dates = [
        'deleted_at',
        'created_at',
        'updated_at',
        'otp_activated_at',
        'last_login',
    ];

    protected $hidden = [
        'password',
        'remember_token',
        'otp_code',
        'otp_activated_at',
        'host',
        'agent',
    ];

    protected $appends = [
        'birthday',
        'gender'
    ];

    /**
     * @return string|null
     */
    public function getFilamentAvatarUrl(): ?string
    {
        return  $this->getFirstMediaUrl('avatar')?? null;
    }
}
