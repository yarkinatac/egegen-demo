@extends('layouts.admin')

@section('title', 'Varyasyon Tipleri')

@section('content')
<div class="flex items-center justify-between mb-8">
    <div>
        <h3 class="text-xl font-semibold text-white">Varyasyon Tipleri</h3>
        <p class="text-sm text-zinc-500 mt-1">{{ $attributes->count() }} tip tanımlı</p>
    </div>
    <a href="/admin/attributes/create"
       class="bg-[#E8D5B7] text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all">
        + Yeni Tip
    </a>
</div>

<div class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
    <table class="w-full">
        <thead>
            <tr class="border-b border-zinc-800">
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tip Adı</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Değerler</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">İşlem</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800">
            @forelse($attributes as $attribute)
            <tr class="hover:bg-zinc-800/50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-white">{{ $attribute->name }}</td>
                <td class="px-6 py-4">
                    <div class="flex flex-wrap gap-2">
                        @foreach($attribute->values as $value)
                        <span class="px-2.5 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300">{{ $value->value }}</span>
                        @endforeach
                    </div>
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <a href="/admin/attributes/{{ $attribute->id }}/edit"
                           class="text-xs text-zinc-400 hover:text-white transition-colors">Düzenle</a>
                        <form action="/admin/attributes/{{ $attribute->id }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                    onclick="return confirm('Bu tipi silmek istediğinize emin misiniz?')"
                                    class="text-xs text-red-500 hover:text-red-400 transition-colors">Sil</button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="3" class="px-6 py-12 text-center text-zinc-500 text-sm">
                    Henüz varyasyon tipi eklenmemiş.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection