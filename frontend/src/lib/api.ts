import axios from 'axios';
import type { ScanResult } from '@/types/scan';
import type { Product } from '@/types/product';
import type { Expert } from '@/types/expert';

// ── Axios client ──────────────────────────────────────────────────────
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach Firebase ID token when available (browser only)
if (typeof window !== 'undefined') {
  apiClient.interceptors.request.use(async (config) => {
    try {
      const { auth } = await import('@/lib/firebase');
      const token = await auth.currentUser?.getIdToken();
      if (token) config.headers.Authorization = `Bearer ${token}`;
    } catch {
      // Firebase not initialised yet — continue without token
    }
    return config;
  });
}

// ── Typed API wrappers ────────────────────────────────────────────────

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapScanResponse(resData: any): ScanResult {
  const { product, truthScore } = resData;
  return {
    id: `scan-${Date.now()}`,
    productId: product.id,
    productName: product.name,
    brand: product.brand,
    category: product.category,
    barcode: product.barcode,
    scannedAt: new Date().toISOString(),
    score: {
      overall: truthScore.overall,
      tier: truthScore.overall < 4 ? 'ghost' : truthScore.overall < 7 ? 'partial' : truthScore.overall < 9 ? 'genuine' : 'verified',
      carbon: { label: 'Carbon Footprint', score: truthScore.carbon, weight: 0.40 },
      water: { label: 'Water Usage', score: truthScore.water, weight: 0.35 },
      toxicity: { label: 'Chemical Toxicity', score: truthScore.toxicity, weight: 0.25 },
      explanation: truthScore.explanation || [],
    },
    alternatives: []
  };
}

/** Scan a product by EAN/UPC barcode */
export async function scanByBarcode(barcode: string): Promise<ScanResult> {
  const { data } = await apiClient.post('/api/v1/scan/barcode', { barcode });
  return mapScanResponse(data.data);
}

/** Scan a product via OCR ingredient text */
export async function scanByText(text: string): Promise<ScanResult> {
  const { data } = await apiClient.post('/api/v1/scan/text', { text });
  return mapScanResponse(data.data);
}

/** Lookup a single product by internal id */
export async function getProduct(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/api/v1/products/${id}`);
  return data;
}

/** Get eco-alternative products for a given product */
export async function getAlternatives(productId: string): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/api/v1/products/${productId}/alternatives`);
  return data;
}

/** List all verified experts (optionally filter by specialization) */
export async function getExperts(specialization?: string): Promise<Expert[]> {
  const { data } = await apiClient.get<Expert[]>('/api/v1/experts', {
    params: specialization ? { specialization } : undefined,
  });
  return data;
}

/** Get a single expert by id */
export async function getExpert(expertId: string): Promise<Expert> {
  const { data } = await apiClient.get<Expert>(`/api/v1/experts/${expertId}`);
  return data;
}
