<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class AttributeApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_attribute_listesi_getirilebilir(): void
    {
        $response = $this->getJson('/api/attributes');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
    }

    public function test_attribute_degerlerle_olusturulabilir(): void
    {
        $data = [
            'name' => 'Ogutme Tipi',
            'values' => ['Espresso', 'French Press', 'Chemex'],
        ];

        $response = $this->postJson('/api/attributes', $data);
        $response->assertStatus(201);
        $response->assertJsonFragment(['name' => 'Ogutme Tipi']);

        // 3 deger olusmus olmali
        $this->assertDatabaseCount('variation_attribute_values', 3);
        $this->assertDatabaseHas('variation_attribute_values', ['value' => 'Espresso']);
    }

    public function test_attribute_guncellenebilir(): void
    {
        $attr = \App\Models\VariationAttribute::create(['name' => 'Eski']);
        $attr->values()->create(['value' => 'Deger1']);

        $response = $this->putJson("/api/attributes/{$attr->id}", [
            'name' => 'Yeni Isim',
            'values' => ['A', 'B'],
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('variation_attributes', ['name' => 'Yeni Isim']);

        // Eski deger silinip yenileri eklenmis olmali
        $this->assertDatabaseMissing('variation_attribute_values', ['value' => 'Deger1']);
        $this->assertDatabaseHas('variation_attribute_values', ['value' => 'A']);
        $this->assertDatabaseHas('variation_attribute_values', ['value' => 'B']);
    }

    public function test_attribute_silinebilir(): void
    {
        $attr = \App\Models\VariationAttribute::create(['name' => 'Silinecek']);

        $response = $this->deleteJson("/api/attributes/{$attr->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('variation_attributes', ['id' => $attr->id]);
    }
}
