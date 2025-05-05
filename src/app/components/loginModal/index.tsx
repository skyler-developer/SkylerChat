"use client";

import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { GetSession } from "@/app/serve/getSession";

function LoginModal() {
    const {
        isLogin,
        setLogin,
        loginModalVisible,
        setLoginModalVisible,
        setUsername,
        setPassword,
        username,
        password,
        loginOption,
        setLoginOption,
        loginLoading,
        setLoginLoading,
        newPassword,
        setNewPassword,
    } = useUserInfoStore();
    const { setSessionInfo } = useSessionInfoStore();

    const handleOk = async () => {
        console.log("loginOption username password");
        console.log(loginOption, username, password);
        if (loginOption) {
            // 登录
            setLoginLoading(true);
            try {
                const res = await fetch("/api/userInfo/login", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ userName: username, passWord: password }),
                });
                const data = await res.json();
                if (res.ok && data.token) {
                    localStorage.setItem("token", data.token);
                    console.log("登录成功", data);
                    setLoginModalVisible(false);
                    // 你可以在这里设置用户信息到store等
                    setLogin(true);
                    GetSession(username, setSessionInfo); // 更新会话
                } else {
                    // 登录失败的处理
                }
            } catch (e) {
                // 网络或其他错误处理
            } finally {
                setLoginLoading(false);
            }
        } else if (loginOption === false) {
            // 注册
            setLoginLoading(true);
            console.log("注册请求", { username, password });
            try {
                const res = await fetch("/api/userInfo/register", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({ username, password }),
                });
                const data = await res.json();
                if (res.status === 201) {
                    setLoginModalVisible(false);
                    setLoginOption(true); // 切换到登录
                } else {
                    // 注册失败的处理
                }
            } catch (e) {
                // 网络或其他错误处理
            } finally {
                setLoginLoading(false);
            }
        } else if (loginOption === null) {
            // 修改密码
            setLoginLoading(true);
            try {
                const res = await fetch("/api/userInfo/modify", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        username,
                        oldPassword: password,
                        newPassword: newPassword,
                    }),
                });
                const data = await res.json();
                if (res.status === 200) {
                    setLoginModalVisible(false);
                    setLoginOption(true); // 切换到登录
                    GetSession(username, setSessionInfo); // 更新会话
                } else {
                    // 修改密码失败的处理
                }
            } catch (e) {
                // 网络或其他错误处理
            } finally {
                setLoginLoading(false);
            }
        }
    };

    const handleCancel = () => {
        setLoginModalVisible(false);
    };

    const handleLoginOption = (option: boolean | null) => {
        setLoginOption(option);
    };

    return (
        <div>
            <Modal
                title={loginOption ? "登录" : loginOption === null ? "修改密码" : "注册"}
                open={loginModalVisible}
                onCancel={handleCancel}
                footer={[
                    <Button
                        key="back"
                        onClick={() => handleLoginOption(loginOption === null ? false : null)}>
                        {loginOption === null ? "注册" : "修改密码"}
                    </Button>,
                    <Button key="back" onClick={() => handleLoginOption(!loginOption)}>
                        {!loginOption ? "登录" : "注册"}
                    </Button>,
                    <Button key="ok" onClick={handleOk} type="primary">
                        确认
                    </Button>,
                ]}>
                <Input
                    placeholder="请输入用户名"
                    style={{ marginBottom: 16 }}
                    onChange={(e) => {
                        setUsername(e.target.value);
                    }}
                />
                <Input.Password
                    style={{ marginBottom: 16 }}
                    placeholder={loginOption === null ? "请输入旧密码" : "请输入密码"}
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
                {loginOption === null && (
                    <Input.Password
                        placeholder={"请输入新密码"}
                        onChange={(e) => {
                            setNewPassword(e.target.value);
                        }}
                    />
                )}
            </Modal>
        </div>
    );
}

export default LoginModal;
