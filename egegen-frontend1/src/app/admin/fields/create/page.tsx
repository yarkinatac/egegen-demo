'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createField } from '@/lib/admin-api';

export default function CreateFieldPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [label, setLabel] = useState('');
  const [fieldKey, setFieldKey] = useState('');
  const [type, setType] = useState('input');
  const [options, setOptions] = useState('');
  const [sortOrder, setSortOrder] = useState(0);
  const [isRequired, setIsRequired] = useState(false);

  const showOptions = type === 'select' || type === 'checkbox' || type === 'radio';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const data: any = {
        label,
        field_key: fieldKey,
        type,
        sort_order: sortOrder,
        is_required: isRequired,
        options: showOptions ? options.split(',').map((o) => o.trim()).filter(Boolean) : null,
      };

      await createField(data);
      router.push('/admin/fields');
    } catch (error) {
      console.error('Kaydetme hatasi:', error);
      alert('Alan olusturulurken bir hata olustu.');
      setSaving(false);
    }
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <Link href="/admin/fields" className="text-sm text-zinc-400 hover:text-white transition">
          ← Dinamik Alanlara Don
        </Link>
        <h1 className="text-2xl font-semibold mt-4">Yeni Alan Olustur</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6 max-w-2xl space-y-6">
        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Label *</label>
          <input
            type="text"
            value={label}
            onChange={(e) => setLabel(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500 transition"
            placeholder="Ornek: Mensei Ulke"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Field Key *</label>
          <input
            type="text"
            value={fieldKey}
            onChange={(e) => setFieldKey(e.target.value)}
            required
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500 transition font-mono"
            placeholder="Ornek: mensei_ulke"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Tip</label>
          <select
            value={type}
            onChange={(e) => setType(e.target.value)}
            className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500 transition"
          >
            <option value="input">Input</option>
            <option value="select">Select</option>
            <option value="checkbox">Checkbox</option>
            <option value="radio">Radio</option>
          </select>
        </div>

        {showOptions && (
          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-2">Secenekler</label>
            <input
              type="text"
              value={options}
              onChange={(e) => setOptions(e.target.value)}
              className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500 transition"
              placeholder="Virgul ile ayirin: Secenek 1, Secenek 2, Secenek 3"
            />
            <p className="text-xs text-zinc-500 mt-1">Secenekleri virgul ile ayirarak yazin.</p>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-2">Siralama</label>
          <input
            type="number"
            value={sortOrder}
            onChange={(e) => setSortOrder(Number(e.target.value))}
            className="w-32 px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:outline-none focus:border-zinc-500 transition"
          />
        </div>

        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            id="is_required"
            checked={isRequired}
            onChange={(e) => setIsRequired(e.target.checked)}
            className="w-4 h-4 rounded border-zinc-700 bg-zinc-800 text-white focus:ring-0"
          />
          <label htmlFor="is_required" className="text-sm text-zinc-300">
            Bu alan zorunlu olsun
          </label>
        </div>

        <div className="flex items-center gap-4 pt-4 border-t border-zinc-800">
          <button
            type="submit"
            disabled={saving}
            className="px-6 py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition disabled:opacity-50"
          >
            {saving ? 'Kaydediliyor...' : 'Olustur'}
          </button>
          <Link href="/admin/fields" className="text-sm text-zinc-400 hover:text-white transition">
            Iptal
          </Link>
        </div>
      </form>
    </div>
  );
}
