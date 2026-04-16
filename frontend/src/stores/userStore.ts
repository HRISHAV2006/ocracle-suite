// OCRacle — Zustand User Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, ImpactStats } from '@/types/user';

interface UserState {
  user: User | null;
  isPremium: boolean;
  impactStats: ImpactStats;

  // Actions
  setUser: (user: User | null) => void;
  updateImpactStats: (updates: Partial<ImpactStats>) => void;
  clearUser: () => void;
}

const defaultImpactStats: ImpactStats = {
  plasticAvoided: 0,
  co2Saved: 0,
  waterConserved: 0,
  productsSwitched: 0,
  moneySaved: 0,
  totalScans: 0,
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      isPremium: false,
      impactStats: defaultImpactStats,

      setUser: (user) =>
        set({
          user,
          isPremium: user?.isPremium ?? false,
        }),
      updateImpactStats: (updates) =>
        set((state) => ({
          impactStats: { ...state.impactStats, ...updates },
        })),
      clearUser: () =>
        set({
          user: null,
          isPremium: false,
          impactStats: defaultImpactStats,
        }),
    }),
    {
      name: 'ocracle-user-store',
    }
  )
);
