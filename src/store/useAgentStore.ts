import { create } from "zustand";

interface Agent {
    intelligentAgentName: string;
    agentData: string;
    userName: string;
    isPublic: boolean;
    headPicture: string;
}

interface AgentStore {
    // 智能体列表
    agentList: Agent[];
    // 当前选中的智能体
    currentAgent: Agent | null;
    // 是否正在加载
    loading: boolean;
    // 错误信息
    error: string | null;
    // 设置智能体列表
    setAgentList: (agents: Agent[]) => void;
    // 设置当前选中的智能体
    setCurrentAgent: (agent: Agent | null) => void;
    // 设置加载状态
    setLoading: (loading: boolean) => void;
    // 设置错误信息
    setError: (error: string | null) => void;
    // 获取智能体列表
    fetchAgentList: (userName?: string) => Promise<void>;
    // 清空状态
    clearAgentStore: () => void;
}

export const useAgentStore = create<AgentStore>((set) => ({
    agentList: [],
    currentAgent: null,
    loading: false,
    error: null,

    setAgentList: (agents) => set({ agentList: agents }),
    setCurrentAgent: (agent) => set({ currentAgent: agent }),
    setLoading: (loading) => set({ loading }),
    setError: (error) => set({ error }),

    fetchAgentList: async (userName?: string) => {
        try {
            set({ loading: true, error: null });
            const response = await fetch("/api/intelligentAgent/list", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName }),
            });

            const data = await response.json();

            if (data.success) {
                set({ agentList: data.data });
            } else {
                set({ error: data.message });
            }
        } catch (error) {
            set({ error: error instanceof Error ? error.message : "获取智能体列表失败" });
        } finally {
            set({ loading: false });
        }
    },

    clearAgentStore: () =>
        set({
            agentList: [],
            currentAgent: null,
            loading: false,
            error: null,
        }),
}));
