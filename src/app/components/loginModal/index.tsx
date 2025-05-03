"use client";

import React, { useState } from "react";
import { Modal, Input, Button } from "antd";
import { useLoginStore } from "@/store/useLoginStore";

function LoginModal() {
    const {
        loginModalVisible,
        setLoginModalVisible,
        setUsername,
        setPassword,
        username,
        password,
        loginOption,
        setLoginOption,
        loginError,
        setLoginError,
        loginSuccess,
        setLoginSuccess,
        loginLoading,
        setLoginLoading,
    } = useLoginStore();

    const showModal = () => {
        setLoginModalVisible(true);
    };

    const handleOk = async () => {
        console.log("loginOption username password");
        console.log(loginOption, username, password);
        if (!loginOption) {
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
                    setLoginSuccess("注册成功，请登录");
                    setLoginModalVisible(false);
                    setLoginOption(true); // 切换到登录
                } else {
                    setLoginError(data.message || "注册失败");
                }
            } catch (e) {
                setLoginError("注册请求异常");
            } finally {
                setLoginLoading(false);
            }
        } else {
            setLoginModalVisible(false);
        }
    };

    const handleCancel = () => {
        setLoginModalVisible(false);
    };

    const handleLoginOption = (option: boolean) => {
        setLoginOption(option);
    };

    return (
        <div>
            <Button type="primary" onClick={showModal}>
                登录
            </Button>
            <Modal
                title={loginOption ? "登录" : "注册"}
                open={loginModalVisible}
                onCancel={handleCancel}
                footer={[
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
                    placeholder="请输入密码"
                    onChange={(e) => {
                        setPassword(e.target.value);
                    }}
                />
            </Modal>
        </div>
    );
}

export default LoginModal;
