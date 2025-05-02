import { create } from "zustand";

interface ReplyStore {
  reply: string;
  setReply: (reply: string) => void;
}

export const useReplyStore = create<ReplyStore>((set) => ({
  reply: "",
  setReply: (reply) => set({ reply }),
}));
