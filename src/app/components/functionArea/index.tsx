import React, { useState } from "react";
import { Button, Image } from "antd";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import styles from "./index.module.css";

export default function FunctionArea() {
    const { username, isLogin } = useUserInfoStore();
    const { sessionInfo } = useSessionInfoStore();
    const [showSessionList, setShowSessionList] = useState(true);
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
                    <Button className={styles.button} onClick={() => setShowSessionList((v) => !v)}>
                        最近对话
                    </Button>
                </div>
                <div>
                    <div
                        // 最终效果是 class="a b"
                        className={
                            styles.sessionContainer +
                            " " +
                            (showSessionList
                                ? styles.sessionContainerOpen
                                : styles.sessionContainerClose)
                        }>
                        {Array.isArray(sessionInfo) &&
                            sessionInfo?.map((item, index) => (
                                <div key={index} className={styles.sessionItem}>
                                    {item.userName} {item.timeStamp}
                                </div>
                            ))}
                    </div>
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
