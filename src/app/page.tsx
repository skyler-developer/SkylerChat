"use client";

import React, { useEffect } from "react";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { Flex, Layout } from "antd";
import "antd/dist/reset.css";
import styles from "./page.module.css";
import HeadCard from "./components/headCard";
import FunctionArea from "./components/functionArea";
import ChatArea from "./components/chatArea";
import LoginModal from "./components/loginModal";
const { Sider, Content } = Layout;

export default function Page() {
    const { isLogin, setLogin, setUsername, setUuid } = useUserInfoStore();
    useEffect(() => {
        // 获取当前localStorage中的token
        const token = localStorage.getItem("token");
        // 如果token存在，则调用login api获取用户信息
        if (token) {
            fetch("/api/userInfo/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ token }),
            })
                .then((response) => response.json())
                .then((data) => {
                    if (data.success) {
                        // 如果获取用户信息成功，则更新用户信息到store
                        setLogin(true);
                        setUsername(data.user.userName);
                        setUuid(data.user.uuid);
                        console.log("用户信息已存在", data.user);
                    } else {
                        // 如果获取用户信息失败，则清除localStorage中的token
                        localStorage.removeItem("token");
                    }
                })
                .catch((error) => {
                    console.error("Error fetching user info:", error);
                });
        }
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
