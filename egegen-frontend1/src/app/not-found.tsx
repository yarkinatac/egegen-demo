import Link from 'next/link';
import { Coffee, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-cream px-4">
      <div className="text-center max-w-md animate-fade-in-up">
        <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-teal-dark/10">
          <Coffee className="h-10 w-10 text-teal-dark" />
        </div>
        <h1 className="text-6xl font-black text-teal-dark">404</h1>
        <h2 className="mt-2 text-xl font-bold text-teal-dark/80">Sayfa Bulunamadi</h2>
        <p className="mt-3 text-sm leading-relaxed text-teal-dark/50">
          Aradiginiz sayfa tasinmis veya kaldirilmis olabilir.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 rounded-full bg-teal-dark px-6 py-3 text-sm font-semibold text-cream transition-all hover:bg-teal-darker active:scale-[0.97]"
        >
          <Home className="h-4 w-4" />
          Ana Sayfaya Don
        </Link>
      </div>
    </div>
  );
}
