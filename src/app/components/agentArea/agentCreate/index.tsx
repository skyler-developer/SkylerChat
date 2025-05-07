// 创建智能体页面

import React from "react";
import { Button, Form, Input, message, Switch } from "antd";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { useModeStore } from "@/store/useModeStore";
import { useRouter } from "next/navigation";

const AgentCreate: React.FC = () => {
    const { username } = useUserInfoStore();
    const { setMode } = useModeStore();
    const [form] = Form.useForm();

    const onFinish = async (values: any) => {
        try {
            console.log(values);
            const response = await fetch("/api/intelligentAgent/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    intelligentAgentName: values.agentName,
                    agentData: values.agentData,
                    userName: username,
                    isPublic: values.isPublic,
                    headPicture: values.agentAvatar,
                }),
            });

            const data = await response.json();

            if (response.ok) {
                message.success(data.message);
                setMode("agentShow"); // 创建成功后切换到智能体展示页面
                // 清空表单
                form.resetFields();
            } else {
                // 处理重复名称的情况
                if (data.code === "DUPLICATE_AGENT_NAME") {
                    message.error(data.message);
                    // 聚焦到名称输入框
                    form.setFields([
                        {
                            name: "agentName",
                            errors: [data.message],
                        },
                    ]);
                } else {
                    message.error(data.message || "创建失败");
                }
            }
        } catch (error) {
            console.error("创建智能体时出错:", error);
            message.error("创建失败，请稍后重试");
        }
    };

    return (
        <div
            style={{
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <div
                style={{
                    width: "60%",
                    height: "80%",
                    backgroundColor: "#f8f8f8",
                    padding: "50px",
                    borderRadius: "10px",
                }}>
                <Form
                    form={form}
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 18 }}
                    labelAlign="left"
                    onFinish={onFinish}>
                    <Form.Item
                        name="agentName"
                        label="智能体名称"
                        rules={[{ required: true, message: "请输入智能体名称" }]}>
                        <Input />
                    </Form.Item>
                    {/* 智能体头像 */}
                    <Form.Item name="agentAvatar" label="智能体头像URL">
                        <Input />
                    </Form.Item>
                    <Form.Item
                        name="agentData"
                        label="智能体提示词"
                        rules={[{ required: true, message: "请输入智能体提示词" }]}>
                        <Input.TextArea rows={10} />
                    </Form.Item>
                    <Form.Item name="isPublic" label="是否公开" valuePropName="checked">
                        <Switch />
                    </Form.Item>
                    <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
                        <Button type="primary" htmlType="submit">
                            创建
                        </Button>
                    </div>
                </Form>
            </div>
        </div>
    );
};

export default AgentCreate;
