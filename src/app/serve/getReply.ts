"use client";

import { useReplyStore } from "@/store/useReplyStore";
import { useMessageStore } from "@/store/useMessageStore";
import { useUserInfoStore } from "@/store/useUserInfoStore";

export async function getResponse(
    messageParam: string,
    setReply: (reply: string) => void,
    setMessage: (message: { type: "question" | "answer"; content: string }[]) => void,
) {
    const { username, uuid, isLogin } = useUserInfoStore.getState();
    try {
        const res = await fetch("/api/chat", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ message: messageParam, isLogin, username, uuid }),
        });

        if (!res.body) {
            throw new Error("响应体为空");
        }

        const reader = res.body.getReader();
        const decoder = new TextDecoder();
        let accumulatedResponse = "";
        const { setLoading } = useReplyStore.getState();
        setLoading(true);
        while (true) {
            const { done, value } = await reader.read();
            if (done) {
                const currentMessages = useMessageStore.getState().message;
                setLoading(false);
                setMessage([...currentMessages, { type: "answer", content: accumulatedResponse }]);
                break;
            }

            const text = decoder.decode(value);
            accumulatedResponse += text;
            setReply(accumulatedResponse);
        }
    } catch (error) {
        console.error("Error:", error);
        setReply("获取回答时出错");
    }
}
