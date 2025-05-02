"use client";

import React, { useState } from "react";
import { Modal, Input, Button } from "antd";

function LoginModal() {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    return (
        <div>
            <Button type="primary" onClick={showModal}>
                登录
            </Button>
            <Modal title="登录" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                <Input placeholder="请输入用户名" style={{ marginBottom: 16 }} />
                <Input.Password placeholder="请输入密码" />
            </Modal>
        </div>
    );
}

export default LoginModal;
