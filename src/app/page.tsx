"use client";

import React from "react";
import { Flex, Layout } from "antd";
import "antd/dist/reset.css";
import styles from "./page.module.css";
import HeadCard from "./components/headCard";
import FunctionArea from "./components/functionArea";
import ChatArea from "./components/chatArea";
import LoginModal from "./components/loginModal";
const { Sider, Content } = Layout;

export default function Page() {
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
