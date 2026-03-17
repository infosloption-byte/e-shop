<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Category extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'image',
    ];

    /**
     * Appends custom attributes to the JSON form of the model.
     */
    protected $appends = ['image_url'];

    /**
     * Get the products associated with this category.
     */
    public function products()
    {
        return $this->hasMany(Product::class);
    }

    /**
     * Accessor to get the full URL for the category image.
     * This allows your React frontend to use 'image_url' directly.
     */
    public function getImageUrlAttribute()
    {
        if (!$this->image) {
            return null; // Or return a default placeholder URL
        }

        // Returns the full URL to the file in storage
        return asset('storage/' . $this->image);
    }
}