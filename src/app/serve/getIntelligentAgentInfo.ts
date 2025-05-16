"use client";

import { useAgentStore } from "@/store/useAgentStore";

interface Agent {
    intelligentAgentName: string;
    agentData: string;
    userName: string;
    isPublic: boolean;
    headPicture: string;
}

/**
 * 根据智能体名称获取智能体信息
 * @param intelligentAgentName 智能体名称
 * @returns Promise<Agent | null> 智能体信息，如果获取失败则返回null
 */
export async function getIntelligentAgentInfo(intelligentAgentName: string): Promise<Agent | null> {
    try {
        const response = await fetch("/api/intelligentAgent/getAgent", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                intelligentAgentName,
            }),
        });

        const data = await response.json();

        if (data.success) {
            // 更新当前智能体信息
            useAgentStore.getState().setCurrentAgent(data.data);
            return data.data;
        } else {
            console.error("获取智能体信息失败:", data.message);
            return null;
        }
    } catch (error) {
        console.error("获取智能体信息时出错:", error);
        return null;
    }
}
