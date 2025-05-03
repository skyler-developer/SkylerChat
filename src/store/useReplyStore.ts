import { create } from "zustand";

interface ReplyStore {
    reply: string;
    setReply: (reply: string) => void;
    loading: boolean;
    setLoading: (loading: boolean) => void;
}

export const useReplyStore = create<ReplyStore>((set) => ({
    loading: false,
    reply: "",
    setReply: (reply) => set({ reply }),
    setLoading: (loading) => set({ loading }),
}));
