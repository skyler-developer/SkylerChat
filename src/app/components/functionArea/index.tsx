import React from "react";
import { Button, Image } from "antd";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import styles from "./index.module.css";
export default function FunctionArea() {
    const { username, isLogin } = useUserInfoStore();
    console.log("FunctionArea", username);
    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
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
            </div>
            <div className={styles.userInfo}>
                <div className={styles.userImg}>
                    <Image
                        src="/DeepSeekImgf8f8f8.webp"
                        width={50}
                        height={50}
                        preview={false}
                        style={{ borderRadius: 20, overflow: "hidden" }}
                    />
                </div>
                <div className={styles.userName}>
                    {username} - {isLogin ? "用户已登录" : "未登录"}
                </div>
            </div>
        </div>
    );
}
