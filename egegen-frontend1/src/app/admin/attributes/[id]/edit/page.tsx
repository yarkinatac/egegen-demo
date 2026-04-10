'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { getAttribute, updateAttribute } from '@/lib/admin-api';

export default function EditAttributePage() {
  const params = useParams();
  const router = useRouter();
  const id = Number(params.id);

  const [name, setName] = useState('');
  const [valuesText, setValuesText] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchAttribute = async () => {
      try {
        const data = await getAttribute(id);
        setName(data.name);
        setValuesText(data.values.map((v: { value: string }) => v.value).join(', '));
      } catch (error) {
        console.error('Tip yuklenemedi:', error);
        alert('Tip yuklenirken bir hata olustu.');
      } finally {
        setLoading(false);
      }
    };

    fetchAttribute();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const values = valuesText
        .split(',')
        .map((v) => v.trim())
        .filter((v) => v.length > 0);

      await updateAttribute(id, { name, values });
      router.push('/admin/attributes');
    } catch (error) {
      console.error('Guncelleme hatasi:', error);
      alert('Tip guncellenirken bir hata olustu.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-zinc-800 rounded w-32" />
          <div className="h-8 bg-zinc-800 rounded w-48" />
          <div className="h-10 bg-zinc-800 rounded w-full max-w-xl" />
          <div className="h-10 bg-zinc-800 rounded w-full max-w-xl" />
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/attributes" className="text-sm text-zinc-400 hover:text-white transition">
          ← Varyasyon Tipleri
        </Link>
        <h1 className="text-2xl font-semibold mt-2">Tipi Duzenle</h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Ad</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Degerler</label>
          <input
            type="text"
            value={valuesText}
            onChange={(e) => setValuesText(e.target.value)}
            placeholder="Espresso, French Press, Chemex"
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white placeholder-zinc-500 focus:outline-none focus:border-zinc-500 transition"
          />
          <p className="text-xs text-zinc-500 mt-1.5">Virgul ile ayirarak birden fazla deger girebilirsiniz.</p>
        </div>

        <div className="flex items-center gap-3 pt-2">
          <button
            type="submit"
            disabled={saving}
            className="px-5 py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Guncelle'}
          </button>
          <Link
            href="/admin/attributes"
            className="px-5 py-2.5 text-sm text-zinc-400 hover:text-white transition"
          >
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
