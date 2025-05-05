import { useSessionInfoStore } from "@/store/useSessionInfoStore";
import { useUserInfoStore } from "@/store/useUserInfoStore";
import { GetSession } from "./getSession";

/**
 * 删除会话
 * @param sessionId 会话ID
 * @returns Promise<boolean> 是否删除成功
 */
export async function deleteSession(sessionId: string): Promise<boolean> {
    try {
        const res = await fetch("/api/deleteSession", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionId }),
        });
        const data = await res.json();
        if (data.success) {
            // 删除成功后，更新会话列表
            const { setSessionInfo } = useSessionInfoStore.getState();
            const { username } = useUserInfoStore.getState();
            await GetSession(username, setSessionInfo);
        } else {
            console.error("删除会话失败:", data.message);
        }
        return data.success === true;
    } catch (error) {
        console.error("删除会话失败:", error);
        return false;
    }
}
