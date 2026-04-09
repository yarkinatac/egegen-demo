<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductField;
use App\Models\ProductFieldValue;
use App\Models\VariationAttribute;
use App\Models\ProductVariation;
use App\Models\ProductVariationAttribute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::orderBy('created_at', 'desc')->get();
        return view('admin.products.index', compact('products'));
    }

    public function create()
    {
        $fields = ProductField::orderBy('sort_order')->get();
        $attributes = VariationAttribute::with('values')->get();
        return view('admin.products.create', compact('fields', 'attributes'));
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'origin' => 'nullable|string',
            'roast_level' => 'nullable|string',
            'is_active' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($request->name);
        $validated['is_active'] = $request->has('is_active');

        $product = Product::create($validated);

        // Dinamik alan değerlerini kaydet
        if ($request->has('fields')) {
            foreach ($request->fields as $fieldId => $value) {
                if (!empty($value)) {
                    ProductFieldValue::create([
                        'product_id' => $product->id,
                        'product_field_id' => $fieldId,
                        'value' => is_array($value) ? json_encode($value) : $value
                    ]);
                }
            }
        }

        // Varyasyonları kaydet
        if ($request->has('variations')) {
            foreach ($request->variations as $variation) {
                if (!empty($variation['sku'])) {
                    $productVariation = ProductVariation::create([
                        'product_id' => $product->id,
                        'sku' => $variation['sku'],
                        'price' => $variation['price'],
                        'stock' => $variation['stock']
                    ]);

                    if (!empty($variation['attribute_values'])) {
                        foreach ($variation['attribute_values'] as $valueId) {
                            ProductVariationAttribute::create([
                                'product_variation_id' => $productVariation->id,
                                'variation_attribute_value_id' => $valueId
                            ]);
                        }
                    }
                }
            }
        }

        return redirect('/admin/products')->with('success', 'Ürün başarıyla oluşturuldu.');
    }

    public function edit($id)
    {
        $product = Product::with([
            'fieldValues.field',
            'variations.attributeValues'
        ])->findOrFail($id);

        $fields = ProductField::orderBy('sort_order')->get();
        $attributes = VariationAttribute::with('values')->get();

        return view('admin.products.edit', compact('product', 'fields', 'attributes'));
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'origin' => 'nullable|string',
            'roast_level' => 'nullable|string',
        ]);

        $validated['slug'] = Str::slug($request->name);
        $validated['is_active'] = $request->has('is_active');

        $product->update($validated);

        // Dinamik alanları güncelle
        $product->fieldValues()->delete();
        if ($request->has('fields')) {
            foreach ($request->fields as $fieldId => $value) {
                if (!empty($value)) {
                    ProductFieldValue::create([
                        'product_id' => $product->id,
                        'product_field_id' => $fieldId,
                        'value' => is_array($value) ? json_encode($value) : $value
                    ]);
                }
            }
        }

        // Varyasyonları güncelle
        foreach ($product->variations as $variation) {
            $variation->attributeValues()->detach();
            $variation->delete();
        }

        if ($request->has('variations')) {
            foreach ($request->variations as $variation) {
                if (!empty($variation['sku'])) {
                    $productVariation = ProductVariation::create([
                        'product_id' => $product->id,
                        'sku' => $variation['sku'],
                        'price' => $variation['price'],
                        'stock' => $variation['stock']
                    ]);

                    if (!empty($variation['attribute_values'])) {
                        foreach ($variation['attribute_values'] as $valueId) {
                            ProductVariationAttribute::create([
                                'product_variation_id' => $productVariation->id,
                                'variation_attribute_value_id' => $valueId
                            ]);
                        }
                    }
                }
            }
        }

        return redirect('/admin/products')->with('success', 'Ürün başarıyla güncellendi.');
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect('/admin/products')->with('success', 'Ürün silindi.');
    }
}