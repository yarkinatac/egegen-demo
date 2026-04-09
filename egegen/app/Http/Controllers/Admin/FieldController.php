<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\ProductField;
use Illuminate\Http\Request;

class FieldController extends Controller
{
    public function index()
    {
        $fields = ProductField::orderBy('sort_order')->get();
        return view('admin.fields.index', compact('fields'));
    }

    public function create()
    {
        return view('admin.fields.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'field_key' => 'required|string|unique:product_fields,field_key',
            'type' => 'required|in:input,select,checkbox,radio',
            'options' => 'nullable|string',
            'is_required' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        $validated['is_required'] = $request->has('is_required');
        $validated['sort_order'] = $request->sort_order ?? 0;

        // Options string'i array'e çevir
        if (!empty($validated['options'])) {
            $validated['options'] = array_filter(
                array_map('trim', explode(',', $validated['options']))
            );
        }

        ProductField::create($validated);

        return redirect('/admin/fields')->with('success', 'Alan başarıyla oluşturuldu.');
    }

    public function edit($id)
    {
        $field = ProductField::findOrFail($id);
        return view('admin.fields.edit', compact('field'));
    }

    public function update(Request $request, $id)
    {
        $field = ProductField::findOrFail($id);

        $validated = $request->validate([
            'label' => 'required|string|max:255',
            'type' => 'required|in:input,select,checkbox,radio',
            'options' => 'nullable|string',
            'is_required' => 'boolean',
            'sort_order' => 'nullable|integer'
        ]);

        $validated['is_required'] = $request->has('is_required');
        $validated['sort_order'] = $request->sort_order ?? 0;

        if (!empty($validated['options'])) {
            $validated['options'] = array_filter(
                array_map('trim', explode(',', $validated['options']))
            );
        } else {
            $validated['options'] = null;
        }

        $field->update($validated);

        return redirect('/admin/fields')->with('success', 'Alan güncellendi.');
    }

    public function destroy($id)
    {
        $field = ProductField::findOrFail($id);
        $field->delete();

        return redirect('/admin/fields')->with('success', 'Alan silindi.');
    }
}