<?php

namespace Database\Seeders;

use App\Models\Product;
use App\Models\ProductField;
use App\Models\ProductFieldValue;
use App\Models\VariationAttribute;
use App\Models\VariationAttributeValue;
use App\Models\ProductVariation;
use App\Models\ProductVariationAttribute;
use Illuminate\Database\Seeder;

class ProductSeeder extends Seeder
{
    public function run(): void
    {
        // Dinamik alanlar
        $aromaField = ProductField::create([
            'label' => 'Aroma Notları',
            'field_key' => 'aroma_notes',
            'type' => 'input',
            'is_required' => false,
            'sort_order' => 1
        ]);

        $processField = ProductField::create([
            'label' => 'İşleme Metodu',
            'field_key' => 'process_method',
            'type' => 'select',
            'options' => ['Washed', 'Natural', 'Honey'],
            'is_required' => false,
            'sort_order' => 2
        ]);

        // Varyasyon attribute'ları
        $grindAttribute = VariationAttribute::create(['name' => 'Öğütme Tipi']);
        $sizeAttribute = VariationAttribute::create(['name' => 'Paket Boyutu']);

        // Öğütme tipi değerleri
        $espresso = VariationAttributeValue::create(['variation_attribute_id' => $grindAttribute->id, 'value' => 'Espresso']);
        $frenchPress = VariationAttributeValue::create(['variation_attribute_id' => $grindAttribute->id, 'value' => 'French Press']);
        $chemex = VariationAttributeValue::create(['variation_attribute_id' => $grindAttribute->id, 'value' => 'Chemex']);
        $wholeBean = VariationAttributeValue::create(['variation_attribute_id' => $grindAttribute->id, 'value' => 'Tam Çekirdek']);

        // Paket boyutu değerleri
        $size250 = VariationAttributeValue::create(['variation_attribute_id' => $sizeAttribute->id, 'value' => '250g']);
        $size500 = VariationAttributeValue::create(['variation_attribute_id' => $sizeAttribute->id, 'value' => '500g']);

        // Ürün
        $product = Product::create([
            'name' => 'Ethiopia Yirgacheffe',
            'slug' => 'ethiopia-yirgacheffe',
            'description' => 'Yüksek rakımda yetişen, çiçeksi ve narenciye notalarıyla öne çıkan single origin kahve.',
            'price' => 180.00,
            'origin' => 'Etiyopya',
            'roast_level' => 'Light',
            'images' => ['https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=800&q=80'],
            'is_active' => true
        ]);

        // Dinamik alan değerleri
        ProductFieldValue::create([
            'product_id' => $product->id,
            'product_field_id' => $aromaField->id,
            'value' => 'Çiçeksi, Narenciye, Bergamot'
        ]);

        ProductFieldValue::create([
            'product_id' => $product->id,
            'product_field_id' => $processField->id,
            'value' => 'Washed'
        ]);

        // Varyasyonlar
        $variations = [
            ['sku' => 'YRKN-ESP-250', 'price' => 180.00, 'stock' => 50, 'grind' => $espresso, 'size' => $size250],
            ['sku' => 'YRKN-FRP-250', 'price' => 180.00, 'stock' => 30, 'grind' => $frenchPress, 'size' => $size250],
            ['sku' => 'YRKN-CHM-250', 'price' => 180.00, 'stock' => 20, 'grind' => $chemex, 'size' => $size250],
            ['sku' => 'YRKN-WHL-250', 'price' => 175.00, 'stock' => 40, 'grind' => $wholeBean, 'size' => $size250],
            ['sku' => 'YRKN-ESP-500', 'price' => 320.00, 'stock' => 25, 'grind' => $espresso, 'size' => $size500],
            ['sku' => 'YRKN-FRP-500', 'price' => 320.00, 'stock' => 15, 'grind' => $frenchPress, 'size' => $size500],
        ];

        foreach ($variations as $v) {
            $variation = ProductVariation::create([
                'product_id' => $product->id,
                'sku' => $v['sku'],
                'price' => $v['price'],
                'stock' => $v['stock']
            ]);

            ProductVariationAttribute::create([
                'product_variation_id' => $variation->id,
                'variation_attribute_value_id' => $v['grind']->id
            ]);

            ProductVariationAttribute::create([
                'product_variation_id' => $variation->id,
                'variation_attribute_value_id' => $v['size']->id
            ]);
        }

        // 2. urun
        $product2 = Product::create([
            'name' => 'Colombia Supremo',
            'slug' => 'colombia-supremo',
            'description' => 'Karamel ve findik aromali, yumusak govdeli bir Latin Amerika kahvesi.',
            'price' => 210.00,
            'origin' => 'Kolombiya',
            'roast_level' => 'Medium',
            'images' => ['https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=800&q=80'],
            'is_active' => true
        ]);

        ProductFieldValue::create([
            'product_id' => $product2->id,
            'product_field_id' => $aromaField->id,
            'value' => 'Karamel, Findik, Cikolata'
        ]);

        ProductFieldValue::create([
            'product_id' => $product2->id,
            'product_field_id' => $processField->id,
            'value' => 'Natural'
        ]);

        $variations2 = [
            ['sku' => 'COL-ESP-250', 'price' => 210.00, 'stock' => 35, 'grind' => $espresso, 'size' => $size250],
            ['sku' => 'COL-FRP-250', 'price' => 210.00, 'stock' => 20, 'grind' => $frenchPress, 'size' => $size250],
            ['sku' => 'COL-WHL-250', 'price' => 205.00, 'stock' => 45, 'grind' => $wholeBean, 'size' => $size250],
            ['sku' => 'COL-ESP-500', 'price' => 380.00, 'stock' => 15, 'grind' => $espresso, 'size' => $size500],
        ];

        foreach ($variations2 as $v) {
            $variation = ProductVariation::create([
                'product_id' => $product2->id,
                'sku' => $v['sku'],
                'price' => $v['price'],
                'stock' => $v['stock']
            ]);

            ProductVariationAttribute::create([
                'product_variation_id' => $variation->id,
                'variation_attribute_value_id' => $v['grind']->id
            ]);

            ProductVariationAttribute::create([
                'product_variation_id' => $variation->id,
                'variation_attribute_value_id' => $v['size']->id
            ]);
        }
    }
}