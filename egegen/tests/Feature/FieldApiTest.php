<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class FieldApiTest extends TestCase
{
    use RefreshDatabase;

    public function test_alan_listesi_getirilebilir(): void
    {
        $response = $this->getJson('/api/fields');
        $response->assertStatus(200);
        $response->assertJsonIsArray();
    }

    public function test_alan_olusturulabilir(): void
    {
        $data = [
            'label' => 'Mensei',
            'field_key' => 'mensei',
            'type' => 'input',
            'sort_order' => 1,
            'is_required' => false,
        ];

        $response = $this->postJson('/api/fields', $data);
        $response->assertStatus(201);
        $response->assertJsonFragment(['label' => 'Mensei', 'field_key' => 'mensei']);

        $this->assertDatabaseHas('product_fields', ['field_key' => 'mensei']);
    }

    public function test_select_alan_seceneklerle_olusturulabilir(): void
    {
        $data = [
            'label' => 'Isleme',
            'field_key' => 'isleme',
            'type' => 'select',
            'options' => ['Washed', 'Natural', 'Honey'],
            'sort_order' => 2,
        ];

        $response = $this->postJson('/api/fields', $data);
        $response->assertStatus(201);

        // Secenekler JSON olarak kaydedilmis olmali
        $this->assertDatabaseHas('product_fields', ['field_key' => 'isleme']);
    }

    public function test_alan_guncellenebilir(): void
    {
        $field = \App\Models\ProductField::create([
            'label' => 'Eski',
            'field_key' => 'eski',
            'type' => 'input',
            'sort_order' => 1,
        ]);

        $response = $this->putJson("/api/fields/{$field->id}", [
            'label' => 'Guncellenmis Alan',
        ]);

        $response->assertStatus(200);
        $this->assertDatabaseHas('product_fields', ['id' => $field->id, 'label' => 'Guncellenmis Alan']);
    }

    public function test_alan_silinebilir(): void
    {
        $field = \App\Models\ProductField::create([
            'label' => 'Silinecek',
            'field_key' => 'silinecek',
            'type' => 'input',
            'sort_order' => 1,
        ]);

        $response = $this->deleteJson("/api/fields/{$field->id}");
        $response->assertStatus(200);
        $this->assertDatabaseMissing('product_fields', ['id' => $field->id]);
    }

    public function test_ayni_field_key_tekrar_kullanilamaz(): void
    {
        \App\Models\ProductField::create([
            'label' => 'Ilk',
            'field_key' => 'ayni_key',
            'type' => 'input',
            'sort_order' => 1,
        ]);

        // Ayni key ile tekrar olustur
        $response = $this->postJson('/api/fields', [
            'label' => 'Ikinci',
            'field_key' => 'ayni_key',
            'type' => 'input',
            'sort_order' => 2,
        ]);

        // Unique constraint hatasi vermeli
        $response->assertStatus(422);
        $response->assertJsonValidationErrors(['field_key']);
    }
}
