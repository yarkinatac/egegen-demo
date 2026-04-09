@extends('layouts.admin')

@section('title', 'Ürün Düzenle')

@section('content')
<div class="flex items-center gap-4 mb-8">
    <a href="/admin/products" class="text-zinc-500 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
    </a>
    <div>
        <h3 class="text-xl font-semibold text-white">{{ $product->name }}</h3>
        <p class="text-sm text-zinc-500 mt-1">Ürünü düzenle</p>
    </div>
</div>

@if ($errors->any())
    <div class="bg-red-500/10 border border-red-500/50 text-red-500 p-4 rounded-xl mb-6">
        <ul class="list-disc pl-5">
            @foreach ($errors->all() as $error)
                <li class="text-sm">{{ $error }}</li>
            @endforeach
        </ul>
    </div>
@endif

<form action="/admin/products/{{ $product->id }}" method="POST">
    @csrf
    @method('PUT')

    <div class="grid grid-cols-3 gap-6">
        {{-- Sol kolon --}}
        <div class="col-span-2 space-y-6">

            {{-- Temel Bilgiler --}}
            <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h4 class="text-sm font-semibold text-white mb-4">Temel Bilgiler</h4>
                <div class="space-y-4">
                    <div>
                        <label class="block text-xs font-medium text-zinc-400 mb-1.5">Ürün Adı *</label>
                        <input type="text" name="name" value="{{ old('name', $product->name) }}"
                               class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                        @error('name')
                            <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                        @enderror
                    </div>

                    <div>
                        <label class="block text-xs font-medium text-zinc-400 mb-1.5">Açıklama</label>
                        <textarea name="description" rows="4"
                                  class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm resize-none">{{ old('description', $product->description) }}</textarea>
                    </div>

                    <div class="grid grid-cols-3 gap-4">
                        <div>
                            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Fiyat (₺) *</label>
                            <input type="number" name="price" value="{{ old('price', $product->price) }}" step="0.01"
                                   class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Köken</label>
                            <input type="text" name="origin" value="{{ old('origin', $product->origin) }}"
                                   class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                        </div>
                        <div>
                            <label class="block text-xs font-medium text-zinc-400 mb-1.5">Kavurma Seviyesi</label>
                            <select name="roast_level"
                                    class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#E8D5B7] text-sm">
                                <option value="">Seçin</option>
                                @foreach(['Light', 'Medium', 'Medium-Dark', 'Dark'] as $level)
                                    <option value="{{ $level }}" {{ old('roast_level', $product->roast_level) == $level ? 'selected' : '' }}>
                                        {{ $level }}
                                    </option>
                                @endforeach
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            {{-- Dinamik Alanlar --}}
            @if($fields->count() > 0)
            <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h4 class="text-sm font-semibold text-white mb-4">Özel Alanlar</h4>
                <div class="space-y-4">
                    @foreach($fields as $field)
                    @php
                        $existingValue = $product->fieldValues->firstWhere('product_field_id', $field->id);
                        $currentValue = old("fields.{$field->id}", $existingValue?->value ?? '');
                    @endphp
                    <div>
                        <label class="block text-xs font-medium text-zinc-400 mb-1.5">
                            {{ $field->label }}
                            @if($field->is_required) <span class="text-red-400">*</span> @endif
                        </label>

                        @if($field->type === 'input')
                            <input type="text" name="fields[{{ $field->id }}]" value="{{ $currentValue }}"
                                   class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">

                        @elseif($field->type === 'select')
                            <select name="fields[{{ $field->id }}]"
                                    class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#E8D5B7] text-sm">
                                <option value="">Seçin</option>
                                @foreach($field->options as $option)
                                    <option value="{{ $option }}" {{ $currentValue == $option ? 'selected' : '' }}>
                                        {{ $option }}
                                    </option>
                                @endforeach
                            </select>

                        @elseif($field->type === 'checkbox')
                            @php $checkedValues = json_decode($currentValue, true) ?? []; @endphp
                            <div class="flex flex-wrap gap-3">
                                @foreach($field->options ?? [] as $option)
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="checkbox" name="fields[{{ $field->id }}][]" value="{{ $option }}"
                                           {{ in_array($option, $checkedValues) ? 'checked' : '' }}
                                           class="w-4 h-4 rounded border-zinc-600 bg-zinc-800">
                                    <span class="text-sm text-zinc-300">{{ $option }}</span>
                                </label>
                                @endforeach
                            </div>

                        @elseif($field->type === 'radio')
                            <div class="flex flex-wrap gap-4">
                                @foreach($field->options ?? [] as $option)
                                <label class="flex items-center gap-2 cursor-pointer">
                                    <input type="radio" name="fields[{{ $field->id }}]" value="{{ $option }}"
                                           {{ $currentValue == $option ? 'checked' : '' }}
                                           class="w-4 h-4 border-zinc-600 bg-zinc-800">
                                    <span class="text-sm text-zinc-300">{{ $option }}</span>
                                </label>
                                @endforeach
                            </div>
                        @endif
                    </div>
                    @endforeach
                </div>
            </div>
            @endif

            {{-- Varyasyonlar --}}
            <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <div class="flex items-center justify-between mb-4">
                    <h4 class="text-sm font-semibold text-white">Varyasyonlar</h4>
                    <button type="button" onclick="addVariation()"
                            class="text-xs text-[#E8D5B7] hover:opacity-80 transition-opacity">
                        + Varyasyon Ekle
                    </button>
                </div>

                <div id="variations-container" class="space-y-4">
                    @foreach($product->variations as $index => $variation)
                    <div class="bg-zinc-800 rounded-lg p-4 border border-zinc-700" id="variation-existing-{{ $index }}">
                        <div class="grid grid-cols-3 gap-3 mb-3">
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">SKU</label>
                                <input type="text" name="variations[{{ $index }}][sku]" value="{{ $variation->sku }}"
                                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">Fiyat (₺)</label>
                                <input type="number" name="variations[{{ $index }}][price]" value="{{ $variation->price }}" step="0.01"
                                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none">
                            </div>
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">Stok</label>
                                <input type="number" name="variations[{{ $index }}][stock]" value="{{ $variation->stock }}"
                                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none">
                            </div>
                        </div>
                        <div class="grid grid-cols-2 gap-3">
                            @foreach($attributes as $attribute)
                            <div>
                                <label class="block text-xs text-zinc-400 mb-1">{{ $attribute->name }}</label>
                                <select name="variations[{{ $index }}][attribute_values][]"
                                        class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none">
                                    <option value="">Seçin</option>
                                    @foreach($attribute->values as $value)
                                        <option value="{{ $value->id }}"
                                            {{ $variation->attributeValues->contains('id', $value->id) ? 'selected' : '' }}>
                                            {{ $value->value }}
                                        </option>
                                    @endforeach
                                </select>
                            </div>
                            @endforeach
                        </div>
                        <button type="button" onclick="removeVariation('variation-existing-{{ $index }}')"
                                class="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors">
                            − Kaldır
                        </button>
                    </div>
                    @endforeach
                </div>
            </div>

        </div>

        {{-- Sağ kolon --}}
        <div class="space-y-6">
            <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6">
                <h4 class="text-sm font-semibold text-white mb-4">Yayın Durumu</h4>
                <label class="flex items-center gap-3 cursor-pointer">
                    <div class="relative">
                        <input type="checkbox" name="is_active" class="sr-only peer" {{ $product->is_active ? 'checked' : '' }}>
                        <div class="w-10 h-6 bg-zinc-700 rounded-full peer peer-checked:bg-[#E8D5B7] transition-colors"></div>
                        <div class="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform peer-checked:translate-x-4"></div>
                    </div>
                    <span class="text-sm text-zinc-300">Aktif</span>
                </label>
            </div>

            <button type="submit"
                    class="w-full bg-[#E8D5B7] text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                Değişiklikleri Kaydet
            </button>
        </div>
    </div>
</form>

<script>
let variationIndex = {{ $product->variations->count() }};
const attributes = @json($attributes);

function addVariation() {
    const container = document.getElementById('variations-container');
    const div = document.createElement('div');
    div.className = 'bg-zinc-800 rounded-lg p-4 border border-zinc-700';
    div.id = `variation-${variationIndex}`;

    let attributeSelects = attributes.map(attr => `
        <div>
            <label class="block text-xs text-zinc-400 mb-1">${attr.name}</label>
            <select name="variations[${variationIndex}][attribute_values][]"
                    class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none">
                <option value="">Seçin</option>
                ${attr.values.map(v => `<option value="${v.id}">${v.value}</option>`).join('')}
            </select>
        </div>
    `).join('');

    div.innerHTML = `
        <div class="grid grid-cols-3 gap-3 mb-3">
            <div>
                <label class="block text-xs text-zinc-400 mb-1">SKU</label>
                <input type="text" name="variations[${variationIndex}][sku]"
                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                       placeholder="YRKN-ESP-250">
            </div>
            <div>
                <label class="block text-xs text-zinc-400 mb-1">Fiyat (₺)</label>
                <input type="number" name="variations[${variationIndex}][price]" step="0.01"
                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                       placeholder="0.00">
            </div>
            <div>
                <label class="block text-xs text-zinc-400 mb-1">Stok</label>
                <input type="number" name="variations[${variationIndex}][stock]"
                       class="w-full bg-zinc-700 border border-zinc-600 rounded-lg px-3 py-2 text-white text-xs focus:outline-none"
                       placeholder="0">
            </div>
        </div>
        <div class="grid grid-cols-2 gap-3">
            ${attributeSelects}
        </div>
        <button type="button" onclick="removeVariation('variation-${variationIndex}')"
                class="mt-3 text-xs text-red-400 hover:text-red-300 transition-colors">
            − Kaldır
        </button>
    `;

    container.appendChild(div);
    variationIndex++;
}

function removeVariation(id) {
    document.getElementById(id).remove();
}
</script>
@endsection