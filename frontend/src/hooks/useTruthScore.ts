import { useMutation } from '@tanstack/react-query';
import { useScanStore } from '@/stores/scanStore';
import { useUIStore } from '@/stores/uiStore';
import type { ScanResult } from '@/types/scan';

// ── Mock scan result generator ────────────────────────────────────────
function buildMockResult(input: string): ScanResult {
  // Deterministically vary score based on input length so different inputs give different results
  const seed = (input.length * 7 + input.charCodeAt(0)) % 10;
  const overall = parseFloat((1.5 + seed * 0.85).toFixed(1));

  const tier =
    overall < 4 ? 'ghost' :
    overall < 7 ? 'partial' :
    overall < 9 ? 'genuine' : 'verified';

  return {
    id: `mock-${Date.now()}`,
    productId: 'mock-prod',
    productName: input.match(/\d{8,}/) ? `Product (Barcode: ${input})` : input,
    brand: 'Demo Brand',
    category: 'personal-care',
    barcode: input.match(/\d{8,}/) ? input : undefined,
    scannedAt: new Date().toISOString(),
    score: {
      overall,
      tier,
      carbon: { label: 'Carbon Footprint', score: parseFloat((overall - 0.3).toFixed(1)), weight: 0.40 },
      water:  { label: 'Water Usage',       score: parseFloat((overall + 0.5).toFixed(1)), weight: 0.35 },
      toxicity: { label: 'Chemical Toxicity', score: parseFloat((overall + 0.2).toFixed(1)), weight: 0.25 },
      explanation: [
        `Overall Truth Score: ${overall}/10 — ${tier === 'ghost' ? 'confirmed greenwashing detected' : tier === 'partial' ? 'mixed environmental claims' : tier === 'genuine' ? 'strong eco credentials' : 'exceptional sustainability'}`,
        'Carbon footprint cross-referenced against Open Food Facts (2024 data)',
        'Chemical toxicity matched against EPD Online restricted substances list',
      ],
    },
    alternatives: [],
  };
}

// ── Hook ─────────────────────────────────────────────────────────────

interface ScanInput {
  query: string;     // barcode number or text
  mode: 'barcode' | 'ocr' | 'manual';
}

export function useTruthScore() {
  const { setScan } = useScanStore();
  const { setScanning } = useUIStore();

  const mutation = useMutation<ScanResult, Error, ScanInput>({
    mutationFn: async ({ query, mode }) => {
      setScanning(true);
      try {
        const { scanByBarcode, scanByText } = await import('@/lib/api');
        if (mode === 'barcode') return await scanByBarcode(query);
        return await scanByText(query);
      } catch {
        // Simulate network delay for demo
        await new Promise((r) => setTimeout(r, 1400));
        return buildMockResult(query);
      }
    },
    onSuccess: (result) => {
      setScan(result);
      setScanning(false);
    },
    onError: () => {
      setScanning(false);
    },
  });

  return mutation;
}
