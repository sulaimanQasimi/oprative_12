<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Support\Str;

class Category extends Model
{
    use SoftDeletes;

    protected $fillable = [
        'name',
        'slug',
        'description',
        'image',
        'parent_id',
        'level',
        'sort_order',
        'is_active',
        'is_featured',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'is_featured' => 'boolean',
        'level' => 'integer',
        'sort_order' => 'integer',
    ];

    protected static function boot()
    {
        parent::boot();

        // Auto-generate slug if not provided
        static::creating(function ($category) {
            if (empty($category->slug)) {
                $category->slug = Str::slug($category->name);
            }
        });

        // Update level based on parent
        static::creating(function ($category) {
            if ($category->parent_id) {
                $parent = self::find($category->parent_id);
                $category->level = $parent ? $parent->level + 1 : 0;
            } else {
                $category->level = 0;
            }
        });

        // Update level when parent changes
        static::updating(function ($category) {
            if ($category->isDirty('parent_id')) {
                if ($category->parent_id) {
                    $parent = self::find($category->parent_id);
                    $category->level = $parent ? $parent->level + 1 : 0;
                } else {
                    $category->level = 0;
                }
            }
        });
    }

    // Relationships
    public function parent()
    {
        return $this->belongsTo(Category::class, 'parent_id');
    }

    public function children()
    {
        return $this->hasMany(Category::class, 'parent_id')->orderBy('sort_order');
    }

    public function allChildren()
    {
        return $this->children()->with('allChildren');
    }

    public function ancestors()
    {
        return $this->belongsToMany(Category::class, 'category_ancestors', 'category_id', 'ancestor_id')
            ->withTimestamps();
    }

    public function descendants()
    {
        return $this->belongsToMany(Category::class, 'category_ancestors', 'ancestor_id', 'category_id')
            ->withTimestamps();
    }

    public function products()
    {
        return $this->hasMany(Product::class);
    }

    // Scopes
    public function scopeActive($query)
    {
        return $query->where('is_active', true);
    }

    public function scopeFeatured($query)
    {
        return $query->where('is_featured', true);
    }

    public function scopeRoot($query)
    {
        return $query->whereNull('parent_id');
    }

    public function scopeByLevel($query, $level)
    {
        return $query->where('level', $level);
    }

    // Helper methods
    public function isRoot()
    {
        return is_null($this->parent_id);
    }

    public function isLeaf()
    {
        return $this->children()->count() === 0;
    }

    public function hasChildren()
    {
        return $this->children()->count() > 0;
    }

    public function getFullPath()
    {
        $path = collect([$this]);
        $current = $this;

        while ($current->parent) {
            $current = $current->parent;
            $path->prepend($current);
        }

        return $path;
    }

    public function getFullPathString($separator = ' > ')
    {
        return $this->getFullPath()->pluck('name')->implode($separator);
    }

    public function getLevelName()
    {
        return match($this->level) {
            0 => 'Category',
            1 => 'SubCategory',
            2 => 'Final Category',
            default => 'Category Level ' . $this->level
        };
    }

    // Static methods for category management
    public static function getCategories()
    {
        return self::root()->with('allChildren')->active()->orderBy('sort_order')->get();
    }

    public static function getSubCategories($parentId = null)
    {
        $query = self::byLevel(1);
        if ($parentId) {
            $query->where('parent_id', $parentId);
        }
        return $query->active()->orderBy('sort_order')->get();
    }

    public static function getFinalCategories($parentId = null)
    {
        $query = self::byLevel(2);
        if ($parentId) {
            $query->where('parent_id', $parentId);
        }
        return $query->active()->orderBy('sort_order')->get();
    }

    public function getAllDescendants()
    {
        $descendants = collect();
        $this->loadDescendants($descendants);
        return $descendants;
    }

    private function loadDescendants(&$descendants)
    {
        foreach ($this->children as $child) {
            $descendants->push($child);
            $child->loadDescendants($descendants);
        }
    }

    public function getAllAncestors()
    {
        $ancestors = collect();
        $current = $this->parent;
        
        while ($current) {
            $ancestors->push($current);
            $current = $current->parent;
        }
        
        return $ancestors->reverse();
    }

    // Move category to new parent
    public function moveTo($newParentId = null)
    {
        $this->update(['parent_id' => $newParentId]);
        return $this->fresh();
    }

    // Check if category can be moved to target
    public function canMoveTo($targetCategoryId)
    {
        if ($targetCategoryId === $this->id) {
            return false; // Can't move to itself
        }

        if ($targetCategoryId) {
            $target = self::find($targetCategoryId);
            if (!$target) {
                return false;
            }

            // Check if target is not a descendant of this category
            $descendants = $this->getAllDescendants();
            return !$descendants->contains('id', $targetCategoryId);
        }

        return true; // Can move to root
    }
} 