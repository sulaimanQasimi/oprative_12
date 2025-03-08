<?php

namespace App\Pos\Account\Models;

use GeneaLabs\LaravelModelCaching\CachedModel;
use GeneaLabs\LaravelModelCaching\Traits\Cachable;
use Illuminate\Database\Eloquent\Model;
use Spatie\MediaLibrary\HasMedia;
use Spatie\MediaLibrary\InteractsWithMedia;
use Spatie\Translatable\HasTranslations;
class Type extends CachedModel implements HasMedia
{
    use InteractsWithMedia;
    use HasTranslations;
    use Cachable;

    protected $cachePrefix = "tomato_types_";

    public $translatable = [
        'name',
        'description'
    ];

    /**
     * @var array
     */
    protected $fillable = ['order', 'for','name', 'key','type', 'description', 'color', 'icon', 'parent_id','model_type','model_id','is_activated','created_at', 'updated_at'];
}
