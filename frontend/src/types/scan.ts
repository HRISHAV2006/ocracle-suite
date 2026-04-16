// OCRacle — Scan Types

export type ScanMode = 'barcode' | 'ocr' | 'manual';
export type ScanStatus = 'idle' | 'scanning' | 'processing' | 'success' | 'error';
export type ScoreTier = 'ghost' | 'partial' | 'genuine' | 'verified';

export interface SubScore {
  label: 'Carbon Footprint' | 'Water Usage' | 'Chemical Toxicity';
  score: number;
  weight: number;
}

export interface TruthScore {
  overall: number;
  tier: ScoreTier;
  carbon: SubScore;
  water: SubScore;
  toxicity: SubScore;
  explanation: string[];
}

export interface ScanResult {
  id: string;
  productId: string;
  productName: string;
  brand: string;
  category: string;
  barcode?: string;
  scannedAt: string;
  score: TruthScore;
  alternatives: string[]; // product IDs
}

export interface ScanRequest {
  mode: ScanMode;
  barcode?: string;
  text?: string;
  imageBase64?: string;
}

export interface ScanHistoryItem {
  scanId: string;
  productId: string;
  productName: string;
  productBrand: string;
  overallScore: number;
  tier: string;
  scannedAt: string;
}
