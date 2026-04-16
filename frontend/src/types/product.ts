// OCRacle — Product Types

export type ScoreLabel = 
  | 'Ghost Label'
  | 'Partial Truth'
  | 'Genuinely Sustainable'
  | 'Verified Clean';

export type ScoreTier = 'ghost' | 'partial' | 'genuine' | 'verified';

export interface SubScore {
  label: 'Carbon Footprint' | 'Water Usage' | 'Chemical Toxicity';
  score: number; // 0–10
  weight: number; // 0.40 | 0.35 | 0.25
}

export interface TruthScore {
  overall: number;        // 0–10
  label: ScoreLabel;
  tier: ScoreTier;
  carbon: SubScore;
  water: SubScore;
  toxicity: SubScore;
  explanation: string[];  // 2–3 AI-generated bullet points
  confidence: number;     // 0–1
  isCached: boolean;
  scoredAt: string;       // ISO date
}

export interface Product {
  id: string;
  barcode?: string;
  name: string;
  brand: string;
  category: 'personal-care' | 'food-beverage' | 'household-cleaning' | 'fashion' | 'electronics';
  subcategory?: string;
  imageUrl?: string;
  price?: number;
  currency?: string;
  availability?: string[];
  truthScore?: TruthScore;
  ingredients?: string[];
  purchaseUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ScanResult {
  scanId: string;
  product: Product;
  truthScore: TruthScore;
  alternatives: Product[];
  scanMode: 'barcode' | 'ocr' | 'manual';
  scannedAt: string;
}
