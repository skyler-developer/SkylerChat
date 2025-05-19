import React from "react";
import { message } from "antd";

const MessageTip = () => {
    const [messageApi, messageContextHolder] = message.useMessage();

    return <div>{messageContextHolder}</div>;
};

export default MessageTip;
