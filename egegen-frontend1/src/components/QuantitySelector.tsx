'use client';

import { Minus, Plus } from 'lucide-react';

interface QuantitySelectorProps {
  quantity: number;
  onQuantityChange: (qty: number) => void;
  max?: number;
}

export default function QuantitySelector({
  quantity,
  onQuantityChange,
  max = 99,
}: QuantitySelectorProps) {
  return (
    <div className="inline-flex items-center rounded-xl border border-teal-dark/15 bg-white">
      <button
        id="qty-decrease"
        onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
        disabled={quantity <= 1}
        className="flex h-11 w-11 items-center justify-center rounded-l-xl text-teal-dark transition-colors hover:bg-teal-dark/5 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Miktarı azalt"
      >
        <Minus className="h-4 w-4" />
      </button>
      <span
        id="qty-display"
        className="flex h-11 w-12 items-center justify-center border-x border-teal-dark/10 text-sm font-bold text-teal-dark tabular-nums"
      >
        {quantity}
      </span>
      <button
        id="qty-increase"
        onClick={() => onQuantityChange(Math.min(max, quantity + 1))}
        disabled={quantity >= max}
        className="flex h-11 w-11 items-center justify-center rounded-r-xl text-teal-dark transition-colors hover:bg-teal-dark/5 disabled:opacity-30 disabled:cursor-not-allowed"
        aria-label="Miktarı artır"
      >
        <Plus className="h-4 w-4" />
      </button>
    </div>
  );
}
