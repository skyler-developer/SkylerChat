"use client";

import React, { useState, useEffect } from "react";
import { getResponse } from "@/app/serve/getReply";
import { Image } from "antd";
import ReactMarkdown from "react-markdown";
import { useReplyStore } from "@/store/useReplyStore";
import { useMessageStore } from "@/store/useMessageStore";
import styles from "./index.module.css";

export default function QaArea() {
  const { reply } = useReplyStore();
  const { message } = useMessageStore();
  console.log(message);
  return (
    <div className={styles.qaArea}>
      {message.map((item, index) => {
        return (
          <div
            key={index}
            className={
              item.type === "question"
                ? styles.qaAreaQuestion
                : styles.qaAreaAnswer
            }
          >
            <div className={styles.qaAreaContent}>
              <Image src="/DeepSeekImg.webp" width={50} height={50} />
            </div>
            <div className={styles.qaAreaContentItemText}>
              <ReactMarkdown>{item.content}</ReactMarkdown>
            </div>
          </div>
        );
      })}
    </div>
  );
}
