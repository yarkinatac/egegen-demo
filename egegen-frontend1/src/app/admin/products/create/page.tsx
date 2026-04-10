'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { createProduct, getFields, getAttributes } from '@/lib/admin-api';
import { ProductField, VariationAttribute } from '@/lib/types';

interface VariationForm {
  sku: string;
  price: string;
  stock: number;
  selectedAttributes: Record<number, number>;
}

export default function CreateProductPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);
  const [fields, setFields] = useState<ProductField[]>([]);
  const [attributes, setAttributes] = useState<VariationAttribute[]>([]);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [origin, setOrigin] = useState('');
  const [roastLevel, setRoastLevel] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [fieldValues, setFieldValues] = useState<Record<number, string>>({});
  const [variations, setVariations] = useState<VariationForm[]>([]);

  useEffect(() => {
    getFields().then(setFields).catch(console.error);
    getAttributes().then(setAttributes).catch(console.error);
  }, []);

  const handleFieldChange = (fieldId: number, value: string) => {
    setFieldValues((prev) => ({ ...prev, [fieldId]: value }));
  };

  const handleCheckboxChange = (fieldId: number, option: string, checked: boolean) => {
    const current = fieldValues[fieldId] ? JSON.parse(fieldValues[fieldId]) : [];
    const updated = checked ? [...current, option] : current.filter((v: string) => v !== option);
    setFieldValues((prev) => ({ ...prev, [fieldId]: JSON.stringify(updated) }));
  };

  const addVariation = () => {
    setVariations([...variations, { sku: '', price: '', stock: 0, selectedAttributes: {} }]);
  };

  const removeVariation = (index: number) => {
    setVariations(variations.filter((_, i) => i !== index));
  };

  const updateVariation = (index: number, key: string, value: any) => {
    const updated = [...variations];
    (updated[index] as any)[key] = value;
    setVariations(updated);
  };

  const updateVariationAttr = (varIndex: number, attrId: number, valueId: number) => {
    const updated = [...variations];
    updated[varIndex].selectedAttributes = {
      ...updated[varIndex].selectedAttributes,
      [attrId]: valueId,
    };
    setVariations(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const variationsData = variations.map((v) => ({
        sku: v.sku,
        price: v.price,
        stock: v.stock,
        attribute_values: Object.values(v.selectedAttributes).filter(Boolean),
      }));

      await createProduct({
        name,
        description: description || null,
        price: parseFloat(price),
        origin: origin || null,
        roast_level: roastLevel || null,
        is_active: isActive,
        fields: fieldValues,
        variations: variationsData,
      });
      router.push('/admin/products');
    } catch (err) {
      console.error('Urun olusturulamadi:', err);
      alert('Urun olusturulurken hata olustu.');
      setSaving(false);
    }
  };

  const inputClass =
    'w-full px-3 py-2 bg-zinc-800 border border-zinc-700 rounded-lg text-white text-sm focus:border-zinc-500 focus:outline-none transition';
  const labelClass = 'block text-sm font-medium text-zinc-300 mb-1.5';

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-white">Yeni Ürün</h1>
          <p className="text-sm text-zinc-400 mt-1">Yeni bir ürün ekleyin</p>
        </div>
        <Link href="/admin/products" className="text-sm text-zinc-400 hover:text-white transition">
          ← Geri Dön
        </Link>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-6">Temel Bilgiler</h2>
              <div className="space-y-4">
                <div>
                  <label className={labelClass}>Ürün Adı *</label>
                  <input type="text" value={name} onChange={(e) => setName(e.target.value)} required className={inputClass} placeholder="Ör: Colombia Supremo" />
                </div>
                <div>
                  <label className={labelClass}>Açıklama</label>
                  <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className={inputClass} placeholder="Ürün açıklaması..." />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={labelClass}>Fiyat (₺) *</label>
                    <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className={inputClass} placeholder="0.00" />
                  </div>
                  <div>
                    <label className={labelClass}>Menşei</label>
                    <input type="text" value={origin} onChange={(e) => setOrigin(e.target.value)} className={inputClass} placeholder="Ör: Kolombiya" />
                  </div>
                </div>
                <div>
                  <label className={labelClass}>Kavurma Seviyesi</label>
                  <select value={roastLevel} onChange={(e) => setRoastLevel(e.target.value)} className={inputClass}>
                    <option value="">Seçiniz</option>
                    <option value="Light">Light</option>
                    <option value="Medium">Medium</option>
                    <option value="Medium-Dark">Medium-Dark</option>
                    <option value="Dark">Dark</option>
                  </select>
                </div>
              </div>
            </div>

            {fields.length > 0 && (
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
                <h2 className="text-lg font-medium text-white mb-6">Ek Alanlar</h2>
                <div className="space-y-4">
                  {fields.sort((a, b) => a.sort_order - b.sort_order).map((field) => (
                    <div key={field.id}>
                      <label className={labelClass}>
                        {field.label}{field.is_required && ' *'}
                      </label>

                      {field.type === 'input' && (
                        <input type="text" value={fieldValues[field.id] || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} required={field.is_required} className={inputClass} />
                      )}

                      {field.type === 'select' && (
                        <select value={fieldValues[field.id] || ''} onChange={(e) => handleFieldChange(field.id, e.target.value)} required={field.is_required} className={inputClass}>
                          <option value="">Seçiniz</option>
                          {field.options?.map((opt) => (
                            <option key={opt} value={opt}>{opt}</option>
                          ))}
                        </select>
                      )}

                      {field.type === 'checkbox' && (
                        <div className="flex flex-wrap gap-3 mt-1">
                          {field.options?.map((opt) => {
                            const current = fieldValues[field.id] ? JSON.parse(fieldValues[field.id]) : [];
                            return (
                              <label key={opt} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                                <input type="checkbox" checked={current.includes(opt)} onChange={(e) => handleCheckboxChange(field.id, opt, e.target.checked)} className="rounded border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-0" />
                                {opt}
                              </label>
                            );
                          })}
                        </div>
                      )}

                      {field.type === 'radio' && (
                        <div className="flex flex-wrap gap-3 mt-1">
                          {field.options?.map((opt) => (
                            <label key={opt} className="flex items-center gap-2 text-sm text-zinc-300 cursor-pointer">
                              <input type="radio" name={`field_${field.id}`} value={opt} checked={fieldValues[field.id] === opt} onChange={() => handleFieldChange(field.id, opt)} className="border-zinc-600 bg-zinc-800 text-emerald-500 focus:ring-0" />
                              {opt}
                            </label>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-medium text-white">Varyasyonlar</h2>
                <button type="button" onClick={addVariation} className="px-3 py-1.5 text-sm bg-zinc-800 border border-zinc-700 text-zinc-300 rounded-lg hover:bg-zinc-700 transition">
                  + Varyasyon Ekle
                </button>
              </div>

              {variations.length === 0 && (
                <p className="text-sm text-zinc-500">Henüz varyasyon eklenmemiş.</p>
              )}

              <div className="space-y-4">
                {variations.map((variation, index) => (
                  <div key={index} className="border border-zinc-700 rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-zinc-300">Varyasyon #{index + 1}</span>
                      <button type="button" onClick={() => removeVariation(index)} className="text-red-400 hover:text-red-300 text-sm transition">Kaldır</button>
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className={labelClass}>SKU</label>
                        <input type="text" value={variation.sku} onChange={(e) => updateVariation(index, 'sku', e.target.value)} className={inputClass} placeholder="Ör: COL-250" />
                      </div>
                      <div>
                        <label className={labelClass}>Fiyat (₺)</label>
                        <input type="number" step="0.01" value={variation.price} onChange={(e) => updateVariation(index, 'price', e.target.value)} className={inputClass} placeholder="0.00" />
                      </div>
                      <div>
                        <label className={labelClass}>Stok</label>
                        <input type="number" value={variation.stock} onChange={(e) => updateVariation(index, 'stock', parseInt(e.target.value) || 0)} className={inputClass} placeholder="0" />
                      </div>
                    </div>

                    {attributes.length > 0 && (
                      <div className="grid grid-cols-2 gap-3 pt-2">
                        {attributes.map((attr) => (
                          <div key={attr.id}>
                            <label className={labelClass}>{attr.name}</label>
                            <select
                              value={variation.selectedAttributes[attr.id] || ''}
                              onChange={(e) => updateVariationAttr(index, attr.id, parseInt(e.target.value))}
                              className={inputClass}
                            >
                              <option value="">Seçiniz</option>
                              {attr.values?.map((val) => (
                                <option key={val.id} value={val.id}>{val.value}</option>
                              ))}
                            </select>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="space-y-8">
            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <h2 className="text-lg font-medium text-white mb-4">Durum</h2>
              <label className="flex items-center gap-3 cursor-pointer">
                <div onClick={() => setIsActive(!isActive)} className={`relative w-11 h-6 rounded-full transition cursor-pointer ${isActive ? 'bg-emerald-500' : 'bg-zinc-700'}`}>
                  <div className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${isActive ? 'translate-x-5' : ''}`} />
                </div>
                <span className="text-sm text-zinc-300">{isActive ? 'Aktif' : 'Pasif'}</span>
              </label>
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
              <button type="submit" disabled={saving} className="w-full px-4 py-2.5 bg-white text-zinc-900 text-sm font-medium rounded-lg hover:bg-zinc-200 transition disabled:opacity-50">
                {saving ? 'Kaydediliyor...' : 'Ürünü Kaydet'}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}
