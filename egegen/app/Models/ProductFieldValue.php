<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductFieldValue extends Model
{
    protected $fillable = [
        'product_id',
        'product_field_id',
        'value'
    ];

    public function product()
    {
        return $this->belongsTo(Product::class);
    }

    public function field()
    {
        return $this->belongsTo(ProductField::class, 'product_field_id');
    }
}