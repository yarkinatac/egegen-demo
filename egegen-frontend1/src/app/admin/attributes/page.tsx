'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getAttributes, deleteAttribute } from '@/lib/admin-api';

interface VariationAttributeValue {
  id: number;
  variation_attribute_id: number;
  value: string;
}

interface VariationAttribute {
  id: number;
  name: string;
  values: VariationAttributeValue[];
}

export default function AttributesPage() {
  const [attributes, setAttributes] = useState<VariationAttribute[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAttributes = async () => {
    try {
      const data = await getAttributes();
      setAttributes(data);
    } catch (error) {
      console.error('Tipler yuklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttributes();
  }, []);

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`"${name}" tipini silmek istediginize emin misiniz?`)) return;

    try {
      await deleteAttribute(id);
      setAttributes(attributes.filter((a) => a.id !== id));
    } catch (error) {
      console.error('Silme hatasi:', error);
      alert('Tip silinirken bir hata olustu.');
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Varyasyon Tipleri</h1>
          <p className="text-sm text-zinc-400 mt-1">{attributes.length} tip tanimli</p>
        </div>
        <Link
          href="/admin/attributes/create"
          className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition"
        >
          + Yeni Tip
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Yukleniyor...</div>
        ) : attributes.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">Henuz varyasyon tipi eklenmemis.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="text-left px-6 py-4 font-medium">Ad</th>
                <th className="text-left px-6 py-4 font-medium">Degerler</th>
                <th className="text-right px-6 py-4 font-medium">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {attributes.map((attr) => (
                <tr key={attr.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="px-6 py-4 text-white font-medium">{attr.name}</td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-1.5">
                      {attr.values.map((v) => (
                        <span
                          key={v.id}
                          className="text-xs px-2.5 py-1 rounded-full bg-zinc-800 text-zinc-300 border border-zinc-700"
                        >
                          {v.value}
                        </span>
                      ))}
                      {attr.values.length === 0 && (
                        <span className="text-xs text-zinc-500">Deger yok</span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/attributes/${attr.id}/edit`}
                      className="text-zinc-400 hover:text-white transition text-sm"
                    >
                      Duzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(attr.id, attr.name)}
                      className="text-red-400 hover:text-red-300 transition text-sm"
                    >
                      Sil
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
