'use client';

import { useState } from 'react';
import Image from 'next/image';

interface ImageGalleryProps {
  images: string[];
  alt: string;
}

const FALLBACK = '/hero-coffee-cup.png';

export default function ImageGallery({ images, alt }: ImageGalleryProps) {
  const list = images?.length ? images : [FALLBACK];
  const [activeIndex, setActiveIndex] = useState(0);
  const current = list[activeIndex] ?? FALLBACK;

  return (
    <div className="space-y-4">
      {/* Ana resim */}
      <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-cream-dark">
        <Image
          src={current}
          alt={alt}
          fill
          className="animate-scale-in object-cover transition-all duration-500 ease-out"
          sizes="(max-width: 768px) 100vw, 50vw"
          priority
          unoptimized
        />
      </div>

      {/* Kucuk resimler */}
      {list.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-1">
          {list.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActiveIndex(index)}
              className={`relative h-20 w-20 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-300 ${
                index === activeIndex
                  ? 'border-teal-dark shadow-lg ring-2 ring-teal-dark/20'
                  : 'border-transparent opacity-60 hover:opacity-100'
              }`}
              aria-label={`Resim ${index + 1}`}
            >
              <Image
                src={url}
                alt={`${alt} - ${index + 1}`}
                fill
                className="object-cover"
                sizes="80px"
                unoptimized
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
