<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\ProductField;
use Illuminate\Http\Request;

class ProductFieldController extends Controller
{
    public function index()
    {
        $fields = ProductField::orderBy('sort_order')->get();

        return response()->json($fields);
    }

    public function show($id)
    {
        $field = ProductField::findOrFail($id);
        return response()->json($field);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'field_key' => 'required|string|unique:product_fields,field_key',
            'type' => 'required|in:input,select,checkbox,radio',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $field = ProductField::create($validated);

        return response()->json($field, 201);
    }

    public function update(Request $request, $id)
    {
        $field = ProductField::findOrFail($id);

        $validated = $request->validate([
            'label' => 'sometimes|string|max:255',
            'type' => 'sometimes|in:input,select,checkbox,radio',
            'options' => 'nullable|array',
            'is_required' => 'boolean',
            'sort_order' => 'integer'
        ]);

        $field->update($validated);

        return response()->json($field);
    }

    public function destroy($id)
    {
        $field = ProductField::findOrFail($id);
        $field->delete();

        return response()->json(['message' => 'Alan silindi']);
    }
}