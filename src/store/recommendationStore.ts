import { create } from "zustand";
import { RecommendationState } from "@/types/recommendation";

interface RecommendationStore extends RecommendationState {
    fetchRecommendations: (userName: string) => Promise<void>;
    clearRecommendations: () => void;
}

export const useRecommendationStore = create<RecommendationStore>((set) => ({
    userPreferences: [],
    recommendations: [],
    isLoading: false,
    error: null,

    fetchRecommendations: async (userName: string) => {
        try {
            set({ isLoading: true, error: null });
            const response = await fetch("/api/intelligentAgent/recommend", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ userName }),
            });
            const result = await response.json();
            if (result.success) {
                set({ recommendations: result.data, isLoading: false });
            } else {
                set({
                    error: result.message || "Failed to fetch recommendations",
                    isLoading: false,
                });
            }
        } catch (error) {
            set({
                error: error instanceof Error ? error.message : "Failed to fetch recommendations",
                isLoading: false,
            });
        }
    },

    clearRecommendations: () => {
        set({ recommendations: [], error: null });
    },
}));
