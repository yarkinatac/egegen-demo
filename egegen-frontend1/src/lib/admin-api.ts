const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000/api';

const headers = {
  Accept: 'application/json',
  'Content-Type': 'application/json',
};

async function request(url: string, options?: RequestInit) {
  const res = await fetch(`${API_URL}${url}`, {
    ...options,
    headers,
    cache: 'no-store',
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(`API hatasi: ${res.status} - ${text}`);
  }

  return res.json();
}

// Urunler
export const getAdminProducts = () => request('/products?all=1');
export const getProduct = (id: number) => request(`/products/${id}`);
export const createProduct = (data: any) =>
  request('/products', { method: 'POST', body: JSON.stringify(data) });
export const updateProduct = (id: number, data: any) =>
  request(`/products/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteProduct = (id: number) =>
  request(`/products/${id}`, { method: 'DELETE' });

// Dinamik Alanlar
export const getFields = () => request('/fields');
export const getField = (id: number) => request(`/fields/${id}`);
export const createField = (data: any) =>
  request('/fields', { method: 'POST', body: JSON.stringify(data) });
export const updateField = (id: number, data: any) =>
  request(`/fields/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteField = (id: number) =>
  request(`/fields/${id}`, { method: 'DELETE' });

// Varyasyon Tipleri
export const getAttributes = () => request('/attributes');
export const getAttribute = (id: number) => request(`/attributes/${id}`);
export const createAttribute = (data: any) =>
  request('/attributes', { method: 'POST', body: JSON.stringify(data) });
export const updateAttribute = (id: number, data: any) =>
  request(`/attributes/${id}`, { method: 'PUT', body: JSON.stringify(data) });
export const deleteAttribute = (id: number) =>
  request(`/attributes/${id}`, { method: 'DELETE' });
