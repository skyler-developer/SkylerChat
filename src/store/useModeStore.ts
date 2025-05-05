import { create } from "zustand";

interface ModeStore {
    mode: "newSession" | "agent" | "historySession";
    setMode: (mode: "newSession" | "agent" | "historySession") => void;
}

export const useModeStore = create<ModeStore>((set) => ({
    mode: "newSession",
    setMode: (mode) => set({ mode }),
}));
