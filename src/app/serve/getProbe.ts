"use client";
import { useProbeInfoStore } from "@/store/useProbeInfoStore";

/**
 * 获取追问问题数组
 * @returns Promise<Array<{ index: number; content: string }>>
 */
export async function getProbeQuestions(
    sessionContent: string,
): Promise<Array<{ index: number; content: string }>> {
    try {
        const res = await fetch("/api/probe", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ sessionContent }),
        });
        const data = await res.json();
        if (data.success && Array.isArray(data.questions)) {
            console.log("获取追问问题成功:", data.questions);
            const { setProbeInfo } = useProbeInfoStore.getState();
            setProbeInfo(data.questions);
            return data.questions;
        } else {
            return [];
        }
    } catch (error) {
        console.error("获取追问问题失败:", error);
        return [];
    }
}
