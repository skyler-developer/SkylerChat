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
import remarkGfm from "remark-gfm";

// 处理思考过程的自定义渲染器
const processContent = (content: string) => {
    // 检查是否包含不完整的 think 标签
    const hasOpenThink = content.includes("<think>");
    const hasCloseThink = content.includes("</think>");

    // 如果只有开始标签，说明正在流式输出思考过程
    if (hasOpenThink && !hasCloseThink) {
        const parts = content.split("<think>");
        return (
            <>
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{parts[0]}</ReactMarkdown>
                <div className={styles.thinkProcess}>
                    <div className={styles.thinkHeader}>思考中：</div>
                    <div className={styles.thinkContent}>
                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{parts[1]}</ReactMarkdown>
                    </div>
                </div>
            </>
        );
    }

    // 如果包含完整的 think 标签，使用原来的处理方式
    if (hasOpenThink && hasCloseThink) {
        const thinkRegex = /<think>([\s\S]*?)<\/think>/g;
        const parts = content.split(thinkRegex);

        return parts.map((part, index) => {
            if (index % 2 === 0) {
                return (
                    <ReactMarkdown key={index} remarkPlugins={[remarkGfm]}>
                        {part}
                    </ReactMarkdown>
                );
            } else {
                return (
                    <div key={index} className={styles.thinkProcess}>
                        <div className={styles.thinkHeader}>思考中：</div>
                        <div className={styles.thinkContent}>
                            <ReactMarkdown remarkPlugins={[remarkGfm]}>{part}</ReactMarkdown>
                        </div>
                    </div>
                );
            }
        });
    }

    // 如果没有 think 标签，直接渲染内容
    return <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>;
};

const QaArea: React.FC = () => {
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
                    <Image
                        src={currentAgent?.headPicture || "/DeepSeekImg.webp"}
                        width={50}
                        height={50}
                        preview={false}
                        className={styles.image}
                    />
                </div>
                <div className={styles.qaAreaContentItemText}>
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                        请问有什么可以帮助您？
                    </ReactMarkdown>
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
                            <Image
                                src={
                                    item.type === "answer"
                                        ? currentAgent?.headPicture || "/DeepSeekImg.webp"
                                        : "http://www.skyler.fun/dogStudy.png"
                                }
                                width={50}
                                height={50}
                                preview={false}
                                className={styles.image}
                            />
                        </div>
                        <div className={styles.qaAreaContentItemText}>
                            <div className={styles.content}>{processContent(item.content)}</div>
                        </div>
                    </div>
                );
            })}
            {loading && (
                <div className={styles.qaAreaAnswer}>
                    <div className={styles.qaAreaContent}>
                        <Image
                            src={currentAgent?.headPicture || "/DeepSeekImg.webp"}
                            width={50}
                            height={50}
                            preview={false}
                            className={styles.image}
                        />
                    </div>
                    <div className={styles.qaAreaContentItemText}>{processContent(reply)}</div>
                </div>
            )}
            {probeInfo.map((item, index) => {
                return (
                    <div
                        style={{ width: "80%", display: "flex", cursor: "pointer" }}
                        key={index}
                        onClick={() => handleClickProbe(item)}>
                        {/* 这里的image是为了占位，实际不显示 */}
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
};

export default QaArea;
