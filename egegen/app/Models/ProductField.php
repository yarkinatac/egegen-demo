<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductField extends Model
{
    protected $fillable = [
        'label',
        'field_key',
        'type',
        'options',
        'is_required',
        'sort_order'
    ];

    protected $casts = [
        'options' => 'array',
        'is_required' => 'boolean'
    ];

    public function fieldValues()
    {
        return $this->hasMany(ProductFieldValue::class);
    }
}