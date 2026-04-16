import { useQuery } from '@tanstack/react-query';
import type { Expert } from '@/types/expert';

// ── Mock data (used when real API is unavailable) ─────────────────────
export const MOCK_EXPERTS: Expert[] = [
  {
    id: 'exp-001',
    name: 'Dr. Priya Sharma',
    avatarUrl: '',
    totalConsultations: 247,
    credentials: ['PhD Environmental Science', 'Certified Life Cycle Analyst', 'IIT Delhi'],
    specializations: ['Carbon footprint assessment', 'FMCG supply chain', 'Cosmetics toxicology'],
    rating: 4.9,
    reviewCount: 247,
    consultationFee: 49,
    responseTime: '< 2 hrs',
    isVerified: true,
  },
  {
    id: 'exp-002',
    name: 'Arjun Mehta',
    avatarUrl: '',
    totalConsultations: 183,
    credentials: ['MSc Sustainability', 'EPD Auditor', 'GRI Certified'],
    specializations: ['Food & beverage labelling', 'Greenwashing litigation', 'EPD verification'],
    rating: 4.7,
    reviewCount: 183,
    consultationFee: 49,
    responseTime: '< 4 hrs',
    isVerified: true,
  },
  {
    id: 'exp-003',
    name: 'Meera Rajan',
    avatarUrl: '',
    totalConsultations: 129,
    credentials: ['MTech Chemical Engineering', 'REACH Compliance Expert', 'Toxicologist'],
    specializations: ['Chemical toxicity analysis', 'Restricted substances', 'Household cleaning products'],
    rating: 4.8,
    reviewCount: 129,
    consultationFee: 49,
    responseTime: '< 3 hrs',
    isVerified: true,
  },
  {
    id: 'exp-004',
    name: 'Prof. Vikram Nair',
    avatarUrl: '',
    totalConsultations: 72,
    credentials: ['PhD Ecology', 'Carbon Trust Assessor', 'IPCC Contributor'],
    specializations: ['Climate impact scoring', 'Water footprint', 'Agriculture supply chains'],
    rating: 5.0,
    reviewCount: 72,
    consultationFee: 99,
    responseTime: '< 6 hrs',
    isVerified: true,
  },
  {
    id: 'exp-005',
    name: 'Sunita Krishnan',
    avatarUrl: '',
    totalConsultations: 94,
    credentials: ['MBA Sustainability', 'B Corp Advisor', 'Fair Trade Auditor'],
    specializations: ['Ethical sourcing', 'Social impact scoring', 'Worker welfare'],
    rating: 4.6,
    reviewCount: 94,
    consultationFee: 49,
    responseTime: '< 5 hrs',
    isVerified: false,
  },
  {
    id: 'exp-006',
    name: 'Rahul Desai',
    avatarUrl: '',
    totalConsultations: 68,
    credentials: ['MSc Environmental Management', 'ISO 14001 Lead Auditor'],
    specializations: ['Packaging sustainability', 'Plastic footprint', 'Circular economy'],
    rating: 4.5,
    reviewCount: 68,
    consultationFee: 49,
    responseTime: '< 4 hrs',
    isVerified: true,
  },
];

/** Fetch experts from the API (falls back to mock data when offline/dev) */
export function useExperts(specialization?: string) {
  return useQuery<Expert[]>({
    queryKey: ['experts', specialization ?? 'all'],
    queryFn: async () => {
      try {
        const { getExperts } = await import('@/lib/api');
        return await getExperts(specialization);
      } catch {
        // Return mock data — real API not yet connected
        if (!specialization) return MOCK_EXPERTS;
        return MOCK_EXPERTS.filter((e) =>
          e.specializations.some((s) => s.toLowerCase().includes(specialization.toLowerCase()))
        );
      }
    },
    staleTime: 5 * 60 * 1000, // 5 min
  });
}

/** Fetch a single expert */
export function useExpert(expertId: string) {
  return useQuery<Expert>({
    queryKey: ['expert', expertId],
    queryFn: async () => {
      try {
        const { getExpert } = await import('@/lib/api');
        return await getExpert(expertId);
      } catch {
        const found = MOCK_EXPERTS.find((e) => e.id === expertId);
        if (!found) throw new Error('Expert not found');
        return found;
      }
    },
    enabled: !!expertId,
    staleTime: 10 * 60 * 1000,
  });
}
