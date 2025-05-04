import { create } from "zustand";

interface SessionInfoStore {
    sessionId: string;
    sessionInfo: string;
    setSessionId: (sessionId: string) => void;
    setSessionInfo: (sessionInfo: string) => void;
    clearSessionInfo: () => void;
}

export const useSessionInfoStore = create<SessionInfoStore>((set) => ({
    sessionId: "",
    sessionInfo: "",
    setSessionId: (sessionId) => set({ sessionId }),
    setSessionInfo: (sessionInfo) => set({ sessionInfo }),
    clearSessionInfo: () => set({ sessionId: "", sessionInfo: "" }),
}));
