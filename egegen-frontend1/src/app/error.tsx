'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw } from 'lucide-react';

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Uygulama hatasi:', error);
  }, [error]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <AlertTriangle className="h-10 w-10 text-red-500" />
        </div>
        <h2 className="text-2xl font-bold text-teal-dark">Bir hata olustu</h2>
        <p className="mt-3 text-sm leading-relaxed text-teal-dark/60">
          Sayfa yuklenirken beklenmeyen bir hata meydana geldi. Lutfen tekrar deneyin veya ana sayfaya donun.
        </p>
        {error.digest && (
          <p className="mt-2 text-xs text-teal-dark/40 font-mono">Hata ID: {error.digest}</p>
        )}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="inline-flex items-center gap-2 rounded-full bg-teal-dark px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-teal-darker active:scale-[0.97]"
          >
            <RefreshCw className="h-4 w-4" />
            Tekrar Dene
          </button>
          <Link
            href="/"
            className="inline-flex items-center rounded-full border-2 border-teal-dark/20 px-6 py-3 text-sm font-semibold text-teal-dark transition-all hover:border-teal-dark/40"
          >
            Ana Sayfa
          </Link>
        </div>
      </div>
    </div>
  );
}
