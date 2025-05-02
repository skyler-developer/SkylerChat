"use client";

import React from "react";
import { Image } from "antd";
import styles from "./index.module.css";
export default function HeadCard() {
  return (
    <div className={styles.headCard}>
      <Image src="/DeepSeekImg.webp" alt="headCard" style={{ width: 50, height: 50 }} />
      <div className={styles.headCardTitle}>
        Skyler-Chat
      </div>
    </div>
  );
}