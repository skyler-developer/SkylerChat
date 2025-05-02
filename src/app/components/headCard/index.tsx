"use client";

import React from "react";
import { Image } from "antd";
import styles from "./index.module.css";
export default function HeadCard() {
  return (
    <div className={styles.headCard}>
      <Image src="/DeepSeekImgf8f8f8.webp" alt="headCard" style={{ width: 50, height: 50 }} />
      <div className={styles.headCardTitle}>
        Skyler 智能助理
      </div>
    </div>
  );
}