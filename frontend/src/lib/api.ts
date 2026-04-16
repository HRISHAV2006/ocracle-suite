import axios from 'axios';
import type { ScanResult } from '@/types/scan';
import type { Product } from '@/types/product';
import type { Expert } from '@/types/expert';

export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3001',
  timeout: 15_000,
  headers: { 'Content-Type': 'application/json' },
});

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

export async function scanByBarcode(barcode: string): Promise<ScanResult> {
  const { data } = await apiClient.post('/api/v1/scan/barcode', { barcode });
  return mapScanResponse(data.data);
}

export async function scanByText(text: string): Promise<ScanResult> {
  const { data } = await apiClient.post('/api/v1/scan/text', { text });
  return mapScanResponse(data.data);
}

export async function getProduct(id: string): Promise<Product> {
  const { data } = await apiClient.get<Product>(`/api/v1/products/${id}`);
  return data;
}

export async function getAlternatives(productId: string): Promise<Product[]> {
  const { data } = await apiClient.get<Product[]>(`/api/v1/products/${productId}/alternatives`);
  return data;
}

export async function getExperts(specialization?: string): Promise<Expert[]> {
  const { data } = await apiClient.get<Expert[]>('/api/v1/experts', {
    params: specialization ? { specialization } : undefined,
  });
  return data;
}

export async function getExpert(expertId: string): Promise<Expert> {
  const { data } = await apiClient.get<Expert>(`/api/v1/experts/${expertId}`);
  return data;
}
