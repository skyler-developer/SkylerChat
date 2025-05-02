import React from "react";
import { Button, Image } from "antd";
import styles from "./index.module.css";
export default function FunctionArea() {
    return (
        <div style={{ display: "flex", flexDirection: "column", height: "500px" }}>
            <div className={styles.buttonContainer}>
                <Button className={styles.button}>新对话</Button>
            </div>
            <div className={styles.buttonContainer}>
                <Button className={styles.button}>智能体</Button>
            </div>
            <div className={styles.horizontalLine} />
            <div className={styles.buttonContainer}>
                <Button className={styles.button}>最近对话</Button>
            </div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    // padding: "10px",
                    marginTop: "auto",
                    height: "100px",
                }}>
                <Image src="/DeepSeekImgf8f8f8.webp" width={50} height={50} preview={false} />
                <div>userName</div>
            </div>
        </div>
    );
}
