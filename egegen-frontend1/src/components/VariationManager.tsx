'use client';

import { useMemo } from 'react';
import type { ProductVariation } from '@/lib/types';

interface VariationManagerProps {
  variations: ProductVariation[];
  selectedVariation: ProductVariation | null;
  onVariationChange: (variation: ProductVariation) => void;
}

// Varyasyonun attribute degerlerini duz objeye cevir
function flattenAttributes(variation: ProductVariation): Record<string, string> {
  const flat: Record<string, string> = {};
  for (const av of variation.attribute_values ?? []) {
    if (av.attribute?.name) {
      flat[av.attribute.name] = av.value;
    }
  }
  return flat;
}

export default function VariationManager({
  variations,
  selectedVariation,
  onVariationChange,
}: VariationManagerProps) {
  // Her varyasyon icin attribute map'i olustur
  const flattened = useMemo(
    () => variations.map((v) => ({ variation: v, attrs: flattenAttributes(v) })),
    [variations]
  );

  // Attribute isimleri (ornek: "Ogutme Tipi", "Paket Boyutu")
  const attributeKeys = useMemo(() => {
    const keys = new Set<string>();
    flattened.forEach(({ attrs }) =>
      Object.keys(attrs).forEach((k) => keys.add(k))
    );
    return Array.from(keys);
  }, [flattened]);

  // Her attribute icin mumkun degerler
  const attributeValues = useMemo(() => {
    const map: Record<string, string[]> = {};
    attributeKeys.forEach((key) => {
      const values = new Set<string>();
      flattened.forEach(({ attrs }) => {
        if (attrs[key]) values.add(attrs[key]);
      });
      map[key] = Array.from(values);
    });
    return map;
  }, [attributeKeys, flattened]);

  const selectedAttributes = selectedVariation
    ? flattenAttributes(selectedVariation)
    : {};

  const handleSelect = (key: string, value: string) => {
    const desired = { ...selectedAttributes, [key]: value };

    // Secilen attribute'lara uyan varyasyonu bul
    const exact = flattened.find(({ attrs }) =>
      attributeKeys.every((k) => (desired[k] ? attrs[k] === desired[k] : true))
    );
    if (exact) {
      onVariationChange(exact.variation);
      return;
    }

    // Tam eslesen yoksa sadece secilen degere uyan ilk varyasyonu al
    const fallback = flattened.find(({ attrs }) => attrs[key] === value);
    if (fallback) onVariationChange(fallback.variation);
  };

  if (!attributeKeys.length) return null;

  return (
    <div className="space-y-5">
      {attributeKeys.map((key) => (
        <div key={key}>
          <label className="mb-2.5 block text-xs font-semibold uppercase tracking-wider text-teal-dark/60">
            {key}
            {selectedAttributes[key] && (
              <span className="ml-2 font-bold normal-case tracking-normal text-teal-dark">
                — {selectedAttributes[key]}
              </span>
            )}
          </label>
          <div className="flex flex-wrap gap-2">
            {attributeValues[key].map((value) => {
              const isSelected = selectedAttributes[key] === value;

              // Bu deger secildiginde stokta varyasyon var mi kontrol et
              const hasStock = flattened.some(
                ({ variation, attrs }) =>
                  attrs[key] === value &&
                  variation.stock > 0 &&
                  attributeKeys.every((k) =>
                    k === key
                      ? true
                      : selectedAttributes[k]
                      ? attrs[k] === selectedAttributes[k]
                      : true
                  )
              );

              return (
                <button
                  key={value}
                  type="button"
                  onClick={() => handleSelect(key, value)}
                  disabled={!hasStock}
                  aria-pressed={isSelected}
                  className={`relative rounded-xl px-5 py-2.5 text-sm font-medium transition-all duration-200 ${
                    isSelected
                      ? 'bg-teal-dark text-cream shadow-lg shadow-teal-dark/20'
                      : hasStock
                      ? 'border border-teal-dark/15 bg-white text-teal-dark hover:border-teal-dark/30 hover:shadow-sm'
                      : 'cursor-not-allowed border border-teal-dark/8 bg-cream-dark/50 text-teal-dark/30 line-through'
                  }`}
                  aria-label={`${key}: ${value}`}
                >
                  {value}
                  {!hasStock && (
                    <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-100 text-[8px] font-bold text-red-500">
                      ✕
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
