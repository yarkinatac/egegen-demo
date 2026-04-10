'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { getFields, deleteField } from '@/lib/admin-api';
import { ProductField } from '@/lib/types';

export default function FieldsPage() {
  const [fields, setFields] = useState<ProductField[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFields = async () => {
    try {
      const data = await getFields();
      setFields(data);
    } catch (error) {
      console.error('Alanlar yuklenemedi:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFields();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Bu alani silmek istediginize emin misiniz?')) return;

    try {
      await deleteField(id);
      setFields(fields.filter((f) => f.id !== id));
    } catch (error) {
      console.error('Silme hatasi:', error);
      alert('Alan silinirken bir hata olustu.');
    }
  };

  const typeBadgeColor: Record<string, string> = {
    input: 'bg-blue-900/50 text-blue-300',
    select: 'bg-purple-900/50 text-purple-300',
    checkbox: 'bg-green-900/50 text-green-300',
    radio: 'bg-orange-900/50 text-orange-300',
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold">Dinamik Alanlar</h1>
          <p className="text-sm text-zinc-400 mt-1">{fields.length} alan tanimli</p>
        </div>
        <Link
          href="/admin/fields/create"
          className="px-4 py-2 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition"
        >
          + Yeni Alan
        </Link>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-zinc-500">Yukleniyor...</div>
        ) : fields.length === 0 ? (
          <div className="p-12 text-center text-zinc-500">Henuz alan eklenmemis.</div>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 text-zinc-400">
                <th className="text-left px-6 py-4 font-medium">Label</th>
                <th className="text-left px-6 py-4 font-medium">Field Key</th>
                <th className="text-left px-6 py-4 font-medium">Tip</th>
                <th className="text-left px-6 py-4 font-medium">Zorunlu</th>
                <th className="text-right px-6 py-4 font-medium">Islemler</th>
              </tr>
            </thead>
            <tbody>
              {fields.map((field) => (
                <tr key={field.id} className="border-b border-zinc-800/50 hover:bg-zinc-800/30 transition">
                  <td className="px-6 py-4 text-white">{field.label}</td>
                  <td className="px-6 py-4">
                    <code className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded font-mono">
                      {field.field_key}
                    </code>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${typeBadgeColor[field.type] || 'bg-zinc-800 text-zinc-300'}`}>
                      {field.type}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-zinc-400">
                    {field.is_required ? 'Evet' : 'Hayir'}
                  </td>
                  <td className="px-6 py-4 text-right space-x-3">
                    <Link
                      href={`/admin/fields/${field.id}/edit`}
                      className="text-zinc-400 hover:text-white transition text-sm"
                    >
                      Duzenle
                    </Link>
                    <button
                      onClick={() => handleDelete(field.id)}
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
