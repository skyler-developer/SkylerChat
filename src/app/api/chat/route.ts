import { NextRequest } from "next/server";
import ollama from "ollama";
import { db } from "../userInfo/router";

export async function POST(request: NextRequest) {
    try {
        const { message, username, sessionId } = await request.json();

        let rows;
        let historySession = null;
        try {
            // 查询 sessionrecords 表
            [rows] = await db.query("SELECT * FROM sessionrecords WHERE sessionId = ?", [
                sessionId,
            ]);
            console.log("Session Records:", rows);
            historySession = (rows as any[])?.[0]?.sessionInfo || [];
        } catch (dbError) {
            console.error("Database query error:", dbError);
            return new Response(JSON.stringify({ error: "数据库查询出错" }), {
                status: 500,
                headers: {
                    "Content-Type": "application/json",
                },
            });
        }

        const encoder = new TextEncoder();
        const stream = new ReadableStream({
            async start(controller) {
                let fullContent = "";
                const response = await ollama.chat({
                    model: "deepseek-r1",
                    messages: [
                        {
                            role: "user",
                            content:
                                "请所有的回答都采用markdown格式输出，为了良好的阅读体验，回答内容尽量采用结构化的方式输出，使用标题、列表等格式化内容。",
                        },
                        ...historySession,
                        { role: "user", content: message },
                    ],
                    stream: true, // 启用流式输出
                });

                for await (const chunk of response) {
                    const text = chunk.message?.content || "";
                    fullContent += text;
                    controller.enqueue(encoder.encode(text));
                }
                controller.close();

                // 数据库存储逻辑
                try {
                    const timeStamp = Date.now();
                    const sessionInfo = JSON.stringify([
                        ...historySession,
                        {
                            role: "user",
                            content: message,
                        },
                        {
                            role: "assistant",
                            content: fullContent,
                        },
                    ]);
                    if ((rows as any[]).length > 0) {
                        // 已存在，更新
                        await db.query(
                            "UPDATE sessionrecords SET timeStamp = ?, sessionInfo = ? WHERE sessionId = ?",
                            [timeStamp, sessionInfo, sessionId],
                        );
                    } else {
                        // 不存在，插入
                        await db.query(
                            "INSERT INTO sessionrecords (username, sessionId, timeStamp, sessionInfo) VALUES (?, ?, ?, ?)",
                            [username, sessionId, timeStamp, sessionInfo],
                        );
                    }
                } catch (dbInsertError) {
                    console.error("Database insert error:", dbInsertError);
                }
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
