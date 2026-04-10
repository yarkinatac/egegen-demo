// Laravel API'den gelen veri tipleri

export type DynamicFieldType = 'input' | 'select' | 'checkbox' | 'radio';

export interface ProductField {
  id: number;
  label: string;
  field_key: string;
  type: DynamicFieldType;
  options: string[] | null;
  is_required: boolean;
  sort_order: number;
}

export interface ProductFieldValue {
  id: number;
  product_id: number;
  product_field_id: number;
  value: string;
  field: ProductField;
}

export interface VariationAttribute {
  id: number;
  name: string;
  values?: VariationAttributeValue[];
}

export interface VariationAttributeValue {
  id: number;
  variation_attribute_id: number;
  value: string;
  attribute: VariationAttribute;
}

export interface ProductVariation {
  id: number;
  product_id: number;
  sku: string;
  price: string; // Laravel decimal cast string olarak donuyor
  stock: number;
  attribute_values: VariationAttributeValue[];
}

export interface Product {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  price: string;
  origin: string | null;
  roast_level: string | null;
  images: string[] | null;
  is_active: boolean;
  created_at?: string;
  updated_at?: string;
  field_values: ProductFieldValue[];
  variations: ProductVariation[];
}

// Yardimci fonksiyonlar

export const toNumber = (v: string | number | null | undefined): number =>
  v == null ? 0 : typeof v === 'number' ? v : parseFloat(v);

export interface CartItem {
  product_id: number;
  variation_id: number | null;
  quantity: number;
}
