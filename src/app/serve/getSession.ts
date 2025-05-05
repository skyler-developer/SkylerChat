"use client";

import { useUserInfoStore } from "@/store/useUserInfoStore";

export function GetSession(userNameParam: string, setSessionInfo: (sessionInfo: any) => void) {
    // const { setSessionId, setSessionInfo } = useSessionInfoStore.getState();

    const fetchSessionId = async () => {
        const userName = useUserInfoStore.getState().username;
        try {
            const res = await fetch("/api/sessionInfo/getSession", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ userName: userNameParam || userName }),
            });
            const data = await res.json();
            if (data.success) {
                console.log("获取sessionId成功", data.msg);
                setSessionInfo(data.msg);
            }
        } catch (error) {
            console.error("Error fetching session ID:", error);
        }
    };

    fetchSessionId();

    return null;
}
