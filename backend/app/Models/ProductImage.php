<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class ProductImage extends Model
{
    protected $fillable = ['product_id', 'image_path'];
    
    // Automatically include the full URL in JSON responses
    protected $appends = ['url'];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    /**
     * Accessor to convert 'products/filename.jpg' into a full URL
     */
    public function getUrlAttribute()
    {
        return asset('storage/' . $this->image_path);
    }
}