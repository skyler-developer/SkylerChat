import { create } from "zustand";

interface ModeStore {
    mode: "newSession" | "agentCreate" | "historySession" | "agentShow";
    setMode: (mode: "newSession" | "agentCreate" | "historySession" | "agentShow") => void;
}

export const useModeStore = create<ModeStore>((set) => ({
    mode: "newSession",
    setMode: (mode) => set({ mode }),
}));
