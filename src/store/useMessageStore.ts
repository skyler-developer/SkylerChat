import { create } from "zustand";
import { v4 as uuidv4 } from "uuid";

interface MessageState {
    message: { type: "question" | "answer"; content: string }[];
    setMessage: (message: { type: "question" | "answer"; content: string }[]) => void;
    clearMessage: () => void;
    sessionId: string;
    setSessionId: (sessionId?: string) => void;
}

export const useMessageStore = create<MessageState>((set) => ({
    message: [],
    setMessage: (message: { type: "question" | "answer"; content: string }[]) => set({ message }),
    clearMessage: () => set({ message: [] }),
    sessionId: "",
    setSessionId: (sessionId?: string) =>
        set({ sessionId: sessionId || `${Date.now()}-${uuidv4()}` }),
}));
