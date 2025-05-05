"use client";

import React, { useEffect } from "react";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { Flex, Layout } from "antd";
import "antd/dist/reset.css";
import styles from "./page.module.css";
import HeadCard from "./components/headCard";
import FunctionArea from "./components/functionArea";
import ChatArea from "./components/chatArea";
import LoginModal from "./components/loginModal";
import { GetSession } from "./serve/getSession";
const { Sider, Content } = Layout;

export default function Page() {
    const { isLogin, setLogin, setUsername, setUuid } = useUserInfoStore();
    const { setSessionInfo } = useSessionInfoStore();
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
        <Flex gap={0} wrap className={styles.flexContainer}>
            <Layout className={styles.layout}>
                <Sider width="20%" className={styles.sider}>
                    <HeadCard />
                    <FunctionArea />
                </Sider>
                <Layout>
                    <Content className={styles.content}>
                        <LoginModal />
                        <ChatArea />
                    </Content>
                </Layout>
            </Layout>
        </Flex>
    );
}
