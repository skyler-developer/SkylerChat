import { create } from "zustand";

interface MessageState {
  message: { type: "question" | "answer"; content: string }[];
  setMessage: (
    message: { type: "question" | "answer"; content: string }[]
  ) => void;
  clearMessage: () => void;
}

export const useMessageStore = create<MessageState>((set) => ({
  message: [],
  setMessage: (message: { type: "question" | "answer"; content: string }[]) =>
    set({ message }),
  clearMessage: () => set({ message: [] }),
}));
