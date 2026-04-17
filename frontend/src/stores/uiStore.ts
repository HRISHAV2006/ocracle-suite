// OCRacle — Zustand UI Store
import { create } from 'zustand';
import type { ScanMode } from '@/types/scan';

interface UIState {
  isScanning: boolean;
  isMobileMenuOpen: boolean;
  activeModal: string | null;
  scanMode: ScanMode;

  // Actions
  setScanning: (v: boolean) => void;
  setIsScanning: (v: boolean) => void; // alias for compatibility
  setMobileMenuOpen: (v: boolean) => void;
  openModal: (id: string) => void;
  closeModal: () => void;
  setScanMode: (mode: ScanMode) => void;
}

export const useUIStore = create<UIState>()((set) => ({
  isScanning: false,
  isMobileMenuOpen: false,
  activeModal: null,
  scanMode: 'ocr',

  setScanning: (isScanning) => set({ isScanning }),
  setIsScanning: (isScanning) => set({ isScanning }),
  setMobileMenuOpen: (isMobileMenuOpen) => set({ isMobileMenuOpen }),
  openModal: (id) => set({ activeModal: id }),
  closeModal: () => set({ activeModal: null }),
  setScanMode: (scanMode) => set({ scanMode }),
}));
