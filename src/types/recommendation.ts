export interface UserBehavior {
    id: number;
    userName: string;
    intelligentAgentName: string;
    sessionId: string;
    interactionType: "view" | "use" | "complete";
    createdAt: Date;
}

export interface UserPreference {
    userName: string;
    intelligentAgentNames: string[];
    lastUsed: Date;
    usageCount: number;
}

export interface AgentRecommendation {
    intelligentAgentName: string;
    score: number;
    reason: string;
}

export interface RecommendationState {
    userPreferences: UserPreference[];
    recommendations: AgentRecommendation[];
    isLoading: boolean;
    error: string | null;
}
