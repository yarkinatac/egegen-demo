'use client';

import { useState, useMemo, useCallback } from 'react';
import { ShoppingCart, Package, Check, Tag, ArrowLeft } from 'lucide-react';
import Link from 'next/link';
import { Product, ProductVariation, toNumber } from '@/lib/types';
import ImageGallery from './ImageGallery';
import QuantitySelector from './QuantitySelector';
import VariationManager from './VariationManager';
import DynamicFieldsRenderer from './DynamicFieldsRenderer';

interface ProductDetailClientProps {
  product: Product;
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const variations = product.variations ?? [];
  const fieldValues = product.field_values ?? [];
  const images = product.images ?? [];

  // Stokta olan ilk varyasyonu sec
  const initialVariation =
    variations.find((v) => v.stock > 0) ?? variations[0] ?? null;

  const [selectedVariation, setSelectedVariation] =
    useState<ProductVariation | null>(initialVariation);
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [addedToCart, setAddedToCart] = useState(false);

  const basePrice = toNumber(product.price);
  const currentPrice = selectedVariation
    ? toNumber(selectedVariation.price)
    : basePrice;
  const hasVariations = variations.length > 0;
  const currentStock = selectedVariation?.stock ?? (hasVariations ? 0 : 999);
  const isOutOfStock = hasVariations && currentStock === 0;

  const formattedPrice = useMemo(
    () =>
      new Intl.NumberFormat('tr-TR', {
        style: 'currency',
        currency: 'TRY',
        maximumFractionDigits: 2,
      }).format(currentPrice),
    [currentPrice]
  );

  const categoryLabel =
    product.origin || product.roast_level
      ? [product.origin, product.roast_level].filter(Boolean).join(' · ')
      : 'Kahve';

  const handleAddToCart = useCallback(async () => {
    if (isOutOfStock) return;

    setIsAdding(true);
    const cartPayload = {
      product_id: product.id,
      variation_id: selectedVariation?.id ?? null,
      quantity,
    };
    console.log('Adding to cart:', cartPayload);
    await new Promise((res) => setTimeout(res, 600));

    setIsAdding(false);
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2500);
  }, [isOutOfStock, product.id, selectedVariation, quantity]);

  return (
    <div className="animate-fade-in-up">
      {/* Geri butonu */}
      <Link
        href="/"
        className="mb-8 inline-flex items-center gap-2 text-sm font-medium text-teal-dark/60 transition-colors hover:text-teal-dark"
      >
        <ArrowLeft className="h-4 w-4" />
        Ana Sayfaya Dön
      </Link>

      <div className="grid gap-10 lg:grid-cols-2 lg:gap-16">
        {/* Resim galerisi */}
        <ImageGallery images={images} alt={product.name} />

        {/* Urun bilgileri */}
        <div className="space-y-8">
          {/* Kategori ve baslik */}
          <div>
            <div className="mb-2 inline-flex items-center gap-1.5 rounded-full bg-teal-dark/8 px-3 py-1">
              <Tag className="h-3 w-3 text-teal-dark/60" />
              <span className="text-xs font-semibold text-teal-dark/60">
                {categoryLabel}
              </span>
            </div>
            <h1 className="text-3xl font-black tracking-tight text-teal-dark sm:text-4xl">
              {product.name}
            </h1>
          </div>

          {/* Fiyat ve stok */}
          <div className="flex items-end gap-4">
            <span className="text-4xl font-black tabular-nums text-teal-dark">
              {formattedPrice}
            </span>
            <div
              className={`mb-1 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isOutOfStock
                  ? 'bg-red-50 text-red-500'
                  : currentStock <= 10
                  ? 'bg-amber-50 text-amber-600'
                  : 'bg-emerald-50 text-emerald-600'
              }`}
            >
              <Package className="h-3 w-3" />
              {isOutOfStock
                ? 'Stokta Yok'
                : currentStock <= 10
                ? `Sadece ${currentStock} adet kaldı`
                : 'Stokta Var'}
            </div>
          </div>

          {/* Aciklama */}
          {product.description && (
            <p className="text-sm leading-relaxed text-teal-dark/60">
              {product.description}
            </p>
          )}

          {/* Varyasyonlar */}
          {hasVariations && (
            <>
              <hr className="border-teal-dark/8" />
              <VariationManager
                variations={variations}
                selectedVariation={selectedVariation}
                onVariationChange={setSelectedVariation}
              />
            </>
          )}

          {/* Dinamik alanlar */}
          {fieldValues.length > 0 && (
            <>
              <hr className="border-teal-dark/8" />
              <DynamicFieldsRenderer fieldValues={fieldValues} />
            </>
          )}

          <hr className="border-teal-dark/8" />

          {/* Miktar ve sepete ekle */}
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <QuantitySelector
              quantity={quantity}
              onQuantityChange={setQuantity}
              max={Math.max(currentStock, 1)}
            />

            <button
              id="add-to-cart-btn"
              type="button"
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding}
              className={`inline-flex flex-1 items-center justify-center gap-2.5 rounded-xl px-8 py-3.5 text-sm font-bold transition-all duration-300 active:scale-[0.97] ${
                addedToCart
                  ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20'
                  : isOutOfStock
                  ? 'cursor-not-allowed bg-teal-dark/20 text-teal-dark/40'
                  : 'bg-teal-dark text-cream hover:bg-teal-darker hover:shadow-xl hover:shadow-teal-dark/20'
              } disabled:pointer-events-none`}
            >
              {isAdding ? (
                <>
                  <div className="h-4 w-4 animate-spin rounded-full border-2 border-cream border-t-transparent" />
                  Ekleniyor...
                </>
              ) : addedToCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Sepete Eklendi!
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Sepete Ekle
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
