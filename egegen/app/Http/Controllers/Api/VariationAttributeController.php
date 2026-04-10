<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\VariationAttribute;
use App\Models\VariationAttributeValue;
use Illuminate\Http\Request;

class VariationAttributeController extends Controller
{
    public function index()
    {
        $attributes = VariationAttribute::with('values')->get();

        return response()->json($attributes);
    }

    public function show($id)
    {
        $attribute = VariationAttribute::with('values')->findOrFail($id);
        return response()->json($attribute);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'nullable|array',
            'values.*' => 'string'
        ]);

        $attribute = VariationAttribute::create(['name' => $validated['name']]);

        if (!empty($validated['values'])) {
            foreach ($validated['values'] as $value) {
                $attribute->values()->create(['value' => $value]);
            }
        }

        return response()->json($attribute->load('values'), 201);
    }

    public function update(Request $request, $id)
    {
        $attribute = VariationAttribute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'values' => 'nullable|array',
            'values.*' => 'string'
        ]);

        $attribute->update(['name' => $validated['name']]);

        if (!empty($validated['values'])) {
            $attribute->values()->delete();
            foreach ($validated['values'] as $value) {
                $attribute->values()->create(['value' => $value]);
            }
        }

        return response()->json($attribute->load('values'));
    }

    public function destroy($id)
    {
        $attribute = VariationAttribute::findOrFail($id);
        $attribute->delete();

        return response()->json(['message' => 'Varyasyon tipi silindi']);
    }
}