import React, { useState } from "react";
import { Input, Button } from "antd";
import { useMessageStore } from "@/store/useMessageStore";
import { SendOutlined } from "@ant-design/icons";
import { getResponse } from "@/app/serve/getReply";
import { useReplyStore } from "@/store/useReplyStore";
import styles from "./index.module.css";

export default function InputArea() {
  const { message, setMessage } = useMessageStore();
  const [inputValue, setInputValue] = useState("");

  const handleSend = () => {
    // TODO: 处理发送消息的逻辑
    console.log("发送消息:", inputValue);
    const { setReply } = useReplyStore.getState();
    setMessage([...message, { type: "question", content: inputValue }]);
    getResponse(inputValue, setReply, setMessage);
    setInputValue("");
  };

  return (
    <div className={styles.inputArea}>
      <div className={styles.inputWrapper}>
        <Input.TextArea
          style={{
            border: "none",
            height: "100%",
            boxShadow: "none",
          }}
          className={styles.textArea}
          size="small"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="请输入消息..."
          autoSize={{ minRows: 3, maxRows: 6 }}
        />
        <Button
          type="primary"
          icon={<SendOutlined />}
          className={styles.sendButton}
          onClick={handleSend}
        />
      </div>
    </div>
  );
}
