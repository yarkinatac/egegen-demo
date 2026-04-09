<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class VariationAttribute extends Model
{
    protected $fillable = [
        'name'
    ];

    public function values()
    {
        return $this->hasMany(VariationAttributeValue::class);
    }
}