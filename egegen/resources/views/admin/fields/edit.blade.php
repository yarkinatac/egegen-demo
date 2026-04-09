@extends('layouts.admin')

@section('title', 'Alan Düzenle')

@section('content')
<div class="flex items-center gap-4 mb-8">
    <a href="/admin/fields" class="text-zinc-500 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
    </a>
    <div>
        <h3 class="text-xl font-semibold text-white">{{ $field->label }}</h3>
        <p class="text-sm text-zinc-500 mt-1">Alanı düzenle</p>
    </div>
</div>

<div class="max-w-2xl">
    <form action="/admin/fields/{{ $field->id }}" method="POST">
        @csrf
        @method('PUT')
        <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
            <div>
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Alan Adı *</label>
                <input type="text" name="label" value="{{ old('label', $field->label) }}"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                @error('label')
                    <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Alan Tipi *</label>
                <select name="type" id="field-type"
                        class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white focus:outline-none focus:border-[#E8D5B7] text-sm"
                        onchange="toggleOptions()">
                    @foreach(['input', 'select', 'checkbox', 'radio'] as $type)
                        <option value="{{ $type }}" {{ old('type', $field->type) == $type ? 'selected' : '' }}>
                            {{ ucfirst($type) }}
                        </option>
                    @endforeach
                </select>
            </div>

            <div id="options-field">
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Seçenekler</label>
                <input type="text" name="options" value="{{ old('options', $field->options ? implode(', ', $field->options) : '') }}"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm"
                       placeholder="Washed, Natural, Honey">
                <p class="text-xs text-zinc-600 mt-1">Seçenekleri virgülle ayırın</p>
            </div>

            <div>
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Sıralama</label>
                <input type="number" name="sort_order" value="{{ old('sort_order', $field->sort_order) }}"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
            </div>

            <label class="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" name="is_required" class="w-4 h-4 rounded border-zinc-600 bg-zinc-800"
                       {{ $field->is_required ? 'checked' : '' }}>
                <span class="text-sm text-zinc-300">Zorunlu alan</span>
            </label>

            <button type="submit"
                    class="w-full bg-[#E8D5B7] text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                Değişiklikleri Kaydet
            </button>
        </div>
    </form>
</div>

<script>
function toggleOptions() {
    const type = document.getElementById('field-type').value;
    const optionsField = document.getElementById('options-field');
    optionsField.style.display = ['select', 'checkbox', 'radio'].includes(type) ? 'block' : 'none';
}
toggleOptions();
</script>
@endsection