<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\VariationAttribute;
use App\Models\VariationAttributeValue;
use Illuminate\Http\Request;

class AttributeController extends Controller
{
    public function index()
    {
        $attributes = VariationAttribute::with('values')->get();
        return view('admin.attributes.index', compact('attributes'));
    }

    public function create()
    {
        return view('admin.attributes.create');
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'nullable|string'
        ]);

        $attribute = VariationAttribute::create(['name' => $validated['name']]);

        if (!empty($validated['values'])) {
            $values = array_filter(
                array_map('trim', explode(',', $validated['values']))
            );

            foreach ($values as $value) {
                VariationAttributeValue::create([
                    'variation_attribute_id' => $attribute->id,
                    'value' => $value
                ]);
            }
        }

        return redirect('/admin/attributes')->with('success', 'Varyasyon tipi oluşturuldu.');
    }

    public function edit($id)
    {
        $attribute = VariationAttribute::with('values')->findOrFail($id);
        return view('admin.attributes.edit', compact('attribute'));
    }

    public function update(Request $request, $id)
    {
        $attribute = VariationAttribute::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'values' => 'nullable|string'
        ]);

        $attribute->update(['name' => $validated['name']]);

        // Eski değerleri sil, yenilerini ekle
        $attribute->values()->delete();

        if (!empty($validated['values'])) {
            $values = array_filter(
                array_map('trim', explode(',', $validated['values']))
            );

            foreach ($values as $value) {
                VariationAttributeValue::create([
                    'variation_attribute_id' => $attribute->id,
                    'value' => $value
                ]);
            }
        }

        return redirect('/admin/attributes')->with('success', 'Varyasyon tipi güncellendi.');
    }

    public function destroy($id)
    {
        $attribute = VariationAttribute::findOrFail($id);
        $attribute->delete();

        return redirect('/admin/attributes')->with('success', 'Varyasyon tipi silindi.');
    }
}