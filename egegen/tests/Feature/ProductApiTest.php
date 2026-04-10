<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class ProductApiTest extends TestCase
{
    // Her testten once veritabanini sifirla
    use RefreshDatabase;

    public function test_urun_listesi_getirilebilir(): void
    {
        // GET /api/products endpoint'ine istek at
        $response = $this->getJson('/api/products');

        // 200 donmeli ve JSON olmali
        $response->assertStatus(200);
        $response->assertJsonIsArray();
    }

    public function test_urun_olusturulabilir(): void
    {
        // Yeni urun verisi
        $data = [
            'name' => 'Test Kahve',
            'price' => 150,
            'origin' => 'Brezilya',
            'roast_level' => 'Medium',
            'is_active' => true,
        ];

        // POST ile urun olustur
        $response = $this->postJson('/api/products', $data);

        // 201 (created) donmeli
        $response->assertStatus(201);

        // Donen JSON'da urun bilgileri olmali
        $response->assertJsonFragment([
            'name' => 'Test Kahve',
            'origin' => 'Brezilya',
        ]);

        // Slug otomatik olusturulmus olmali
        $response->assertJsonFragment([
            'slug' => 'test-kahve',
        ]);

        // Veritabaninda kayit var mi kontrol et
        $this->assertDatabaseHas('products', [
            'name' => 'Test Kahve',
            'price' => 150,
        ]);
    }

    public function test_urun_varyasyonla_olusturulabilir(): void
    {
        // Once varyasyon attribute'u olustur
        $attr = \App\Models\VariationAttribute::create(['name' => 'Boyut']);
        $val250 = $attr->values()->create(['value' => '250g']);
        $val500 = $attr->values()->create(['value' => '500g']);

        $data = [
            'name' => 'Varyasyonlu Kahve',
            'price' => 200,
            'is_active' => true,
            'variations' => [
                ['sku' => 'VK-250', 'price' => '200.00', 'stock' => 30, 'attribute_values' => [$val250->id]],
                ['sku' => 'VK-500', 'price' => '360.00', 'stock' => 15, 'attribute_values' => [$val500->id]],
            ],
        ];

        $response = $this->postJson('/api/products', $data);
        $response->assertStatus(201);

        // 2 varyasyon olusmus olmali
        $this->assertDatabaseCount('product_variations', 2);
        $this->assertDatabaseHas('product_variations', ['sku' => 'VK-250', 'stock' => 30]);
        $this->assertDatabaseHas('product_variations', ['sku' => 'VK-500', 'stock' => 15]);
    }

    public function test_urun_dinamik_alanla_olusturulabilir(): void
    {
        // Dinamik alan tanimla
        $field = \App\Models\ProductField::create([
            'label' => 'Aroma',
            'field_key' => 'aroma',
            'type' => 'input',
            'sort_order' => 1,
        ]);

        $data = [
            'name' => 'Aromali Kahve',
            'price' => 180,
            'is_active' => true,
            'fields' => [
                $field->id => 'Cikolata, Findik',
            ],
        ];

        $response = $this->postJson('/api/products', $data);
        $response->assertStatus(201);

        // Dinamik alan degeri kaydedilmis olmali
        $this->assertDatabaseHas('product_field_values', [
            'product_field_id' => $field->id,
            'value' => 'Cikolata, Findik',
        ]);
    }

    public function test_urun_guncellenebilir(): void
    {
        // Urun olustur
        $product = \App\Models\Product::create([
            'name' => 'Eski Isim',
            'slug' => 'eski-isim',
            'price' => 100,
            'is_active' => true,
        ]);

        // Guncelle
        $response = $this->putJson("/api/products/{$product->id}", [
            'name' => 'Yeni Isim',
            'price' => 250,
        ]);

        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Yeni Isim']);

        // Veritabaninda guncel deger var mi
        $this->assertDatabaseHas('products', [
            'id' => $product->id,
            'name' => 'Yeni Isim',
            'price' => 250,
        ]);
    }

    public function test_urun_silinebilir(): void
    {
        $product = \App\Models\Product::create([
            'name' => 'Silinecek',
            'slug' => 'silinecek',
            'price' => 50,
            'is_active' => true,
        ]);

        $response = $this->deleteJson("/api/products/{$product->id}");
        $response->assertStatus(200);

        // Veritabaninda artik olmamali
        $this->assertDatabaseMissing('products', ['id' => $product->id]);
    }

    public function test_urun_isim_ve_fiyat_zorunlu(): void
    {
        // Bos data gonder
        $response = $this->postJson('/api/products', []);

        // Validation hatasi (422) donmeli
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['name', 'price']);
    }

    public function test_slug_uzerinden_urun_detayi_getirilebilir(): void
    {
        $product = \App\Models\Product::create([
            'name' => 'Detay Testi',
            'slug' => 'detay-testi',
            'price' => 175,
            'is_active' => true,
        ]);

        $response = $this->getJson('/api/products/detail/detay-testi');
        $response->assertStatus(200);
        $response->assertJsonFragment(['name' => 'Detay Testi']);
    }

    public function test_olmayan_slug_404_doner(): void
    {
        $response = $this->getJson('/api/products/detail/yok-boyle-bir-urun');
        $response->assertStatus(404);
    }
}
