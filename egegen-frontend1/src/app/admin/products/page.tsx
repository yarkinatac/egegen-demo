'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { getAdminProducts, deleteProduct } from '@/lib/admin-api';
import { Product } from '@/lib/types';

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchProducts = async () => {
    try {
      const data = await getAdminProducts();
      setProducts(data);
    } catch (err) {
      console.error('Urunler yuklenemedi:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" urununu silmek istediginize emin misiniz?`)) return;

    try {
      await deleteProduct(id);
      fetchProducts();
    } catch (err) {
      console.error('Urun silinemedi:', err);
      alert('Urun silinirken hata olustu.');
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-zinc-800 rounded w-48" />
          <div className="h-64 bg-zinc-800 rounded" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Ürünler</h1>
          <p className="text-sm text-zinc-400 mt-1">{products.length} ürün</p>
        </div>
        <Link
          href="/admin/products/create"
          className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition"
        >
          + Yeni Ürün
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 text-left">
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Ürün</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Menşei</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Kavurma</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Fiyat</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">Durum</th>
              <th className="px-6 py-4 text-xs font-medium text-zinc-400 uppercase tracking-wider">İşlemler</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-800">
            {products.map((product) => (
              <tr key={product.id} className="hover:bg-zinc-800/50 transition">
                <td className="px-6 py-4">
                  <div className="font-medium text-white">{product.name}</div>
                  <div className="text-xs text-zinc-500 mt-0.5">{product.slug}</div>
                </td>
                <td className="px-6 py-4 text-zinc-300">{product.origin || '—'}</td>
                <td className="px-6 py-4 text-zinc-300">{product.roast_level || '—'}</td>
                <td className="px-6 py-4 text-zinc-300">₺{parseFloat(product.price).toFixed(2)}</td>
                <td className="px-6 py-4">
                  {product.is_active ? (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                      Aktif
                    </span>
                  ) : (
                    <span className="px-2.5 py-1 text-xs font-medium rounded-full bg-red-500/10 text-red-400 border border-red-500/20">
                      Pasif
                    </span>
                  )}
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/admin/products/${product.id}/edit`}
                      className="text-zinc-400 hover:text-white text-sm transition"
                    >
                      Düzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(product.id, product.name)}
                      className="text-red-400 hover:text-red-300 text-sm transition"
                    >
                      Sil
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center text-zinc-500">
                  Henüz ürün eklenmemiş.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
