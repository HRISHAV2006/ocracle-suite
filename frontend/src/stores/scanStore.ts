// OCRacle — Zustand Scan Store
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { ScanResult, ScanHistoryItem } from '@/types/scan';
import type { ScanMode, ScanStatus } from '@/types/scan';

interface ScanState {
  currentScan: ScanResult | null;
  scanHistory: ScanHistoryItem[];
  status: ScanStatus;
  scanMode: ScanMode;
  error: string | null;

  // Actions
  setScan: (scan: ScanResult) => void;
  clearScan: () => void;
  setStatus: (status: ScanStatus) => void;
  setScanMode: (mode: ScanMode) => void;
  setError: (error: string | null) => void;
  addToHistory: (item: ScanHistoryItem) => void;
  clearHistory: () => void;
}

export const useScanStore = create<ScanState>()(
  persist(
    (set) => ({
      currentScan: null,
      scanHistory: [],
      status: 'idle',
      scanMode: 'barcode',
      error: null,

      setScan: (scan) => set({ currentScan: scan, status: 'success', error: null }),
      clearScan: () => set({ currentScan: null, status: 'idle', error: null }),
      setStatus: (status) => set({ status }),
      setScanMode: (scanMode) => set({ scanMode }),
      setError: (error) => set({ error, status: 'error' }),
      addToHistory: (item) =>
        set((state) => ({
          scanHistory: [item, ...state.scanHistory].slice(0, 50), // Keep last 50
        })),
      clearHistory: () => set({ scanHistory: [] }),
    }),
    {
      name: 'ocracle-scan-store',
      partialize: (state) => ({ scanHistory: state.scanHistory }),
    }
  )
);
