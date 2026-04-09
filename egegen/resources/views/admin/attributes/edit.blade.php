@extends('layouts.admin')

@section('title', 'Varyasyon Tipi Düzenle')

@section('content')
<div class="flex items-center gap-4 mb-8">
    <a href="/admin/attributes" class="text-zinc-500 hover:text-white transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M10 19l-7-7m0 0l7-7m-7 7h18"/>
        </svg>
    </a>
    <div>
        <h3 class="text-xl font-semibold text-white">{{ $attribute->name }}</h3>
        <p class="text-sm text-zinc-500 mt-1">Varyasyon tipini düzenle</p>
    </div>
</div>

<div class="max-w-2xl">
    <form action="/admin/attributes/{{ $attribute->id }}" method="POST">
        @csrf
        @method('PUT')
        <div class="bg-zinc-900 rounded-xl border border-zinc-800 p-6 space-y-4">
            <div>
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Tip Adı *</label>
                <input type="text" name="name" value="{{ old('name', $attribute->name) }}"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                @error('name')
                    <p class="text-red-400 text-xs mt-1">{{ $message }}</p>
                @enderror
            </div>

            <div>
                <label class="block text-xs font-medium text-zinc-400 mb-1.5">Değerler</label>
                <input type="text" name="values" value="{{ old('values', $attribute->values->pluck('value')->implode(', ')) }}"
                       class="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2.5 text-white placeholder-zinc-500 focus:outline-none focus:border-[#E8D5B7] text-sm">
                <p class="text-xs text-zinc-600 mt-1">Değerleri virgülle ayırın</p>
            </div>

            <button type="submit"
                    class="w-full bg-[#E8D5B7] text-zinc-900 py-3 rounded-lg text-sm font-semibold hover:opacity-90 transition-all">
                Değişiklikleri Kaydet
            </button>
        </div>
    </form>
</div>
@endsection