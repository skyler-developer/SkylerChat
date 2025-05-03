"use client";

import React, { useState, useEffect, useRef } from "react";
import { Image } from "antd";
import ReactMarkdown from "react-markdown";
import { useMessageStore } from "@/store/useMessageStore";
import { useReplyStore } from "@/store/useReplyStore";
import styles from "./index.module.css";

export default function QaArea() {
    const { message } = useMessageStore();
    const { reply, loading } = useReplyStore();
    const containerRef = useRef<HTMLDivElement>(null);
    useEffect(() => {
        const container = containerRef.current;
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    }, [message, loading, reply]);
    console.log(message);
    console.log(loading);
    return (
        <div className={styles.qaArea} ref={containerRef}>
            {message.map((item, index) => {
                return (
                    <div
                        key={index}
                        className={
                            item.type === "question" ? styles.qaAreaQuestion : styles.qaAreaAnswer
                        }>
                        <div className={styles.qaAreaContent}>
                            <Image src="/DeepSeekImg.webp" width={50} height={50} />
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
                        <Image src="/DeepSeekImg.webp" width={50} height={50} />
                    </div>
                    <div className={styles.qaAreaContentItemText}>
                        <ReactMarkdown>{reply}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    );
}
