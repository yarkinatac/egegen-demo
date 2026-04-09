import type { Product } from './types';

const API_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') ||
  'http://localhost:8000/api';

const jsonHeaders = {
  Accept: 'application/json',
};

// API istekleri

export async function getProducts(): Promise<Product[]> {
  const res = await fetch(`${API_URL}/products`, {
    headers: jsonHeaders,
    cache: 'no-store',
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch products (${res.status})`);
  }

  return res.json();
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const res = await fetch(
    `${API_URL}/products/detail/${encodeURIComponent(slug)}`,
    {
      headers: jsonHeaders,
      cache: 'no-store',
    }
  );

  if (res.status === 404) return null;

  if (!res.ok) {
    throw new Error(`Failed to fetch product "${slug}" (${res.status})`);
  }

  return res.json();
}

export async function getAllSlugs(): Promise<string[]> {
  try {
    const products = await getProducts();
    return products.map((p) => p.slug);
  } catch {
    return [];
  }
}
