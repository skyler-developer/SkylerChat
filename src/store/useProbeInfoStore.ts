import { create } from "zustand";

interface probeInfoStore {
    probeInfo: any[];
    setProbeInfo: (probeInfo: any[]) => void;
    clearProbeInfo: () => void;
}

export const useProbeInfoStore = create<probeInfoStore>((set) => ({
    probeInfo: [],
    setProbeInfo: (probeInfo) => set({ probeInfo }),
    clearProbeInfo: () => set({ probeInfo: [] }),
}));
