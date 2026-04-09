@extends('layouts.admin')

@section('title', 'Dinamik Alanlar')

@section('content')
<div class="flex items-center justify-between mb-8">
    <div>
        <h3 class="text-xl font-semibold text-white">Dinamik Alanlar</h3>
        <p class="text-sm text-zinc-500 mt-1">{{ $fields->count() }} alan tanımlı</p>
    </div>
    <a href="/admin/fields/create"
       class="bg-[#E8D5B7] text-zinc-900 px-4 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition-all">
        + Yeni Alan
    </a>
</div>

<div class="bg-zinc-900 rounded-xl border border-zinc-800 overflow-hidden">
    <table class="w-full">
        <thead>
            <tr class="border-b border-zinc-800">
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Alan Adı</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Key</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Tip</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">Zorunlu</th>
                <th class="text-left px-6 py-4 text-xs font-semibold text-zinc-400 uppercase tracking-wider">İşlem</th>
            </tr>
        </thead>
        <tbody class="divide-y divide-zinc-800">
            @forelse($fields as $field)
            <tr class="hover:bg-zinc-800/50 transition-colors">
                <td class="px-6 py-4 text-sm font-medium text-white">{{ $field->label }}</td>
                <td class="px-6 py-4">
                    <code class="text-xs bg-zinc-800 text-[#E8D5B7] px-2 py-1 rounded">{{ $field->field_key }}</code>
                </td>
                <td class="px-6 py-4">
                    <span class="px-2.5 py-1 bg-zinc-800 rounded-md text-xs text-zinc-300 capitalize">{{ $field->type }}</span>
                </td>
                <td class="px-6 py-4 text-sm text-zinc-400">{{ $field->is_required ? 'Evet' : 'Hayır' }}</td>
                <td class="px-6 py-4">
                    <div class="flex items-center gap-3">
                        <a href="/admin/fields/{{ $field->id }}/edit"
                           class="text-xs text-zinc-400 hover:text-white transition-colors">Düzenle</a>
                        <form action="/admin/fields/{{ $field->id }}" method="POST" class="inline">
                            @csrf
                            @method('DELETE')
                            <button type="submit"
                                    onclick="return confirm('Bu alanı silmek istediğinize emin misiniz?')"
                                    class="text-xs text-red-500 hover:text-red-400 transition-colors">Sil</button>
                        </form>
                    </div>
                </td>
            </tr>
            @empty
            <tr>
                <td colspan="5" class="px-6 py-12 text-center text-zinc-500 text-sm">
                    Henüz alan eklenmemiş.
                </td>
            </tr>
            @endforelse
        </tbody>
    </table>
</div>
@endsection