<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use App\Models\ProductFieldValue;
use App\Models\ProductVariation;
use App\Models\ProductVariationAttribute;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index(Request $request)
    {
        $query = Product::with(['variations', 'fieldValues.field']);

        if (!$request->has('all')) {
            $query->where('is_active', true);
        }

        $products = $query->orderBy('created_at', 'desc')->get();

        return response()->json($products);
    }

    public function find($id)
    {
        $product = Product::with([
            'fieldValues.field',
            'variations.attributeValues.attribute'
        ])->findOrFail($id);

        return response()->json($product);
    }

    public function show($slug)
    {
        $product = Product::where('slug', $slug)
            ->with([
                'fieldValues.field',
                'variations.attributeValues.attribute'
            ])
            ->firstOrFail();

        return response()->json($product);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string',
            'price' => 'required|numeric|min:0',
            'origin' => 'nullable|string',
            'roast_level' => 'nullable|string',
            'images' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        $validated['slug'] = Str::slug($request->name);

        $product = Product::create($validated);

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

        if ($request->has('variations')) {
            foreach ($request->variations as $variation) {
                if (!empty($variation['sku'])) {
                    $pv = ProductVariation::create([
                        'product_id' => $product->id,
                        'sku' => $variation['sku'],
                        'price' => $variation['price'],
                        'stock' => $variation['stock']
                    ]);

                    if (!empty($variation['attribute_values'])) {
                        foreach ($variation['attribute_values'] as $valueId) {
                            ProductVariationAttribute::create([
                                'product_variation_id' => $pv->id,
                                'variation_attribute_value_id' => $valueId
                            ]);
                        }
                    }
                }
            }
        }

        return response()->json($product->load(['fieldValues.field', 'variations.attributeValues']), 201);
    }

    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validated = $request->validate([
            'name' => 'sometimes|string|max:255',
            'description' => 'nullable|string',
            'price' => 'sometimes|numeric|min:0',
            'origin' => 'nullable|string',
            'roast_level' => 'nullable|string',
            'images' => 'nullable|array',
            'is_active' => 'boolean'
        ]);

        if ($request->has('name')) {
            $validated['slug'] = Str::slug($request->name);
        }

        $product->update($validated);

        if ($request->has('fields')) {
            $product->fieldValues()->delete();
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

        if ($request->has('variations')) {
            foreach ($product->variations as $v) {
                $v->attributeValues()->detach();
                $v->delete();
            }
            foreach ($request->variations as $variation) {
                if (!empty($variation['sku'])) {
                    $pv = ProductVariation::create([
                        'product_id' => $product->id,
                        'sku' => $variation['sku'],
                        'price' => $variation['price'],
                        'stock' => $variation['stock']
                    ]);

                    if (!empty($variation['attribute_values'])) {
                        foreach ($variation['attribute_values'] as $valueId) {
                            ProductVariationAttribute::create([
                                'product_variation_id' => $pv->id,
                                'variation_attribute_value_id' => $valueId
                            ]);
                        }
                    }
                }
            }
        }

        return response()->json($product->load(['fieldValues.field', 'variations.attributeValues']));
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Urun silindi']);
    }
}