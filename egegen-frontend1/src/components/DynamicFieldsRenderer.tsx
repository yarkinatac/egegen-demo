import type { ProductFieldValue } from '@/lib/types';

interface DynamicFieldsRendererProps {
  fieldValues: ProductFieldValue[];
}

// Admin panelden eklenen dinamik alanlari gosterir
export default function DynamicFieldsRenderer({
  fieldValues,
}: DynamicFieldsRendererProps) {
  if (!fieldValues?.length) return null;

  // Admin'in belirlediği siraya gore sirala
  const sorted = [...fieldValues].sort(
    (a, b) => (a.field?.sort_order ?? 0) - (b.field?.sort_order ?? 0)
  );

  const renderValue = (fv: ProductFieldValue) => {
    const { field, value } = fv;
    switch (field?.type) {
      case 'checkbox': {
        const on = value === '1' || value === 'true' || value === 'on';
        return (
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-semibold ${
              on
                ? 'bg-emerald-50 text-emerald-600'
                : 'bg-teal-dark/5 text-teal-dark/50'
            }`}
          >
            {on ? 'Evet' : 'Hayır'}
          </span>
        );
      }
      case 'select':
      case 'radio':
      case 'input':
      default:
        return (
          <span className="text-sm font-medium text-teal-dark">
            {value || '—'}
          </span>
        );
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="text-xs font-semibold uppercase tracking-wider text-teal-dark/60">
        Özellikler
      </h3>
      <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {sorted.map((fv) => (
          <div
            key={fv.id}
            className="flex items-start justify-between gap-4 rounded-xl border border-teal-dark/10 bg-white/60 px-4 py-3"
          >
            <dt className="text-xs font-semibold uppercase tracking-wider text-teal-dark/60">
              {fv.field?.label ?? fv.field?.field_key}
            </dt>
            <dd>{renderValue(fv)}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
