// 展示智能体页面

import React, { useEffect } from "react";
import { useAgentStore } from "@/store/useAgentStore";
import { useModeStore } from "@/store/useModeStore";
import styles from "./index.module.css";
import { PlusOutlined } from "@ant-design/icons";
import { Button } from "antd";

interface Agent {
    intelligentAgentName: string;
    agentData: string;
    userName: string;
    isPublic: boolean;
    headPicture: string;
}

const AgentShow: React.FC = () => {
    const { agentList, loading, error, fetchAgentList, setCurrentAgent } = useAgentStore();
    const { setMode } = useModeStore();

    useEffect(() => {
        fetchAgentList();
    }, []);

    const handleCardClick = (agent: Agent) => {
        setCurrentAgent(agent);
        setMode("newSession");
    };

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
                {agentList.map((agent: Agent) => (
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
