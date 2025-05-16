// 展示智能体页面

import React, { useEffect, useState } from "react";
import { useAgentStore } from "@/store/useAgentStore";
import { useModeStore } from "@/store/useModeStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useProbeInfoStore } from "@/store/useProbeInfoStore";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import styles from "./index.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";
import { AgentRecommendations } from "@/app/components/agentRecommendations";
import { useRecommendationStore } from "@/store/recommendationStore";
import { sendBehavior } from "@/app/serve/sendBehavior";

interface Agent {
    intelligentAgentName: string;
    agentData: string;
    userName: string;
    isPublic: boolean;
    headPicture: string;
}

const AgentShow: React.FC = () => {
    const { agentList, loading, error, fetchAgentList, setCurrentAgent } = useAgentStore();
    const { recommendations } = useRecommendationStore();
    const { setMode } = useModeStore();
    const { clearMessage, setSessionId } = useMessageStore();
    const { clearProbeInfo } = useProbeInfoStore();
    const { username } = useUserInfoStore();
    const [displayAgents, setDisplayAgents] = useState<Agent[]>([]);

    useEffect(() => {
        fetchAgentList(username);
    }, []);

    const handleCardClick = (agent: Agent) => {
        setCurrentAgent(agent);
        setMode("newSession");
        clearMessage();
        clearProbeInfo();
        setSessionId();
        sendBehavior({
            userName: username,
            intelligentAgentName: agent.intelligentAgentName,
            sessionId: "",
            interactionType: "view",
        });
    };

    useEffect(() => {
        const recommendedNames = recommendations.map((r) => r.intelligentAgentName);
        const recommendedAgents = recommendedNames
            .map((name) => agentList.find((agent) => agent.intelligentAgentName === name))
            .filter(Boolean) as Agent[];
        const otherAgents = agentList.filter(
            (agent) => !recommendedNames.includes(agent.intelligentAgentName),
        );
        setDisplayAgents([...recommendedAgents, ...otherAgents]);
    }, [recommendations, agentList]);

    if (loading) {
        return <div className={styles.loadingContainer}>Loading...</div>;
    }

    if (error) {
        return <div className={styles.errorContainer}>{error}</div>;
    }

    return (
        <div className={styles.agentShow}>
            <div className={styles.header}>
                <Button
                    type="primary"
                    className={styles.createButton}
                    icon={<PlusOutlined />}
                    onClick={() => setMode("agentCreate")}>
                    创建智能体
                </Button>
            </div>
            <div className={styles.agentGrid}>
                {displayAgents.map((agent: Agent, index: number) => (
                    <div
                        key={agent.intelligentAgentName}
                        className={styles.agentCard}
                        onClick={() => handleCardClick(agent)}>
                        <img
                            src={
                                agent.headPicture || "http://www.skyler.fun/robotDefaultImage.webp"
                            }
                            alt={agent.intelligentAgentName}
                            className={styles.agentAvatar}
                        />
                        <div className={styles.agentName}>{agent.intelligentAgentName}</div>
                        <div className={styles.agentOwner}>{agent.userName}</div>
                        <div className={styles.agentOwner}>
                            {index < 3 && recommendations?.[index]?.reason && "为您推荐"}
                        </div>
                        <div className={styles.agentStatus}>
                            <div
                                className={`${styles.statusDot} ${
                                    !agent.isPublic ? styles.private : ""
                                }`}
                            />
                            {agent.isPublic ? "Public" : "Private"}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default AgentShow;
