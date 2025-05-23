"use client";

import React, { useEffect } from "react";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { Flex, Layout, message, ConfigProvider } from "antd";
import "antd/dist/reset.css";
import styles from "./page.module.css";
import HeadCard from "./components/headCard";
import FunctionArea from "./components/functionArea";
import ChatArea from "./components/chatArea";
import LoginModal from "./components/loginModal";
import { GetSession } from "./serve/getSession";
import AgentCreate from "./components/agentArea/agentCreate";
import AgentShow from "./components/agentArea/agentShow";
import { useModeStore } from "@/store/useModeStore";
import { useRecommendationStore } from "@/store/recommendationStore";
import { messageContext } from "@/store/context";
const { Sider, Content } = Layout;

export default function Page() {
    const { isLogin, setLogin, setUsername, setUuid } = useUserInfoStore();
    const { mode } = useModeStore();
    const { setSessionInfo } = useSessionInfoStore();
    const { fetchRecommendations } = useRecommendationStore();
    const [messageApi, messageContextHolder] = message.useMessage();
    useEffect(() => {
        const fetchUserInfo = async () => {
            const token = localStorage.getItem("token");
            if (token) {
                try {
                    const response = await fetch("/api/userInfo/login", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ token }),
                    });
                    const data = await response.json();
                    if (data.success) {
                        setLogin(true);
                        setUsername(data.user.userName);
                        setUuid(data.user.uuid);
                        console.log("用户信息已存在", data.user);
                        GetSession(data.user.userName, setSessionInfo);
                        fetchRecommendations(data.user.userName);
                    } else {
                        localStorage.removeItem("token");
                    }
                } catch (error) {
                    console.error("Error fetching user info:", error);
                }
            }
        };
        fetchUserInfo();
    }, []);
    return (
        <ConfigProvider>
            {messageContextHolder}
            <Flex gap={0} wrap className={styles.flexContainer}>
                <messageContext.Provider value={messageApi}>
                    <Layout className={styles.layout}>
                        <Sider width="20%" className={styles.sider}>
                            <HeadCard />
                            <FunctionArea />
                        </Sider>
                        <Layout>
                            <Content className={styles.content}>
                                <LoginModal />
                                {(mode === "newSession" || mode === "historySession") && (
                                    <ChatArea />
                                )}
                                {mode === "agentCreate" && <AgentCreate />}
                                {mode === "agentShow" && <AgentShow />}
                            </Content>
                        </Layout>
                    </Layout>
                </messageContext.Provider>
            </Flex>
        </ConfigProvider>
    );
}
