<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'name',
        'slug',
        'description',
        'price',
        'origin',
        'roast_level',
        'images',
        'is_active'
    ];

    protected $casts = [
        'images' => 'array',
        'is_active' => 'boolean',
        'price' => 'decimal:2'
    ];

    public function fieldValues()
    {
        return $this->hasMany(ProductFieldValue::class);
    }

    public function variations()
    {
        return $this->hasMany(ProductVariation::class);
    }
}