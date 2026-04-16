// OCRacle — Expert Types

export interface Expert {
  id: string;
  name: string;
  avatarUrl: string;
  credentials: string[];
  specializations: string[];
  rating: number;       // 1–5
  reviewCount: number;
  consultationFee: number; // ₹49 default
  responseTime: string; // e.g. '< 2 hrs', '< 4 hrs'
  bio?: string;
  linkedinUrl?: string;
  isVerified: boolean;
  totalConsultations: number;
}

export interface Consultation {
  id: string;
  expertId: string;
  productId: string;
  consumerId: string;
  status: 'pending' | 'active' | 'complete' | 'refunded';
  fee: number;
  expertResponse?: string;
  rating?: number;
  createdAt: string;
  respondedAt?: string;
}
