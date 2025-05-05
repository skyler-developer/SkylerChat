import ollama from "ollama";

/**
 * 根据会话内容生成10字以内的主题标题
 * @param sessionInfo [{role, content}, ...]
 * @returns 标题字符串
 */
export async function generateTitle(sessionInfo: string): Promise<string> {
    // if (!Array.isArray(sessionInfo) || sessionInfo.length === 0) return "";
    const prompt =
        "请根据以下JSON格式的对话内容，生成一个简洁、准确、能概括本次对话主题的标题，尽量使用陈述句，10字以内，直接输出标题，不要加引号：";
    const messages = [
        { role: "user", content: prompt },
        { role: "user", content: `${sessionInfo} /no_think` },
    ];
    console.log("生成标题的消息", messages);
    try {
        const response = await ollama.chat({
            model: "qwen3:0.6b",
            messages,
        });
        console.log("生成标题的响应", response);
        return response.message?.content?.trim().split("</think>")[1] || "";
    } catch (e) {
        console.error("生成标题出错", e);
        return "";
    }
}
