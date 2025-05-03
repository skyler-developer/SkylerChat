import { NextRequest } from "next/server";
import ollama from "ollama";

export async function POST(request: NextRequest) {
    try {
        const { message } = await request.json();

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                const response = await ollama.chat({
                    model: "deepseek-r1",
                    messages: [
                        {
                            role: "user",
                            content:
                                "请所有的回答都采用markdown格式输出，为了良好的阅读体验，回答内容尽量采用结构化的方式输出，使用标题、列表等格式化内容。",
                        },
                        { role: "user", content: message },
                    ],
                    stream: true, // 启用流式输出
                });

                for await (const chunk of response) {
                    const text = chunk.message?.content || "";
                    controller.enqueue(encoder.encode(text));
                }
                controller.close();
            },
        });

        return new Response(stream, {
            headers: {
                "Content-Type": "text/event-stream",
                "Cache-Control": "no-cache",
                Connection: "keep-alive",
            },
        });
    } catch (error) {
        console.error("Error:", error);
        return new Response(JSON.stringify({ error: "获取回答时出错" }), {
            status: 500,
            headers: {
                "Content-Type": "application/json",
            },
        });
    }
}
