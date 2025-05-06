import React, { useState } from "react";
import { Button, Image } from "antd";
import { DeleteOutlined } from "@ant-design/icons";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useProbeInfoStore } from "@/store/useProbeInfoStore";
import { useModeStore } from "@/store/useModeStore";
import { deleteSession } from "@/app/serve/deleteSession";
import styles from "./index.module.css";

export default function FunctionArea() {
    const { username, isLogin, setLoginOption, setLoginModalVisible } = useUserInfoStore();
    const { setMessage, setSessionId, sessionId, clearMessage } = useMessageStore();
    const { sessionInfo } = useSessionInfoStore();
    const { clearProbeInfo } = useProbeInfoStore();
    const { setMode, mode } = useModeStore();

    const [showSessionList, setShowSessionList] = useState(true);
    const [showUserSetting, setShowUserSetting] = useState(false);

    const handleDeleteSession = (sessionIdParam: string) => {
        deleteSession(sessionIdParam).then((res) => {
            if (res && sessionId === sessionIdParam) {
                setSessionId("");
                clearMessage(); // 清空消息
                clearProbeInfo(); // 清空追问问题
            }
        });
    };

    const handleNewSession = () => {
        if (mode !== "newSession") {
            setSessionId("");
            clearMessage();
            clearProbeInfo();
            setMode("newSession"); // 切换到新对话模式
        }
    };

    console.log("FunctionArea", username);
    return (
        <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
            <div style={{ display: "flex", flexDirection: "column", flex: 1 }}>
                <div className={styles.buttonContainer}>
                    <Button
                        className={styles.button}
                        onClick={handleNewSession}
                        style={{ backgroundColor: mode === "newSession" ? "#fff" : "" }}>
                        新对话
                    </Button>
                </div>
                <div className={styles.buttonContainer}>
                    <Button className={styles.button}>智能体</Button>
                </div>
                <div className={styles.horizontalLine} />
                <div className={styles.buttonContainer}>
                    <Button
                        className={styles.button}
                        style={{
                            marginTop: 20,
                            backgroundColor: mode === "historySession" ? "#fff" : "",
                        }}
                        onClick={() => setShowSessionList((v) => !v)}>
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
                                    className={styles.sessionItem}
                                    style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        alignItems: "center",
                                        width: "100%",
                                        backgroundColor:
                                            sessionId === item.sessionId ? "#fff" : "transparent",
                                    }}
                                    key={index}>
                                    <div
                                        key={index}
                                        style={{ width: "80%" }}
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
                                            setMode("historySession"); // 切换到历史对话模式
                                        }}>
                                        {item.title}
                                    </div>
                                    <DeleteOutlined
                                        onClick={() => {
                                            handleDeleteSession(item.sessionId);
                                        }}
                                        style={{ width: 30, height: 30, fontSize: 20 }}
                                    />
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
