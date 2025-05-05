import React, { useState } from "react";
import { Button, Image } from "antd";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useProbeInfoStore } from "@/store/useProbeInfoStore";
import styles from "./index.module.css";

export default function FunctionArea() {
    const { username, isLogin, setLoginOption, setLoginModalVisible } = useUserInfoStore();
    const { setMessage, setSessionId } = useMessageStore();
    const { sessionInfo } = useSessionInfoStore();
    const { clearProbeInfo } = useProbeInfoStore();
    const [showSessionList, setShowSessionList] = useState(true);
    const [showUserSetting, setShowUserSetting] = useState(false);

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
                                <div
                                    key={index}
                                    className={styles.sessionItem}
                                    onClick={() => {
                                        clearProbeInfo(); // 清空追问问题
                                        setSessionId(item.sessionId);
                                        setMessage(
                                            item.sessionInfo.map((item: any) => {
                                                return {
                                                    type:
                                                        item.role === "user"
                                                            ? "question"
                                                            : "answer",
                                                    content: item.content,
                                                };
                                            }),
                                        );
                                    }}>
                                    {item.title}
                                </div>
                            ))}
                    </div>
                </div>
            </div>

            <div className={styles.userInfo}>
                <div className={styles.userImg} onClick={() => setShowUserSetting((v) => !v)}>
                    <Image
                        src="/DeepSeekImgf8f8f8.webp"
                        width={50}
                        height={50}
                        preview={false}
                        style={{ borderRadius: 20, overflow: "hidden" }}
                    />
                    <div
                        className={styles.userInfoSetting}
                        style={{ visibility: showUserSetting ? "visible" : "hidden" }}>
                        <div>{isLogin ? "已登录" : "未登录"}</div>
                        <div
                            style={{
                                color: "#121924",
                                fontSize: 18,
                                marginTop: 10,
                                marginBottom: 10,
                            }}>
                            {isLogin ? username : "游客"}
                        </div>
                        <Button
                            style={{ marginBottom: 10 }}
                            onClick={() => {
                                setLoginOption(isLogin ? null : true);
                                setLoginModalVisible(true);
                            }}>
                            {isLogin ? "修改密码" : "登录"}
                        </Button>
                        {isLogin && (
                            <Button
                                onClick={() => {
                                    localStorage.removeItem("token");
                                    window.location.reload();
                                }}>
                                退出登录
                            </Button>
                        )}
                    </div>
                </div>
                <div className={styles.userName}>
                    {username} - {isLogin ? "用户已登录" : "未登录"}
                </div>
            </div>
        </div>
    );
}
