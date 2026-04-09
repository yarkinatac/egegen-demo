<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductVariationAttribute extends Model
{
    protected $fillable = [
        'product_variation_id',
        'variation_attribute_value_id'
    ];

    public function variation()
    {
        return $this->belongsTo(ProductVariation::class, 'product_variation_id');
    }

    public function attributeValue()
    {
        return $this->belongsTo(VariationAttributeValue::class, 'variation_attribute_value_id');
    }
}