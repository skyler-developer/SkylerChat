"use client";

import React, { useState, useEffect, useRef } from "react";
import { Image } from "antd";
import ReactMarkdown from "react-markdown";
import { ArrowRightOutlined } from "@ant-design/icons";
import { useMessageStore } from "@/store/useMessageStore";
import { useReplyStore } from "@/store/useReplyStore";
import { useProbeInfoStore } from "@/store/useProbeInfoStore";
import { useAgentStore } from "@/store/useAgentStore";
import { getResponse } from "@/app/serve/getReply";
import styles from "./index.module.css";

export default function QaArea() {
    const { message, setMessage, sessionId, setSessionId } = useMessageStore();
    const { reply, loading, setReply } = useReplyStore();
    const { probeInfo, clearProbeInfo } = useProbeInfoStore();
    const containerRef = useRef<HTMLDivElement>(null);
    const { currentAgent } = useAgentStore();
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [message, loading, reply, probeInfo]);
    console.log(message);
    console.log(loading);

    const handleClickProbe = (item: { index: number; content: string }) => {
        sessionId || setSessionId();
        setMessage([...message, { type: "question", content: item.content }]);
        getResponse(item.content, setReply, setMessage);
        clearProbeInfo(); // 清空追问问题
    };

    return (
        <div className={styles.qaArea} ref={containerRef}>
            <div className={styles.qaAreaAnswer}>
                <div className={styles.qaAreaContent}>
                    <Image src="/DeepSeekImg.webp" width={32} height={32} preview={false} />
                </div>
                <div className={styles.qaAreaContentItemText}>
                    <ReactMarkdown>请问有什么可以帮助您？</ReactMarkdown>
                </div>
            </div>
            {message.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={
                            item.type === "question" ? styles.qaAreaQuestion : styles.qaAreaAnswer
                        }>
                        <div className={styles.qaAreaContent}>
                            <Image src="/DeepSeekImg.webp" width={32} height={32} preview={false} />
                        </div>
                        <div className={styles.qaAreaContentItemText}>
                            <ReactMarkdown>{item.content}</ReactMarkdown>
                        </div>
                    </div>
                );
            })}
            {loading && (
                <div className={styles.qaAreaAnswer}>
                    <div className={styles.qaAreaContent}>
                        <Image src="/DeepSeekImg.webp" width={32} height={32} preview={false} />
                    </div>
                    <div className={styles.qaAreaContentItemText}>
                        <ReactMarkdown>{reply}</ReactMarkdown>
                    </div>
                </div>
            )}
            {probeInfo.map((item, index) => {
                return (
                    <div
                        style={{ width: "80%", display: "flex", cursor: "pointer" }}
                        key={index}
                        onClick={() => handleClickProbe(item)}>
                        <div className={styles.qaAreaContent} style={{ opacity: 0 }}>
                            <Image src="/DeepSeekImg.webp" width={32} height={32} />
                        </div>
                        <div className={styles.probeText}>
                            <div style={{ marginRight: 20 }}> {item.content}</div>
                            <ArrowRightOutlined />
                        </div>
                    </div>
                );
            })}
        </div>
    );
}
