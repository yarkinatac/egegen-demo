<!DOCTYPE html>
<html lang="tr">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Yarkin Admin — @yield('title')</title>
    @if(file_exists(public_path('build/manifest.json')))
        @vite(['resources/css/app.css', 'resources/js/app.js'])
    @else
        <script src="https://cdn.tailwindcss.com"></script>
    @endif
</head>
<body class="bg-zinc-950 text-white font-sans min-h-screen">

    <div class="flex min-h-screen">
        {{-- Sidebar --}}
        <aside class="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col fixed h-full">
            <div class="p-6 border-b border-zinc-800">
                <h1 class="text-lg font-semibold tracking-widest uppercase text-white">Yarkin</h1>
                <p class="text-xs text-zinc-500 mt-0.5">Admin Panel</p>
            </div>

            <nav class="flex-1 p-4 space-y-1">
                <a href="/admin/products"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   {{ request()->is('admin/products*') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800' }} transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"/>
                    </svg>
                    Ürünler
                </a>

                <a href="/admin/fields"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   {{ request()->is('admin/fields*') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800' }} transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
                    </svg>
                    Dinamik Alanlar
                </a>

                <a href="/admin/attributes"
                   class="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium
                   {{ request()->is('admin/attributes*') ? 'bg-zinc-800 text-white' : 'text-zinc-400 hover:text-white hover:bg-zinc-800' }} transition-all">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a2 2 0 012-2z"/>
                    </svg>
                    Varyasyon Tipleri
                </a>
            </nav>

            <div class="p-4 border-t border-zinc-800">
                <p class="text-xs text-zinc-600">Yarkin Coffee © 2026</p>
            </div>
        </aside>

        {{-- Main Content --}}
        <main class="flex-1 ml-64">
            <header class="bg-zinc-900 border-b border-zinc-800 px-8 py-4 flex items-center justify-between">
                <h2 class="text-sm font-medium text-zinc-400">@yield('title')</h2>
                <div class="flex items-center gap-2">
                    <div class="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span class="text-xs text-zinc-500">Live</span>
                </div>
            </header>

            <div class="p-8">
                @if(session('success'))
                    <div class="mb-6 px-4 py-3 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-400 text-sm">
                        {{ session('success') }}
                    </div>
                @endif

                @if(session('error'))
                    <div class="mb-6 px-4 py-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-sm">
                        {{ session('error') }}
                    </div>
                @endif

                @yield('content')
            </div>
        </main>
    </div>

</body>
</html>