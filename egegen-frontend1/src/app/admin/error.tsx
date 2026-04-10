'use client';

export default function AdminError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="p-8">
      <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-lg">
        <h2 className="text-lg font-semibold text-red-400 mb-2">Bir hata olustu</h2>
        <p className="text-sm text-zinc-400 mb-4">{error.message}</p>
        <button
          onClick={reset}
          className="px-4 py-2 bg-zinc-800 border border-zinc-700 text-sm text-white rounded-lg hover:bg-zinc-700 transition"
        >
          Tekrar Dene
        </button>
      </div>
    </div>
  );
}
