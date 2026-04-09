<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariationAttributeValue extends Model
{
    protected $fillable = [
        'variation_attribute_id',
        'value'
    ];

    public function attribute()
    {
        return $this->belongsTo(VariationAttribute::class, 'variation_attribute_id');
    }

    public function variations()
    {
        return $this->belongsToMany(ProductVariation::class, 'product_variation_attributes');
    }
}