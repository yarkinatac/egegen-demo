@extends('layouts.admin')

@section('title', 'Ürünler')

@section('content')
<div class="flex items-center justify-between mb-8">
    <div>
        <h3 class="text-xl font-semibold text-white">Ürünler</h3>
        <p class="text-sm text-zinc-500 mt-1">{{ $products->count() }} ürün listeleniyor</p>
    </div>
    <a href="/admin/products/create"
       class="bg-[#E8D5B7] text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all">
        + Yeni Ürün
    </a>
</div>

<div class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
    <table class="w-full">
        <thead>
            <tr class="border-b border-zinc-800">
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Ürün</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Köken</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Kavurma</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Fiyat</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Durum</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">İşlem</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800">
            @forelse($products as $product)
            <tr class="hover:bg-zinc-800/50 transition-colors">
                <td class="px-6 py-4">
                    <div>
                        <p class="text-sm font-medium text-white">{{ $product->name }}</p>
                        <p class="text-xs text-zinc-500 mt-0.5">{{ $product->slug }}</p>
                    </div>
                </td>
                <td class="px-6 py-4 text-sm text-zinc-400">{{ $product->origin ?? '—' }}</td>
                <td class="px-6 py-4 text-sm text-zinc-400">{{ $product->roast_level ?? '—' }}</td>
                <td class="px-6 py-4 text-sm text-white font-medium">₺{{ number_format($product->price, 2) }}</td>
                <td class="px-6 py-4">
                    @if($product->is_active)
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400">
                            <span class="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
                            Aktif
                        </span>
                    @else
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-700 text-zinc-400">
                            <span class="w-1.5 h-1.5 rounded-full bg-zinc-500"></span>
                            Pasif
                        </span>
                    @endif
                </td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <a href="/admin/products/{{ $product->id }}/edit"
                           class="text-xs text-zinc-400 hover:text-white transition-colors">
                            Düzenle
                        </a>
                        <form action="/admin/products/{{ $product->id }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                    onclick="return confirm('Ürünü silmek istediğinize emin misiniz?')"
                                    class="text-xs text-red-500 hover:text-red-400 transition-colors">
                                Sil
                            </button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="6" class="px-6 py-12 text-center text-zinc-500 text-sm">
                    Henüz ürün eklenmemiş.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection