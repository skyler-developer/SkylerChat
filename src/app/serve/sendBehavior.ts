// 实现发送用户行为函数，调用recordBehavior接口

export async function sendBehavior({
    userName,
    intelligentAgentName,
    sessionId,
    interactionType,
}: {
    userName: string;
    intelligentAgentName: string;
    sessionId: string;
    interactionType: "view" | "use" | "complete";
}) {
    const response = await fetch("/api/intelligentAgent/recordBehavior", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userName, intelligentAgentName, sessionId, interactionType }),
    });
    return response.json();
}
