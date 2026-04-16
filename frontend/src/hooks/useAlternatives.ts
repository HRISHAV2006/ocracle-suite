import { useQuery } from '@tanstack/react-query';
import type { Product } from '@/types/product';

// ── Comprehensive mock alternatives ──────────────────────────────────
const NOW = new Date().toISOString();

const MOCK_ALTERNATIVES: Product[] = [
  {
    id: 'alt-001',
    name: 'EcoLeaf Shampoo Bar',
    brand: 'EcoLeaf Naturals',
    category: 'personal-care',
    price: 249,
    barcode: '8901030111222',
    createdAt: NOW,
    updatedAt: NOW,
    truthScore: {
      overall: 8.4,
      label: 'Genuinely Sustainable',
      tier: 'genuine',
      carbon: { label: 'Carbon Footprint', score: 8.6, weight: 0.40 },
      water:  { label: 'Water Usage',       score: 8.2, weight: 0.35 },
      toxicity:{ label: 'Chemical Toxicity', score: 8.3, weight: 0.25 },
      explanation: ['Zero plastic packaging', 'Certified by B Corp', 'Locally sourced ingredients'],
      confidence: 0.95,
      isCached: false,
      scoredAt: NOW,
    },
  },
  {
    id: 'alt-002',
    name: 'Himalaya Pure Herbs Shampoo',
    brand: 'Himalaya Wellness',
    category: 'personal-care',
    price: 180,
    barcode: '8901030222333',
    createdAt: NOW,
    updatedAt: NOW,
    truthScore: {
      overall: 7.1,
      label: 'Genuinely Sustainable',
      tier: 'genuine',
      carbon: { label: 'Carbon Footprint', score: 6.9, weight: 0.40 },
      water:  { label: 'Water Usage',       score: 7.4, weight: 0.35 },
      toxicity:{ label: 'Chemical Toxicity', score: 7.2, weight: 0.25 },
      explanation: ['Ayurvedic formulation', 'No SLS/SLES', 'Recyclable packaging'],
      confidence: 0.88,
      isCached: false,
      scoredAt: NOW,
    },
  },
  {
    id: 'alt-003',
    name: 'Conscious Chemistry Hair Wash',
    brand: 'Conscious Chemistry',
    category: 'personal-care',
    price: 349,
    barcode: '8901030333444',
    createdAt: NOW,
    updatedAt: NOW,
    truthScore: {
      overall: 9.2,
      label: 'Verified Clean',
      tier: 'verified',
      carbon: { label: 'Carbon Footprint', score: 9.4, weight: 0.40 },
      water:  { label: 'Water Usage',       score: 9.1, weight: 0.35 },
      toxicity:{ label: 'Chemical Toxicity', score: 9.0, weight: 0.25 },
      explanation: ['Carbon neutral certified', 'EPD verified', 'Biodegradable ingredients'],
      confidence: 0.98,
      isCached: false,
      scoredAt: NOW,
    },
  },
];

export function useAlternatives(productId: string | null | undefined) {
  return useQuery<Product[]>({
    queryKey: ['alternatives', productId],
    queryFn: async () => {
      if (!productId) return [];
      try {
        const { getAlternatives } = await import('@/lib/api');
        return await getAlternatives(productId);
      } catch {
        return MOCK_ALTERNATIVES;
      }
    },
    enabled: !!productId,
    staleTime: 5 * 60 * 1000,
  });
}
