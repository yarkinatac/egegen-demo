<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Product;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProductController extends Controller
{
    public function index()
    {
        $products = Product::where('is_active', true)
            ->with(['variations', 'fieldValues.field'])
            ->get();

        return response()->json($products);
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

        return response()->json($product, 201);
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

        return response()->json($product);
    }

    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json(['message' => 'Urun silindi']);
    }
}