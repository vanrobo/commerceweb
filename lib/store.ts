import { create } from 'zustand';

export interface Finding {
    id: string;
    type: string;
    title: string;
    description: string;
    top: string;
    left: string;
    width: string;
    height: string;
    value?: number;
}

interface ScannerState {
    findings: Finding[];
    totalMarkup: number;
    previewUrl: string | null;
    setScanData: (findings: Finding[], totalMarkup: number, previewUrl: string | null) => void;
    clearScanData: () => void;
}

export const useScannerStore = create<ScannerState>((set) => ({
    findings: [],
    totalMarkup: 0,
    previewUrl: null,
    setScanData: (findings, totalMarkup, previewUrl) => set({ findings, totalMarkup, previewUrl }),
    clearScanData: () => set({ findings: [], totalMarkup: 0, previewUrl: null }),
}));
